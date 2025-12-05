import * as path from 'path';
import * as fs from 'fs';
import { explode, parseArea } from '../lib/area.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);

    let combinedRanges: [number, number][] = [...input.ranges];
    combinedRanges.sort((a, b) => a[0] - b[0]);
    let didRefinement = false;

    do {
        didRefinement = false;
        let newCombinedRanges: [number, number][] = []
        for (let currentRange of combinedRanges) {
            let shouldCombine = false;
            for (let ix = 0; ix < newCombinedRanges.length; ix++) {
                const candidateRange = newCombinedRanges[ix];
                if (!candidateRange) {
                    continue;
                }
                if (currentRange[0] >= candidateRange[0] && currentRange[0] <= candidateRange[1]) {
                    shouldCombine = true;
                }
                if (currentRange[1] >= candidateRange[0] && currentRange[1] <= candidateRange[1]) {
                    shouldCombine = true;
                }

                if (shouldCombine) {
                    const newRange: [number, number] = [Math.min(candidateRange[0], currentRange[0]), Math.max(candidateRange[1], currentRange[1])];
                    newCombinedRanges[ix] = newRange;
                    break;
                }
            }
            if (!shouldCombine) {
                newCombinedRanges.push(currentRange);
            }
        }
        console.log(`Refining ranges, old ${combinedRanges.length}, new ${newCombinedRanges.length}`)
        didRefinement = newCombinedRanges.length < combinedRanges.length;
        combinedRanges = newCombinedRanges;
        combinedRanges.sort((a, b) => a[0] - b[0]);
    } while (didRefinement)

    let result = 0;
    for (let range of combinedRanges) {
        result += range[1] - range[0] + 1;
    }

    console.log(`Result ${result}`)
}


const parseInput = (inputPath: string) => {
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines: string[] = data.split("\n");

    const ranges: [number, number][] = []
    const ids = []

    let parsingRanges = true;
    for (const line of lines) {
        if (!line) {
            parsingRanges = false;
            continue;
        }

        if (parsingRanges) {
            const range = line.split('-').map(Number) as [number, number]
            ranges.push(range)
        } else {
            ids.push(Number(line))
        }
    }

    return { ranges, ids };
}

run();
