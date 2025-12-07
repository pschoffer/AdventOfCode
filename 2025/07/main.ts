import * as path from 'path';
import * as fs from 'fs';
import { explode, parseArea } from '../lib/area.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);

    const lastSpliterY = Math.max(...Object.keys(input.splitters).map(Number))
    let splitCount = 0;
    let activeBeams = input.beams;
    while (activeBeams.length) {
        let newActiveBeamStrings: Set<string> = new Set();
        for (const beam of activeBeams) {
            const candidate: number[] = [beam[0]! + 1, beam[1]!]
            const isSpliter = input.splitters[candidate[0]!]?.has(candidate[1]!);

            if (isSpliter) {
                splitCount++;
                newActiveBeamStrings.add(JSON.stringify([candidate[0]!, candidate[1]! - 1]));
                newActiveBeamStrings.add(JSON.stringify([candidate[0]!, candidate[1]! + 1]));
            } else {
                newActiveBeamStrings.add(JSON.stringify(candidate))
            }
        }

        const newActiveBeams = [...newActiveBeamStrings]
            .map(beamString => JSON.parse(beamString) as number[])
            .filter(beam => beam[0]! <= lastSpliterY);

        activeBeams = newActiveBeams;
        console.log('New beams', JSON.stringify(activeBeams))
    }

    console.log(splitCount)
}

const parseInput = (inputPath: string) => {
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines: string[] = data.split("\n");

    const beams = [];
    const splitters: Record<number, Set<number>> = {};

    for (let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines[y]!.length; x++) {
            const char = lines[y]?.charAt(x);
            if (char === 'S') {
                beams.push([y, x]);
            } else if (char === '^') {
                if (!splitters[y]) {
                    splitters[y] = new Set();
                }
                splitters[y]?.add(x);
            }

        }
    }

    return { beams, splitters };
}

run();
