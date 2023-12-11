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
        cache: {}
    }));

    let allDone = false;

    let counter = 0;
    while (!allDone) {
        counter++;
        const shortestStatus = statuses[0];
        if (counter % 1000 === 0) {
            console.log(`${shortestStatus.start} ${shortestStatus.length}: ${shortestStatus.current} ${shortestStatus.ip}`);
        }

        findEnd(input, shortestStatus, ends);

        statuses.sort((a, b) => a.length - b.length);

        const lengths = statuses.map(status => status.length);
        allDone = lengths.every(length => length === lengths[0]);
    }

    return statuses[0].length;
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
