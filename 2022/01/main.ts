const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parsePath(inputPath);

    input.sort((a, b) => b.sum - a.sum);

    const calories = input.map(i => i.sum);

    console.log(calories);
    const result = calories[0] + calories[1] + calories[2];
    console.log(result);
}

const parsePath = (inputPath: string) => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');

    const elfs: Elf[] = [];

    const lines = data.split("\n");
    let currentElf: Elf = {
        ix: 0,
        calories: [],
        sum: 0,
    }
    for (const line of lines) {
        if (line === "") {
            elfs.push(currentElf);
            currentElf = {
                ix: elfs.length,
                calories: [],
                sum: 0,
            }
        } else {
            currentElf.calories.push(parseInt(line));
            currentElf.sum += parseInt(line);
        }

    }
    elfs.push(currentElf);


    return elfs;
}

interface Elf {
    ix: number;
    calories: number[];
    sum: number;
}


run();
