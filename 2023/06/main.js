const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');
const { sum, mul } = require(__dirname + '/../lib/math')

const run = async () => {
    const input = parsePath(inputPath);

    const waysToBeat = countWaysToWin(input);

    console.log(waysToBeat);

}

const countWaysToWin = (race) => {
    const { time, distanceToBeat } = race;

    const up = findChange(0, time, time, distanceToBeat, 'up');
    const down = findChange(0, time, time, distanceToBeat, 'down');

    return down - up + 1;
}

const isBetter = (test, time, distanceToBeat) => {
    const distance = test * (time - test);
    return distance > distanceToBeat;
}

const findChange = (start, end, time, distanceToBeat, mode) => {
    if (end === start) {
        return end;
    } else if (end - start === 1) {
        const candidates = mode === 'up' ? [start, end] : [end, start];
        const betterCandidate = candidates.find(candidate => isBetter(candidate, time, distanceToBeat));
        return betterCandidate || end;
    }

    const test = Math.floor((start + end) / 2);

    const isBetterResult = isBetter(test, time, distanceToBeat);
    console.log(`${start} <-> ${end} = ${test} - ${isBetterResult}`)

    let newStart = start;
    let newEnd = end;
    if (mode === 'up') {
        if (isBetterResult) {
            newEnd = test;
        } else {
            newStart = test + 1;
        }
    } else {
        if (isBetterResult) {
            newStart = test;
        } else {
            newEnd = test - 1;
        }
    }

    return findChange(newStart, newEnd, time, distanceToBeat, mode);
}

const parsePath = (inputPath) => {

    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');

    const lines = data.split('\n');

    const timeSting = lines[0].split(':')[1].trim();
    const distanceString = lines[1].split(':')[1].trim();


    const time = Number(timeSting.split(/\s+/g).join(''))
    const distance = Number(distanceString.split(/\s+/g).join(''))

    return { time, distanceToBeat: distance }
}


run();
