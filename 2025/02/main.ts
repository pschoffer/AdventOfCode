const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);

    let result = 0;
    let foundNumbers = new Set<Number>();

    for (const interval of input) {
        const maxPatternSize = (interval.high + '').length / 2;

        for (let paternSize = 1; paternSize <= maxPatternSize; paternSize++) {

            let current = interval.low;
            while (current <= interval.high) {
                const matches = getClosestMatch(current, paternSize);
                console.log('Testing', current, ' vs ', matches.currentMatch);

                if (current === matches.currentMatch && !foundNumbers.has(current)) {
                    console.log('Found it', current);
                    result += current;
                    foundNumbers.add(current);
                }

                const digitCount = (current + '').length;
                const higherDigit = Math.pow(10, digitCount);
                if (current < matches.currentMatch) {
                    current = Math.min(matches.currentMatch, higherDigit);
                } else if (!matches.nextMatch) {
                    current = higherDigit;
                } else {
                    current = matches.nextMatch;
                }
            }
        }
    }


    console.log('result', result)
}

const getClosestMatch = (id: number, paternSize: number) => {

    const stringId = id + '';
    const lenght = stringId.length;

    let patern = '';
    if (lenght < paternSize) {
        const zeros = paternSize - lenght;
        patern = stringId;
        for (let i = 0; i < zeros; i++) {
            patern += '0';
        }
    } else {
        patern = stringId.substring(0, paternSize);
    }

    const repeats = Math.max(lenght / paternSize, 2);

    let currentMatch = '';
    for (let i = 0; i < repeats; i++) {
        currentMatch += patern;
    }

    const newPatern = (Number(patern) + 1) + '';
    let nextMatch = null;
    if (newPatern.length === paternSize) {
        nextMatch = '';
        for (let i = 0; i < repeats; i++) {
            nextMatch += newPatern;
        }
    }
    return { currentMatch: Number(currentMatch), nextMatch: Number(nextMatch) };
}

const parseInput = (inputPath: string) => {
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines: string[] = data.split(",");

    const result = [];

    for (const line of lines) {
        const [firstPart, secondPart] = line.split('-');
        result.push({ low: Number(firstPart), high: Number(secondPart) });
    }

    return result;
}

run();
