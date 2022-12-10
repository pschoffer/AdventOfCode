const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);
    // const input = parseInput(inputTestPath);

    const screen = processForStrenth(input);

    for (const line of screen) {
        console.log(line.join(''))
    }
}

const SCREEN_HEIGHT = 6;
const SCREEN_WIDTH = 40;

const getScreenIndex = (cycle: number): number[] => {
    const rowIx = Math.floor((cycle - 1) / SCREEN_WIDTH) % SCREEN_HEIGHT;
    const colIx = (cycle - 1) % SCREEN_WIDTH;

    return [rowIx, colIx];

}

function processForStrenth(instructions: Instraction[]): string[][] {
    const screen = new Array(SCREEN_HEIGHT).fill(0).map(() => new Array(SCREEN_WIDTH).fill('.'));

    let cycle = 0;
    let currentInstructionCycle = 0;
    let instructionPointer = 0;
    let registry = 1;
    while (instructionPointer < instructions.length) {
        cycle++;
        currentInstructionCycle++;

        const [rowIx, colIx] = getScreenIndex(cycle);

        if ([registry - 1, registry, registry + 1].includes(colIx)) {
            screen[rowIx][colIx] = '#';
        }

        const instruction = instructions[instructionPointer];
        if (currentInstructionCycle >= instructionCycles[instruction.code]) {

            if (instruction.code === 'addx') {
                registry += parseInt(instruction.params[0]);
            }


            currentInstructionCycle = 0;
            instructionPointer++;
        }


    }


    return screen;
}

const instructionCycles: Record<InstructionCode, number> = {
    noop: 1,
    addx: 2,
}

const parseInput = (inputPath: string) => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines = data.split("\n");

    const result: Instraction[] = [];

    for (const line of lines) {
        const parts = line.split(' ');

        result.push({
            code: parts.shift(),
            params: parts
        });
    }

    return result;
}


type InstructionCode = 'noop' | 'addx';
interface Instraction {
    code: InstructionCode;
    params: string[];
}

run();


