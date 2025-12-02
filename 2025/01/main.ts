const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const DIAL_START = 50;

const run = async () => {
    const input = parseInput(inputPath);

    let currentValue = DIAL_START;
    let password = 0;
    for (const instr of input) {
        if (instr.direction === 'L') {
            currentValue -= instr.shift
        } else {
            currentValue += instr.shift
        }

        while (currentValue < 0) {
            currentValue = 100 + currentValue;
        }
        while (currentValue > 99) {
            currentValue = currentValue % 100;
        }

        if (currentValue === 0) {
            password++;
        }
        console.log('CurrentValue:', currentValue)
    }

    console.log('Password:', password)
}

const parseInput = (inputPath: string) => {
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines: string[] = data.split("\n");

    const result = [];

    for (const line of lines) {
        const firstLetter = line.charAt(0)
        const shift = Number(line.substring(1))
        result.push({ direction: firstLetter, shift });
    }

    return result;
}

run();
