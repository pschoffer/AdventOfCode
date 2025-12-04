import * as path from 'path';
import * as fs from 'fs';
import { explode, parseArea } from '../lib/area.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

export const run = async () => {
    const diagram = parseInput(inputPath);
    const xLength = diagram[0]?.length || 0;

    let accessibleRolls = 0;
    for (let y = 0; y < diagram.length; y++) {
        for (let x = 0; x < xLength; x++) {
            if (diagram[y]?.[x] !== '@') {
                continue;
            }
            const exploded = explode([y, x], [0, 0], [diagram.length - 1, xLength - 1])

            const rollsNearby = exploded.filter(coordinates => diagram[coordinates[0]!]?.[coordinates[1]!] === '@')
            if (rollsNearby.length < 4) {
                console.log("Found one", [y, x], rollsNearby.length)
                accessibleRolls++;
            }
        }
    }

    console.log('Result', accessibleRolls)
}

const parseInput = (inputPath: string) => {
    const data = fs.readFileSync(inputPath, 'utf8');

    return parseArea(data);
}

run();
