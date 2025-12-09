import * as path from 'path';
import * as fs from 'fs';
import { calculatePerAxisDistance, explode, parseArea } from '../lib/area.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);

    let highestArea = 0;
    for (let firstIx = 0; firstIx < input.length; firstIx++) {
        for (let secondIx = firstIx + 1; secondIx < input.length; secondIx++) {
            const distances = calculatePerAxisDistance(input[firstIx]!, input[secondIx]!)
            const area = (distances[0]! + 1) * (distances[1]! + 1);
            if (area > highestArea) {
                highestArea = area;
            }

            // console.log(`${input[firstIx]} <> ${input[secondIx]} => ${distances} area ${area} highestArea ${highestArea}`)
        }
    }

    console.log(highestArea)
}

const parseInput = (inputPath: string) => {
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines: string[] = data.split("\n");

    const result = [];

    for (const line of lines) {
        const coordinate = line.split(',').map(Number) as [number, number];
        result.push(coordinate);
    }

    return result;
}

run();
