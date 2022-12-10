const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);
    // const input = parseInput(inputTestPath);

    const strength = processForStrenth(input);

    console.log(strength)
}

function processForStrenth(instructions: Instraction[]): number {
    let strength = 0;

    let cycle = 0;
    let currentInstructionCycle = 0;
    let instructionPointer = 0;
    let registry = 1;
    while (instructionPointer < instructions.length) {
        cycle++;
        currentInstructionCycle++;



        if (cycle === 20 || ((cycle - 20) % 40 === 0)) {
            const thisStrength = cycle * registry;
            strength += thisStrength
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


    return strength;
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


