const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);
    // const input = parseInput(inputTestPath);
    processShip(input);

    const lastLetters = input.stacks.map(stack => stack[stack.length - 1]);
    console.log(lastLetters.join(''));
}

const processShip = (ship: Ship) => {
    for (const instruction of ship.instructions) {
        const fromStack = ship.stacks[instruction.from - 1];
        const toStack = ship.stacks[instruction.to - 1];
        const tmpStack: string[] = [];

        for (let counter = 0; counter < instruction.count; counter++) {
            tmpStack.push(fromStack.pop() || '');
        }
        for (let counter = 0; counter < instruction.count; counter++) {
            toStack.push(tmpStack.pop() || '');
        }
    }
}

const parseInput = (inputPath: string): Ship => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines = data.split("\n");

    const result: Ship = {
        stacks: [],
        instructions: []
    };
    let breakIx = 0;
    for (let ix = 0; ix < lines.length; ix++) {
        const line = lines[ix];
        if (line === '') {
            breakIx = ix;
            continue;
        }

        if (breakIx) {
            const matchResult = line.match(/move (.+) from (.+) to (.+)/);
            const count = Number(matchResult[1]);
            result.instructions.push({
                from: Number(matchResult[2]),
                to: Number(matchResult[3]),
                count
            })
        }
    }

    for (let ix = breakIx - 2; ix >= 0; ix--) {
        const line = lines[ix];
        for (let lineIx = 0; lineIx < line.length; lineIx++) {
            const element = line[lineIx];
            if (element.match(/\w/)) {
                const stackIx = (lineIx - 1) / 4;
                if (!result.stacks[stackIx]) {
                    result.stacks[stackIx] = [];
                }
                result.stacks[stackIx].push(element);
            }

        }
    }

    return result;
}

interface Instruction {
    from: number
    to: number
    count: number
}

interface Ship {
    stacks: string[][]
    instructions: Instruction[]
}

run();
