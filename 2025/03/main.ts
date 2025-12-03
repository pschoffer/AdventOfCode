const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

interface NumberFound {
    ix: number;
    value: number;
}

const BATTERY_COUNT = 12;
const run = async () => {
    const input = parseInput(inputPath);

    let resultSumJoltage = 0;
    for (const bank of input) {
        let resultJoltageString = '';
        let latestDigitIx = -1;
        for (let digitIx = 0; digitIx < BATTERY_COUNT; digitIx++) {
            const digitsAfter = BATTERY_COUNT - (digitIx + 1);
            const validNumbersToSearch = [...bank].slice(latestDigitIx + 1, bank.length - digitsAfter);
            const highest = findHighest(validNumbersToSearch);
            resultJoltageString += highest?.value;
            latestDigitIx = (highest?.ix || 0) + (latestDigitIx + 1);
        }


        const resultJoltage = Number(resultJoltageString);
        resultSumJoltage += resultJoltage;
        console.log('resultJoltage', resultJoltage)
    }
    console.log('result', resultSumJoltage)
}

const findHighest = (numbers: number[]) => {
    let highest: NumberFound | null = null;

    for (let ix = 0; ix < numbers.length; ix++) {
        const value = numbers[ix] || 0;
        if (!highest || value > (highest as any).value) {
            highest = { ix, value }
        }
    }

    return highest;
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
