const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

interface NumberFound {
    ix: number;
    value: number;
}

const run = async () => {
    const input = parseInput(inputPath);

    let resultSumJoltage = 0;
    for (const bank of input) {
        const highNumbers = findHighestAndSecondHighest(bank);
        let resultJoltageString = ''
        if (highNumbers.highest?.ix === bank.length - 1) {
            resultJoltageString = (highNumbers.secondHighest?.value + '') + (highNumbers.highest?.value + '')
        } else {
            const remainingJoltage = bank.splice((highNumbers.highest?.ix || 0) + 1);
            const highestRemaining = findHighestAndSecondHighest(remainingJoltage);
            resultJoltageString = (highNumbers.highest?.value + '') + (highestRemaining.highest?.value + '')
        }
        const resultJoltage = Number(resultJoltageString);
        resultSumJoltage += resultJoltage;
        console.log('resultJoltage', resultJoltage)
    }
    console.log('result', resultSumJoltage)
}

const findHighestAndSecondHighest = (numbers: number[]) => {
    let highest: NumberFound | null = null;
    let secondHighest: NumberFound | null = null;

    for (let ix = 0; ix < numbers.length; ix++) {
        const value = numbers[ix] || 0;
        if (!highest || value > (highest as any).value) {
            secondHighest = highest;
            highest = { ix, value }
        }
    }

    return { highest, secondHighest };
}

const parseInput = (inputPath: string) => {
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines: string[] = data.split("\n");

    const result = [];

    for (const line of lines) {
        const joltage = line.split('').map(Number)
        result.push(joltage);
    }

    return result;
}

run();
