import { group } from "../lib/math";

const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');
const math = require('../lib/math')


const run = async () => {
    // const input = parseInput(inputTestPath);
    const input = parseInput(inputPath);

    const badges = input.map(findBadge).map(getPriority);

    console.log('badges', math.sum(badges));

}

const findBadge = (group: Group): string => {
    const firstRugsag = group.rugsags[0];

    for (const item of firstRugsag.items) {
        if (group.rugsags.every(r => r.items.has(item))) {
            return item;
        }
    }

    throw Error('notFound')
}

const getPriority = (item: string) => {
    let charCode = item.charCodeAt(0);

    if (charCode >= 'a'.charCodeAt(0)) {
        return charCode - 'a'.charCodeAt(0) + 1;
    } else {
        return charCode - 'A'.charCodeAt(0) + 27;
    }

}

interface Group {
    rugsags: Rugsag[];
}


interface Rugsag {
    items: Set<string>
}

const parseInput = (inputPath: string) => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines = data.split("\n") as string[];

    const result: Group[] = [];

    const groupedLines = group(lines, 3);
    for (const groupedLine of groupedLines) {
        const rugsags: Rugsag[] = []
        for (const line of groupedLine) {
            const chars = line.split("");

            rugsags.push({
                items: new Set(chars),
            });
        }
        result.push({ rugsags })
    }


    return result;
}

run();
