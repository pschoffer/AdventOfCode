import * as path from 'path';
import * as fs from 'fs';
import { explode, parseArea } from '../lib/area.js';
import { allIndexesOf } from '../lib/strings.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);

    let result = 0;

    for (let ix = 0; ix < (input.operatorParts?.length || 0); ix++) {
        const operation = input.operatorParts?.[ix] || '+'
        let localResult = operation === '+' ? 0 : 1;

        for (let numbers of input.numberParts) {
            const number = numbers[ix] || 0;

            if (operation === '+') {
                localResult += number;
            } else {
                localResult *= number;
            }
        }

        console.log('LocalResult', localResult);
        result += localResult;

    }


    console.log('result', result)
}

const parseInput = (inputPath: string) => {
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines: string[] = data.split("\n");

    const spaceIndexes = lines.map(line => allIndexesOf(line, ' '))

    const breakIndexes: number[] = [];
    for (let candidateIx of spaceIndexes[0] || []) {
        if (spaceIndexes.every(spaceIndexesForLine => spaceIndexesForLine.includes(candidateIx))) {
            breakIndexes.push(candidateIx);
        }
    }

    const lineParts = lines.map(line => breakStringByIndexes(line, breakIndexes))
    const numberParts: number[][] = []

    for (let ix = 0; ix < lineParts.length - 1; ix++) {
        numberParts.push((lineParts[ix] || []).map(Number));
    }
    const operatorParts = lineParts[lineParts.length - 1];

    return { numberParts, operatorParts };
}

const breakStringByIndexes = (source: string, breakIxs: number[]) => {
    let lastIndex = 0;

    const parts: string[] = [];
    for (let breakIx of breakIxs) {
        const part = source.slice(lastIndex, breakIx)
        parts.push(part)
        lastIndex = breakIx;
    }
    parts.push(source.slice(lastIndex))


    for (let ix = 0; ix < parts.length; ix++) {
        parts[ix] = parts[ix]?.replaceAll(/\s*/g, '') || '';
    }

    return parts;
}

run();
