const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test2.txt');

const run = async () => {
    const input = parsePath(inputPath);

    let sum = 0;
    for (const line of input) {
        const finalNumber = "" + findNumber(line, true) + findNumber(line, false);

        sum += Number(finalNumber);

        console.log(`${sum}: ${line} => ${finalNumber}`);
    }
    console.log(sum);

}

const test = (index, bestIndex, start) => {
    if (index < 0) {
        return false;
    }

    if (start && index < bestIndex) {
        return true;
    }

    if (!start && index > bestIndex) {
        return true;
    }
    return false;
}

const findNumber = (line, start) => {
    let number = 0;
    let ix = start ? line.length : -1;

    for (let candidate = 1; candidate < 10; candidate++) {
        const foundIx = start ? line.indexOf(candidate) : line.lastIndexOf(candidate);
        if (test(foundIx, ix, start)) {
            ix = foundIx;
            number = candidate;
        }


        const wordCandidate = mapNumberToWord(candidate);
        const foundWordIx = start ? line.indexOf(wordCandidate) : line.lastIndexOf(wordCandidate);
        if (test(foundWordIx, ix, start)) {
            ix = foundWordIx;
            number = candidate;
        }

    }

    return number;

}

const mapNumberToWord = (number) => {
    switch (number) {
        case 1:
            return 'one';
        case 2:
            return 'two';
        case 3:
            return 'three';
        case 4:
            return 'four'
        case 5:
            return 'five'
        case 6:
            return 'six'
        case 7:
            return 'seven'
        case 8:
            return 'eight'
        case 9:
            return 'nine'
    }
}

const mapNumber = (numberString) => {
    if (Number(numberString)) {
        return Number(numberString);
    }

    switch (numberString) {
        case 'one':
            return 1;
        case 'two':
            return 2;
        case 'three':
            return 3;
        case 'four':
            return 4;
        case 'five':
            return 5;
        case 'six':
            return 6;
        case 'seven':
            return 7;
        case 'eight':
            return 8;
        case 'nine':
            return 9;
    }
    throw new Error('Invalid number');
}

const parsePath = (inputPath) => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');

    const lines = data.split('\n');

    return lines;
}


run();
