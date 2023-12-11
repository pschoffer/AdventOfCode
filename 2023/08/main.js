const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');
const { sum, mul } = require(__dirname + '/../lib/math')

const run = async () => {
    const input = parsePath(inputPath);

    const steps = findZZZ(input, 0, 'AAA', 0);
    console.log(steps);

}

const findZZZ = (input) => {
    let ip = 0;
    let current = 'AAA';
    let length = 0;

    while (current !== 'ZZZ') {
        console.log(`${length}: ${current}`);
        const childIx = input.instructions[ip] === 'L' ? 0 : 1;
        ip = ip === input.instructions.length - 1 ? 0 : ip + 1;
        current = input.nodes[current][childIx];

        length++;
    }


    return length;

}


const parsePath = (inputPath) => {

    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');

    const lines = data.split('\n');
    const input = {
        instructions: lines[0].split(''),
        nodes: {}
    };

    // AAA = (BBB, BBB)
    for (let ix = 2; ix < lines.length; ix++) {
        const nodeString = lines[ix];

        const match = nodeString.match(/(\w+) = \((\w+), (\w+)\)/);
        const [_, name, left, right] = match;
        input.nodes[name] = [left, right];
    }


    return input
}


run();
