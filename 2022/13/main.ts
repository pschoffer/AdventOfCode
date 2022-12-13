const { splitArrayBy } = require("../lib/input");

const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);
    // const input = parseInput(inputTestPath);

    const sep1: Item = [[2]];
    const sep2: Item = [[6]];

    input.push(sep1, sep2);

    input.sort(compare);


    // let result = 0;
    const indexes: number[] = [];
    for (let ix = 0; ix < input.length; ix++) {
        if (compare(input[ix], sep1) === 0 || compare(input[ix], sep2) == 0) {
            indexes.push(ix + 1);
        }
    }

    console.log(indexes[0] * indexes[1]);
}

// 6576 - too high

const compare = (a: Item, b: Item): number => {
    if (Number.isInteger(a) && Number.isInteger(b)) {
        return Number(a) - Number(b);
    }

    const aArr = [...Array.isArray(a) ? a : [a]];
    const bArr = [...Array.isArray(b) ? b : [b]];

    while (true) {
        const aEl = aArr.shift();
        const bEl = bArr.shift();

        if (aEl === undefined && bEl === undefined) {
            return 0;
        }

        if (aEl === undefined) {
            return -1;
        }

        if (bEl === undefined) {
            return 1;
        }

        const result = compare(aEl, bEl);
        if (result !== 0) {
            return result;
        }
    }
}

const parseInput = (inputPath: string): Item[] => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines = data.split("\n");

    const result: Item[] = [];

    for (const line of lines) {
        if (line === '') {
            continue;
        }
        result.push(eval(line));
    }

    return result;
}


type Item = number | Item[];

run();
