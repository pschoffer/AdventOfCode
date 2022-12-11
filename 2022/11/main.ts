const { splitArrayBy } = require("../lib/input");

const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const ROUNDS = 20;
const run = async () => {
    const input = parseInput(inputPath);
    // const input = parseInput(inputTestPath);

    const activity = simulate(input, ROUNDS);
    activity.sort((a, b) => b - a);

    console.log(activity[0] * activity[1])
}

const relief = (a: number) => Math.floor(a / 3);

const simulate = (monkeys: Monkey[], rounds: number): number[] => {
    const result = new Array(monkeys.length).fill(0);

    for (let i = 0; i < rounds; i++) {
        for (let monkeyIx = 0; monkeyIx < monkeys.length; monkeyIx++) {
            const monkey = monkeys[monkeyIx];

            while (monkey.items.length) {
                const item = monkey.items.shift() || 0;
                const adjusted = monkey.adjustment(item);
                const relieved = relief(adjusted);
                const testResult = monkey.test(relieved);

                const newMonkeyIx = testResult ? monkey.resultTrue : monkey.resultFalse;
                monkeys[newMonkeyIx].items.push(relieved);

                result[monkeyIx]++;
            }
        }

        // console.log("Round ", i + 1, 'done');
        // for (const monkey of monkeys) {
        //     console.log(monkey.id, monkey.items)
        // }
        // console.log()
    }

    return result;
}

const parseInput = (inputPath: string): Monkey[] => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines = data.split("\n") as string[];

    const monkeyLines = splitArrayBy(lines, (line: string) => line === '');

    return monkeyLines.map(parseMonkey)
}

const parseMonkey = (lines: string[]): Monkey => {

    const id = Number((lines[0].match(/Monkey (\d+):/) || [])[1]);
    const items = lines[1].split(': ')[1].split(',').map(Number);
    const operationMatch = lines[2].split(': ')[1].match(/new = old ([*+]) (.+)/) || [];
    const adjustment = (a: number) => {
        const b = operationMatch[2] === 'old' ? a : Number(operationMatch[2]);
        if (operationMatch[1] === '*') {
            return a * b;
        }
        return a + b;
    }
    const divisibilityMatch = lines[3].match(/divisible by (\d+)/) || [];
    const test = (a: number) => a % Number(divisibilityMatch[1]) === 0;
    const resultTrue = Number(lines[4].split(' ')[9]);
    const resultFalse = Number(lines[5].split(' ')[9]);

    return {
        id,
        items,
        adjustment,
        test,
        resultTrue,
        resultFalse
    };
}

interface Monkey {
    id: number;
    items: number[];
    adjustment: (a: number) => number;
    test: (a: number) => boolean;
    resultTrue: number;
    resultFalse: number;
}

run();
