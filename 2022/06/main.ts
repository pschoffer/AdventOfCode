const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    // const input = parseInput(inputTestPath);
    const input = parseInput(inputPath);

    const result = findPatern(input);


    console.log(result + 1)
}

const findPatern = (input: string) => {
    const pastChars = input.slice(0, 3).split('');

    for (let ix = 3; ix < input.length; ix++) {
        const pastCharsInvalid = pastChars.length > new Set(pastChars).size;

        const element = input[ix];
        if (!pastChars.includes(element) && !pastCharsInvalid) {
            return ix;
        }
        pastChars.shift();
        pastChars.push(element);
    }
    return 0;
}

const parseInput = (inputPath: string) => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');

    return data;
}

run();
