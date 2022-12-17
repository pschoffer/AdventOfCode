import { adjustByDiff } from "../lib/area";

const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const WIDTH = 7;
const ROCK_COUNT = 2022;
const START_POSITION = [3, 2];

const SHAPE_ORDER: SHAPE[] = ['-', '+', 'L', 'I', '#'];
const SHAPE_DEFINITIONS: Record<SHAPE, SHAPE_DEFINITION> = {
    '-': {
        adjustments: [[0, 1], [0, 2], [0, 3]],
        depth: 0
    },
    '+': {
        adjustments: [[0, 1], [0, 2], [1, 1], [-1, 1]],
        depth: 1
    },
    'L': {
        adjustments: [[0, 1], [0, 2], [1, 2], [2, 2]],
        depth: 0
    },
    'I': {
        adjustments: [[-1, 0], [-2, 0], [-3, 0]],
        depth: 3
    },
    '#': {
        adjustments: [[0, 1], [-1, 0], [-1, 1]],
        depth: 1
    },
};


const run = async () => {
    const input = parseInput(inputPath);
    // const input = parseInput(inputTestPath);

    const area: boolean[][] = []
    let shapeIx = 0;
    let moveIx = 0;

    for (let round = 0; round < ROCK_COUNT; round++) {
        console.log('doing round', round);
        const shape = SHAPE_DEFINITIONS[SHAPE_ORDER[shapeIx++]];
        if (shapeIx >= SHAPE_ORDER.length) {
            shapeIx = 0;
        }
        const highestY = getHighestY(area);
        let currentPosition = [highestY + shape.depth + START_POSITION[0] + 1, START_POSITION[1]];
        ensureArea(area, currentPosition);
        let savePosition = currentPosition;
        do {
            savePosition = [...currentPosition]

            const nextMove = input[moveIx++];
            if (moveIx >= input.length) {
                moveIx = 0;
            }

            const moveAdjustment = nextMove === '>' ? 1 : -1;
            currentPosition = adjustByDiff(currentPosition, [0, moveAdjustment]);
            if (isNoCollision(currentPosition, shape, area)) {
                savePosition = [...currentPosition];
            } else {
                currentPosition = [...savePosition];

            }

            currentPosition = adjustByDiff(currentPosition, [-1, 0]);

        } while (isNoCollision(currentPosition, shape, area))

        addShapeToArea(area, savePosition, shape);
        // printArea(area);
    }

    console.log(getHighestY(area) + 1);
}

const getHighestY = (area: boolean[][]): number => {
    let highestY = -1;
    for (let y = 0; y < area.length; y++) {
        for (let x = 0; x < area[y].length; x++) {
            if (area[y][x]) {
                highestY = Math.max(highestY, y);
            }
        }
    }
    return highestY;
}
const addShapeToArea = (area: boolean[][], position: number[], shape: SHAPE_DEFINITION) => {
    console.log('');
    const points: number[][] = [position];
    points.push(...shape.adjustments.map(a => adjustByDiff(position, a)));

    for (const point of points) {
        area[point[0]][point[1]] = true;
    }
    console.log('');
}

const ensureArea = (area: boolean[][], position: number[]) => {
    while (area.length <= position[0]) {
        area.push(Array(WIDTH).fill(false));
    }
}

const printArea = (area: boolean[][]) => {
    for (let y = area.length - 1; y >= 0; y--) {
        let line = y % 10 + '  |';
        for (let x = 0; x < area[y].length; x++) {
            line += area[y][x] ? '#' : '.';
        }
        console.log(line);
    }
}

const isNoCollision = (position: number[], shape: SHAPE_DEFINITION, area: boolean[][]): boolean => {
    const points: number[][] = [position];
    points.push(...shape.adjustments.map(a => adjustByDiff(position, a)));


    for (const point of points) {
        if (point[0] < 0) {
            return false;
        }

        if (point[1] < 0 || point[1] >= WIDTH) {
            return false;
        }

        if (area[point[0]] && area[point[0]][point[1]]) {
            return false;
        }
    }


    return true;
}

const parseInput = (inputPath: string) => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines = data.split("\n");

    return lines[0];
}

type SHAPE = '-' | '+' | 'L' | 'I' | '#';

type SHAPE_DEFINITION = {
    adjustments: number[][],
    depth: number,
}

run();
