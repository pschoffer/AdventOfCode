const { isInBounds } = require("../lib/area");

const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);
    // const input = parseInput(inputTestPath);

    const visibilityMap = calculateVisibilityMaps(input);
    const count = countVisible(input, visibilityMap);
    console.log(count)
}

function countVisible(input: number[][], visibilityMap: VisibilityMap) {
    let count = 0;
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            const height = input[y][x];
            if (isVisible(y, x, height, visibilityMap)) {
                count++;
            }
        }
    }
    return count;
}

function isVisible(y: number, x: number, height: number, visibilityMap: VisibilityMap) {
    for (const direction of ['top', 'bottom', 'left', 'right'] as Direction[]) {
        if (visibilityMap[direction][y][x] < height) {
            return true;
        }
    }

    return false;
}

const calculateVisibilityMaps = (input: number[][]): VisibilityMap => {
    return {
        top: calculateVisibilityMap(input, 'top'),
        bottom: calculateVisibilityMap(input, 'bottom'),
        left: calculateVisibilityMap(input, 'left'),
        right: calculateVisibilityMap(input, 'right'),
    }
}

const calculateVisibilityMap = (input: number[][], direction: Direction): number[][] => {
    const result: number[][] = [];
    for (let i = 0; i < input.length; i++) {
        const row = input[i];
        result.push([]);
        for (let j = 0; j < row.length; j++) {
            result[i].push(0);
        }
    }

    let startY = direction === 'bottom' ? result.length - 1 : 0;
    let startX = direction === 'right' ? result[0].length - 1 : 0;
    const adjustY = direction === 'bottom' ? -1 : 1;
    const adjustX = direction === 'right' ? -1 : 1;
    const edge = [input.length - 1, input[0].length - 1];

    if (direction === 'left' || direction === 'right') {
        for (let y = startY; y >= 0 && y < result.length; y += adjustY) {
            for (let x = startX; x >= 0 && x < result[y].length; x += adjustX) {
                const prevX = x - adjustX;
                if (isInBounds([y, prevX], edge)) {
                    result[y][x] += Math.max(result[y][prevX], input[y][prevX]);
                } else {
                    result[y][x] = -1;
                }
            }
        }
    } else {
        for (let x = startX; x >= 0 && x < result[0].length; x += adjustX) {
            for (let y = startY; y >= 0 && y < result.length; y += adjustY) {
                const prevY = y - adjustY;
                if (isInBounds([prevY, x], edge)) {
                    result[y][x] += Math.max(result[prevY][x], input[prevY][x]);
                } else {
                    result[y][x] = -1;
                }
            }
        }
    }


    return result;
}

const parseInput = (inputPath: string): number[][] => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines = data.split("\n");

    const result: number[][] = [];

    for (const line of lines) {
        result.push(line.split('').map((c: string) => parseInt(c)));
    }

    return result;
}

type Direction = 'top' | 'bottom' | 'left' | 'right';

type VisibilityMap = Record<Direction, number[][]>;

run();


