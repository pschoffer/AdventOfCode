const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');
const inputTest2Path = path.join(__dirname, 'test2.txt');

const DIAL_START = 50;

const run = async () => {
    const input = parseInput(inputPath);

    let currentValue = DIAL_START;
    let password = 0;
    for (const instr of input) {
        let wasAtZero = currentValue === 0;
        if (instr.direction === 'L') {
            currentValue -= instr.shift
        } else {
            currentValue += instr.shift
        }

        if (instr.shift > 100) {
            console.log('High', instr.shift, password, currentValue)
        }

        if (currentValue < 0) {

            while (currentValue < 0) {
                currentValue = 100 + currentValue;
                if (wasAtZero) {
                    wasAtZero = false;
                } else {
                    password++;
                }
            }
        }

        if (currentValue > 99) {

            while (currentValue > 99) {
                currentValue = currentValue - 100;
                password++;
            }

        } else if (currentValue === 0) {
            password++;
        }

        if (instr.shift > 100) {
            console.log('High2', instr.shift, password, currentValue)
        }
        console.log('CurrentValue:', currentValue, password)
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
