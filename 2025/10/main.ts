import * as path from 'path';
import * as fs from 'fs';
import { explode, parseArea } from '../lib/area.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);

    let result = 0;
    let machineCount = 1;
    for (const machine of input) {
        const initialLights: boolean[] = [];
        const visitedPaths: Set<string> = new Set();
        for (let ix = 0; ix < machine.ligthsCount; ix++) {
            initialLights.push(false);
        }

        const paths: Path[] = [{ buttonPressed: [], count: 0, lights: initialLights }]
        let winningPath: Path | null = null;
        while (paths.length && !winningPath) {
            const currentPath = paths.shift()!;
            if (machine.targetKey === JSON.stringify(currentPath.lights)) {
                winningPath = currentPath;
                break;
            }
            visitedPaths.add(makePathKey(currentPath));

            for (let btnIx = 0; btnIx < machine.buttons.length; btnIx++) {
                const button = machine.buttons[btnIx]!;
                const newLights = [...currentPath.lights];
                for (const lightIx of button) {
                    newLights[lightIx] = !newLights[lightIx]
                }

                const buttonPressed = [...currentPath.buttonPressed].concat([btnIx]);
                buttonPressed.sort((a, b) => a - b)
                const newPath: Path = {
                    buttonPressed,
                    count: currentPath.count + 1,
                    lights: newLights
                }
                if (!visitedPaths.has(makePathKey(newPath))) {
                    paths.push(newPath);
                }
            }

        }

        if (winningPath) {
            console.log(`[${machineCount++}/${input.length}] Winner`, JSON.stringify(winningPath));
            result += winningPath.count;
        }
    }


    console.log('r', result);
}

const makePathKey = (path: Path) => {
    return JSON.stringify(path.lights);
}

interface Path {
    buttonPressed: number[];
    count: number;
    lights: boolean[];
}

interface Machine {
    ligthsCount: number;
    targetKey: string;
    buttons: number[][]
    joltage: number[]
}

const parseInput = (inputPath: string) => {
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines: string[] = data.split("\n");

    const result: Machine[] = [];

    for (const line of lines) {
        const parts = line.split(' ');

        const lightsPart = parts.shift()!;
        const joltage = parts.pop()!
        const buttons: number[][] = [];

        const ligths = lightsPart.replaceAll(/[\[\]]/g, '')
            .split('')
            .map(char => char === '#');


        for (const part of parts) {
            const wiringString = part.replaceAll(/[\(\)]/g, '')
            const wirings = wiringString.split(',').map(Number)
            buttons.push(wirings)
        }


        result.push({
            ligthsCount: ligths.length,
            targetKey: JSON.stringify(ligths),
            buttons,
            joltage: [],
        });
    }

    return result;
}

run();
