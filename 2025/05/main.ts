import * as path from 'path';
import * as fs from 'fs';
import { explode, parseArea } from '../lib/area.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);

    let result = 0;

    const isFresh = (id: number) => {
        for (let range of input.ranges) {
            if (id >= range[0] && id <= range[1]) {
                return true;
            }
        }
        return false;
    }

    for (let id of input.ids) {
        if (isFresh(id)) {
            console.log(`Found fresh id ${id}`)
            result++;
        }
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
