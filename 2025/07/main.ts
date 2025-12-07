import * as path from 'path';
import * as fs from 'fs';
import { explode, parseArea } from '../lib/area.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);

    const lastSpliterY = Math.max(...Object.keys(input.splitters).map(Number))
    let calculatedTimelines: Record<number, Record<number, number>> = {}

    const calculateExtraTimelines = (start: number[]) => {
        const alreadyCalculated = calculatedTimelines[start[0]!]?.[start[1]!]
        if (alreadyCalculated !== undefined) {
            return alreadyCalculated
        }

        if (start[0]! > lastSpliterY) {
            return 1;
        }

        const candidate = [start[0]! + 1, start[1]!]
        let extraTimelines = 0;
        if (input.splitters[candidate[0]!]?.has(candidate[1]!)) {
            extraTimelines += calculateExtraTimelines([candidate[0]!, candidate[1]! - 1])
            extraTimelines += calculateExtraTimelines([candidate[0]!, candidate[1]! + 1])
        } else {
            extraTimelines = calculateExtraTimelines(candidate)
        }

        if (!calculatedTimelines[start[0]!]) {
            calculatedTimelines[start[0]!] = {};
        }
        calculatedTimelines[start[0]!]![start[1]!] = extraTimelines;
        return extraTimelines;
    }

    const result = calculateExtraTimelines(input.beams[0]!)
    console.log(result)
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
