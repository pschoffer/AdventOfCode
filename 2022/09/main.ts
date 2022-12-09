import { getDistance2D } from "../lib/area";

const { adjust2D } = require('../lib/area');
const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');
const inputTest2Path = path.join(__dirname, 'test2.txt');

const TAIL_COUNT = 9;

const run = async () => {
    const input = parseInput(inputPath);
    // const input = parseInput(inputTestPath);
    // const input = parseInput(inputTest2Path);

    const visited = new Set<string>();
    visited.add('0,0');
    let head = [0, 0];
    let tails: number[][] = [];
    for (let ix = 0; ix < TAIL_COUNT; ix++) {
        tails.push([0, 0]);
    }

    for (const instruction of input) {
        for (let step = 0; step < instruction.length; step++) {
            head = adjust2D({ direction: instruction.direction, length: 1 }, head)
            let leader = head;
            for (let tailIx = 0; tailIx < tails.length; tailIx++) {
                let tail = tails[tailIx];
                const tailDistance = getDistance2D(tail, leader);
                if (tailDistance.length > 1) {
                    tail = adjust2D({ direction: tailDistance.direction, length: 1 }, tail);
                    tails[tailIx] = tail;
                    if (tailIx === tails.length - 1) {
                        visited.add(`${tail[0]},${tail[1]}`)
                    }
                }
                leader = tail;
            }
        }

    }


    console.log(visited.size)
}

const parseInput = (inputPath: string): Distance[] => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines = data.split("\n");

    const result: Distance[] = [];

    for (const line of lines) {
        const [directionString, distanceString] = line.split(' ');
        let direction: Direction = 'N';
        if (directionString === 'D') {
            direction = 'S';
        } else if (directionString === 'R') {
            direction = 'E';
        } else if (directionString === 'L') {
            direction = 'W';
        }

        result.push({
            direction,
            length: parseInt(distanceString)
        });
    }

    return result;
}

interface Distance {
    direction: Direction;
    length: number;
}

type Direction = 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW';

run();
