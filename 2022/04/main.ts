const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);

    let counter = 0;
    for (const { sections } of input) {
        const mins = sections.map(s => s.min);
        const maxs = sections.map(s => s.max);

        if (mins.every(min => maxs.every(max => min <= max)) && maxs.every(max => mins.every(min => max >= min))) {
            counter++;
        }
    }
    console.log(counter)
}

const parseInput = (inputPath: string) => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines = data.split("\n");

    const result: Pair[] = [];

    for (const line of lines) {
        const pairInputs = line.split(',');

        const sections: Section[] = [];
        for (const pairInput of pairInputs) {
            const [min, max] = pairInput.split('-');
            sections.push({
                min: parseInt(min),
                max: parseInt(max)
            })
        }

        result.push({
            sections
        });
    }

    return result;
}

interface Section {
    min: number;
    max: number;
}

interface Pair {
    sections: Section[];
}

run();
