const { splitArrayBy } = require("../lib/input");

const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const ROUNDS = 1000;
const run = async () => {
    // const input = parseInput(inputPath);
    const input = parseInput(inputTestPath);

    const activity = simulate(input, ROUNDS);
    activity.sort((a, b) => b - a);

    console.log(activity[0] * activity[1])
}


const simulate = (monkeys: Monkey[], rounds: number): number[] => {
    const result = new Array(monkeys.length).fill(0);
    let prevResult = new Array(monkeys.length).fill(0);
    let prevValue = 1n
    for (let i = 0; i < rounds; i++) {
        for (let monkeyIx = 0; monkeyIx < monkeys.length; monkeyIx++) {
            const monkey = monkeys[monkeyIx];

            while (monkey.items.length) {
                const item = monkey.items.shift()!;

                // if (item.id === 0 && monkeyIx === 0) {
                //     const division = item.value / prevValue;
                //     if (division > 19n) {
                //         console.log(`Round ${i + 1}, Monkey ${monkeyIx}`, item.value, item.value / prevValue);
                //     }
                //     prevValue = BigInt(item.value);
                // }

                item.value = monkey.adjustment(item.value);
                const testResult = monkey.test(item.value);

                const newMonkeyIx = testResult ? monkey.resultTrue : monkey.resultFalse;
                monkeys[newMonkeyIx].items.push(item);

                result[monkeyIx]++;
            }
        }

        // if ((i + 1) % 20 === 0) {
        //     const diff = result.map((r, ix) => r - prevResult[ix]);
        //     prevResult = [...result];
        //     console.log("Round ", i + 1, 'done', result, diff);
        //     console.log()
        // }
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

let itemId = 0;
const parseMonkey = (lines: string[]): Monkey => {

    const id = Number((lines[0].match(/Monkey (\d+):/) || [])[1]);
    const itemValues = lines[1].split(': ')[1].split(',').map(BigInt);
    const items = itemValues.map(value => ({ id: itemId++, value }));
    const operationMatch = lines[2].split(': ')[1].match(/new = old ([*+]) (.+)/) || [];
    const adjustment = (a: bigint) => {
        const b = operationMatch[2] === 'old' ? a : BigInt(operationMatch[2]);
        if (operationMatch[1] === '*') {
            return a * b;
        }
        return a + b;
    }
    const divisibilityMatch = lines[3].match(/divisible by (\d+)/) || [];
    const test = (a: bigint) => a % BigInt(divisibilityMatch[1]) === 0n;
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

interface Item {
    id: number,
    value: bigint
}

interface Monkey {
    id: number;
    items: Item[];
    adjustment: (a: bigint) => bigint;
    test: (a: bigint) => boolean;
    resultTrue: number;
    resultFalse: number;
}

run();
