const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');
const math = require('../lib/math')


const run = async () => {
    // const input = parseInput(inputTestPath);
    const input = parseInput(inputPath);

    let inBoth: string[] = []
    for (const rugsag of input) {
        inBoth.push(...[...rugsag.inBoth]);
    }
    const prios = inBoth.map(getPriority);
    console.log('inBoth', math.sum(prios));
}

const getPriority = (item: string) => {
    let charCode = item.charCodeAt(0);

    if (charCode >= 'a'.charCodeAt(0)) {
        return charCode - 'a'.charCodeAt(0) + 1;
    } else {
        return charCode - 'A'.charCodeAt(0) + 27;
    }

}

interface Compartment {
    itemSet: Set<string>
}


interface Rugsag {
    compartments: [Compartment, Compartment]
    inBoth: Set<string>
}

const parseInput = (inputPath: string) => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines = data.split("\n");

    const result: Rugsag[] = [];

    for (const line of lines) {
        const chars = line.split("");
        const compartments: [Compartment, Compartment] = [{ itemSet: new Set() }, { itemSet: new Set() }];
        const inBoth = new Set<string>();

        compartments[0].itemSet = new Set(chars.slice(0, chars.length / 2));
        for (const item of chars.slice(chars.length / 2)) {
            compartments[1].itemSet.add(item);
            if (compartments[0].itemSet.has(item)) {
                inBoth.add(item);
            }

        }

        result.push({
            compartments,
            inBoth
        });
    }

    return result;
}

run();
