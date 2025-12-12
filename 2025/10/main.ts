import * as path from 'path';
import * as fs from 'fs';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');
const inputTestPath2 = path.join(__dirname, 'test2.txt');


const timeLog = (startTime: number, text: string) => {
    const elapsed = Date.now() - startTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
    const timeStr = `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    console.log(`[${timeStr} - ${new Date().toTimeString()}] ${text}`)
}

const run = async () => {
    const input = parseInput(inputPath);

    let result = 0;
    let machineCount = 0;
    for (const machine of input) {
        machineCount++;
        const startTime = Date.now();

        const initJoltage = machine.targetJoltage.map(() => 0);

        let attempt = 0;
        const findNeededPresses = (btnIx: number, btnPresses: number[], btnPressedCount: number, joltage: number[]): number | null => {
            attempt++;
            if (attempt % 10000000 === 0) {
                timeLog(startTime, `Testing, b: ${JSON.stringify(btnPresses)}`)
            }


            if (JSON.stringify(joltage) === machine.targetKey) {
                timeLog(startTime, `Found first result - ` + btnPressedCount)
                return btnPressedCount
            }
            if (btnIx >= machine.buttons.length) {
                return null;
            }

            const btn = machine.buttons[btnIx]!
            const maxBtnPress = Math.min(...btn.map(jIx => machine.targetJoltage[jIx]! - joltage[jIx]!))
            const newBtnPresses = [...btnPresses];
            newBtnPresses[btnIx] = maxBtnPress;
            const newJoltage = [...joltage];
            for (const jIx of btn) {
                newJoltage[jIx]! += maxBtnPress;
            }

            let bestPress: null | number = null;
            do {
                let rem = 0;
                let neededIx: Set<number> = new Set();;
                for (let jIx = 0; jIx < machine.targetJoltage.length; jIx++) {
                    const diff = machine.targetJoltage[jIx]! - newJoltage[jIx]!;
                    if (diff < 0) {
                        return -1;
                    }
                    if (diff > 0) {
                        neededIx.add(jIx)
                    }
                    rem += diff
                }

                const newBtnPressedCount = btnPressedCount + newBtnPresses[btnIx]
                const avaibleBtns = machine.buttons.slice(btnIx + 1)
                    .filter(btn => btn.every(jIx => neededIx.has(jIx)));
                const bestCoverage = avaibleBtns[0]?.length || 1;

                if (rem > 0) {
                    if (btnIx === (machine.buttons.length - 1)) {
                        break;
                    }
                    if (newBtnPresses[btnIx] !== maxBtnPress) {
                        const possibleIx = avaibleBtns.reduce((prev, curr) => prev.concat(curr), []);
                        const allCovered = [...neededIx].every(jIx => possibleIx.includes(jIx));
                        if (!allCovered) {
                            break;
                        }
                    }
                }


                const bestCase = Math.ceil(rem / bestCoverage)
                if (!bestPress || newBtnPressedCount + bestCase < bestPress) {
                    let nextBtnResult = findNeededPresses(btnIx + 1, newBtnPresses, newBtnPressedCount, newJoltage);
                    if (nextBtnResult != null && (!bestPress || bestPress > nextBtnResult)) {
                        bestPress = nextBtnResult;
                    }
                }
                newBtnPresses[btnIx]--;
                for (const jIx of btn) {
                    newJoltage[jIx]! --;
                }
            } while (newBtnPresses[btnIx] >= 0)

            return bestPress;
        }

        const machineResult = findNeededPresses(0, machine.buttons.map(() => 0), 0, initJoltage)

        timeLog(startTime, `[${machineCount}/${input.length}] - best ${machineResult}`)
        result += machineResult || 0;
    }


    console.log('r', result);
}


interface Machine {
    targetJoltage: number[]
    targetKey: string;
    buttons: number[][]
}

const parseInput = (inputPath: string) => {
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines: string[] = data.split("\n");

    const result: Machine[] = [];

    for (const line of lines) {
        const parts = line.split(' ');

        const lightsPart = parts.shift()!;
        const joltageString = parts.pop()!

        const joltage = joltageString.replaceAll(/[\{\}]/g, '').split(',').map(Number);
        const buttons: number[][] = [];

        for (const part of parts) {
            const wiringString = part.replaceAll(/[\(\)]/g, '')
            const wirings = wiringString.split(',').map(Number)
            buttons.push(wirings)
        }

        buttons.sort((a, b) => b.length - a.length)


        result.push({
            targetKey: JSON.stringify(joltage),
            buttons,
            targetJoltage: joltage,
        });
    }

    return result;
}

run();

