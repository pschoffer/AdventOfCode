const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');
const { sum, mul } = require(__dirname + '/../lib/math')

const run = async () => {
    const input = parsePath(inputPath);



    const steps = findLength(input)

    console.log(steps);

}

const findLength = (input) => {
    const starts = Object.keys(input.nodes).filter(node => node.endsWith('A'));
    const ends = Object.keys(input.nodes).filter(node => node.endsWith('Z'));

    const statuses = starts.map(start => ({
        start,
        current: start,
        ip: 0,
        length: 0,
        cache: {},
        loopStart: null,
        loopSize: 0,
        matchStarted: {},
        matchEnded: {},
    }));

    let allDone = false;

    let counter = 0;
    let remainingStatuses = [...statuses];
    while (!allDone) {
        counter++;
        const shortestStatus = remainingStatuses[0];

        findEnd(input, shortestStatus, ends);

        const key = getKey(shortestStatus);

        if (key === shortestStatus.loopStart) {
            shortestStatus.finishedLoop = true;
            shortestStatus.loopSize = shortestStatus.length - shortestStatus.loopStartLength;
            remainingStatuses = remainingStatuses.filter(status => !status.finishedLoop);
        } else if (shortestStatus.cache[key]) {
            shortestStatus.loopStart = key;
            shortestStatus.loopStartLength = shortestStatus.length;
        } else {
            shortestStatus.cache[key] = true;
        }

        remainingStatuses.sort((a, b) => a.length - b.length);

        allDone = remainingStatuses.length === 0;
    }

    allDone = false;
    while (!allDone) {
        statuses.sort((a, b) => a.length - b.length);

        const shortestStatus = statuses[0];
        const longestStatus = statuses[statuses.length - 1];

        const diff = longestStatus.length - shortestStatus.length;
        const howManyLoopsAway = Math.floor(diff / shortestStatus.loopSize);
        if (diff % shortestStatus.loopSize === 0) {
            shortestStatus.length += howManyLoopsAway * shortestStatus.loopSize;

            if (!shortestStatus.matchStarted[longestStatus.current]) {
                shortestStatus.matchStarted[longestStatus.current] = shortestStatus.length;
            } else if (shortestStatus.matchStarted[longestStatus.current] && !shortestStatus.matchEnded[longestStatus.current]) {
                shortestStatus.matchEnded[longestStatus.current] = true;
                const matchLength = shortestStatus.length - shortestStatus.matchStarted[longestStatus.current];
                if (matchLength > shortestStatus.loopSize) {
                    shortestStatus.loopSize = matchLength;
                }
            }
        } else {
            shortestStatus.length += (howManyLoopsAway + 1) * shortestStatus.loopSize;
        }


        allDone = statuses.every(status => status.length === statuses[0].length);
    }

    return statuses[0].length;
}

const getKey = (status) => {
    return `${status.current}${status.ip}`;
}

const findEnd = (input, status, ends) => {

    do {
        const childIx = input.instructions[status.ip] === 'L' ? 0 : 1;
        status.ip = status.ip === input.instructions.length - 1 ? 0 : status.ip + 1;
        status.current = input.nodes[status.current][childIx];

        status.length++;
    } while (!ends.includes(status.current))


    return status.length;

}


const parsePath = (inputPath) => {

    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');

    const lines = data.split('\n');
    const input = {
        instructions: lines[0].split(''),
        nodes: {}
    };

    // AAA = (BBB, BBB)
    for (let ix = 2; ix < lines.length; ix++) {
        const nodeString = lines[ix];

        const match = nodeString.match(/(\w+) = \((\w+), (\w+)\)/);
        const [_, name, left, right] = match;
        input.nodes[name] = [left, right];
    }


    return input
}


run();
