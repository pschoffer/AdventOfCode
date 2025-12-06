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

    for (let problem of input) {
        const operation = problem.operator;
        let localResult = operation === '+' ? 0 : 1;

        for (let number of problem.numbers) {
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

interface Problem {
    operator: string;
    numbers: number[];
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
    const numberParts = lineParts.slice(0, -1)
    const operationParts = lineParts[lineParts.length - 1];
    const problems: Problem[] = []

    for (let problemIx = 0; problemIx < numberParts[0]!.length; problemIx++) {
        const problemWidth = numberParts[0]![problemIx]!.length;
        const numbers: number[] = [];
        for (let charIx = 0; charIx < problemWidth; charIx++) {
            let numberString = ''
            for (let lineIx = 0; lineIx < (numberParts.length || 0); lineIx++) {
                const char = numberParts[lineIx]![problemIx]?.charAt(charIx);
                numberString += char;
            }
            numbers.push(Number(numberString))
        }
        problems.push({ numbers, operator: operationParts![problemIx]!.trim() })
    }

    return problems;
}

const breakStringByIndexes = (source: string, breakIxs: number[]) => {
    let lastIndex = -1;

    const parts: string[] = [];
    for (let breakIx of breakIxs) {
        const part = source.slice(lastIndex + 1, breakIx)
        parts.push(part)
        lastIndex = breakIx;
    }
    parts.push(source.slice(lastIndex + 1))

    return parts;
}

run();
