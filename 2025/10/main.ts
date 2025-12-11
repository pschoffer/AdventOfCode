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
        const initialJoltage = (machine.targetJoltage).map(item => 0);
        const state: State = {
            joltage: initialJoltage,
            btnPressed: machine.buttons.map(btn => 0),
            currentBtnIx: 0,
            mode: 'incr',
        }

        const updateJoltage = () => {
            const newJoltage = machine.targetJoltage.map(j => 0);
            for (let btnIx = 0; btnIx < state.btnPressed.length; btnIx++) {
                const count = state.btnPressed[btnIx];
                if (count) {
                    for (const jIx of machine.buttons[btnIx]!) {
                        newJoltage[jIx]! += count;
                    }
                }
            }
            state.joltage = newJoltage;
        }

        const canBeFilledWithRemaining = () => {
            const remainingBtns = [...machine.buttons].splice(state.currentBtnIx + 1);
            const neededJIxs: number[] = [];
            const filledJIxs: number[] = [];
            for (let jIx = 0; jIx < machine.targetJoltage.length; jIx++) {
                if (machine.targetJoltage[jIx]! - state.joltage[jIx]!) {
                    neededJIxs.push(jIx);
                } else {
                    filledJIxs.push(jIx);
                }
            }
            const filteredBtns = remainingBtns
                .filter(btn => btn.every(jIx => !filledJIxs.includes(jIx)))
            const usableJIxs = [... new Set(filteredBtns
                .reduce((prev, curr) => prev.concat(curr), []))];
            return neededJIxs.every(jIx => usableJIxs.includes(jIx));
        }

        while (machine.targetKey !== JSON.stringify(state.joltage)) {
            if (state.mode === 'incr') {
                const btn = machine.buttons[state.currentBtnIx]!
                const canPress = Math.min(...btn.map(joltIx => machine.targetJoltage[joltIx]! - state.joltage[joltIx]!));
                state.btnPressed[state.currentBtnIx]! += canPress
                updateJoltage();


                if (state.currentBtnIx < machine.buttons.length - 1) {
                    const canBeFilled = canBeFilledWithRemaining();
                    if (canBeFilled) {
                        state.currentBtnIx++;
                    } else {
                        state.mode = 'dec';
                    }
                } else {
                    state.mode = 'dec';
                }
            } else {

                if (state.btnPressed[state.currentBtnIx]! > 0) {
                    let lastItem = state.currentBtnIx === machine.buttons.length - 1;
                    // if (!moveToNextOne) {
                    //     const neededIxs: number[] = []
                    //     for (let jIx = 0; jIx < machine.targetJoltage.length; jIx++) {
                    //         if (machine.targetJoltage[jIx]! - state.joltage[jIx]!) {
                    //             neededIxs.push(jIx);
                    //         }
                    //     }
                    //     const remainingBtnIxs = [...machine.buttons]
                    //         .slice(state.currentBtnIx + 1)
                    //         .reduce((prev, curr) => prev.concat(curr), [])
                    //     moveToNextOne = neededIxs.some(neededIx => !remainingBtnIxs.includes(neededIx))
                    // }


                    if (lastItem) {
                        state.btnPressed[state.currentBtnIx] = 0;
                        state.currentBtnIx--;
                        updateJoltage();
                    } else {
                        state.btnPressed[state.currentBtnIx]!--
                        updateJoltage();


                        if (canBeFilledWithRemaining()) {
                            state.currentBtnIx++;
                            state.mode = 'incr'
                        } else {
                            state.btnPressed[state.currentBtnIx] = 0;
                            state.currentBtnIx--;
                            updateJoltage();
                        }
                    }
                } else {
                    state.currentBtnIx--;
                }
            }

        }

        const pressed = state.btnPressed.reduce((prev, curr) => prev + curr);
        console.log(`[${machineCount++}/${input.length}] Won ${pressed}`)
        result += pressed;
    }


    console.log('r', result);
}



interface State {
    joltage: number[];
    btnPressed: number[];
    currentBtnIx: number;
    mode: 'incr' | 'dec';
}

const minBtnRemaining = (current: number[], target: number[]) => {
    let estimate = 0;
    for (let ix = 0; ix < target.length; ix++) {
        const diff = target[ix]! - current[ix]!
        if (diff < 0) {
            return -1;
        }
        estimate += diff;
    }
    return estimate;
}

const makePathKey = (path: Path) => {
    return JSON.stringify(path.joltage);
}

interface Path {
    // buttonPressed: number[];
    count: number;
    estimate: number;
    joltage: number[];
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
