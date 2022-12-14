
const { getDistance2D, adjust2D } = require("../lib/area");

const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const SAND_START = [0, 500];

const run = async () => {
    const input = parseInput(inputPath);
    // const input = parseInput(inputTestPath);

    const sandArea = simulateSand(input);
    let countSand = 0;
    for (const key of Object.keys(sandArea)) {
        countSand += sandArea[Number(key)].size;
    }

    console.log(countSand);
}

const simulateSand = (input: Input): Record<number, Set<number>> => {
    const area: Record<number, Set<number>> = {};

    let sandRestPoint = simulateSandParticle(area, input);
    while (sandRestPoint) {
        if (!area[sandRestPoint[0]]) {
            area[sandRestPoint[0]] = new Set();
        }
        area[sandRestPoint[0]].add(sandRestPoint[1]);

        sandRestPoint = simulateSandParticle(area, input);
    }

    return area;
}

const findFreeSpot = (blocks: Record<number, Set<number>>[], currentPoint: number[]): number[] | null => {
    const candidates: number[][] = ['S', 'SW', 'SE'].map(direction => adjust2D({ direction, length: 1 }, currentPoint));
    for (const candidate of candidates) {
        if (blocks[0][candidate[0]] && blocks[0][candidate[0]].has(candidate[1])) {
            continue;
        }
        if (blocks[1][candidate[0]] && blocks[1][candidate[0]].has(candidate[1])) {
            continue;
        }
        return candidate;
    }
    return null;
}

const simulateSandParticle = (sand: Record<number, Set<number>>, input: Input): number[] | null => {
    let currentPoint = [...SAND_START];

    while (currentPoint[0] <= input.maxY) {
        const freeSpot = findFreeSpot([sand, input.area], currentPoint);
        if (freeSpot) {
            currentPoint = freeSpot;
        } else {
            return currentPoint;
        }
    }


    return null;
}

const parseInput = (inputPath: string): Input => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines = data.split("\n");

    let maxY = 0;
    const area: Record<number, Set<number>> = {}

    for (const line of lines) {
        const points: number[][] = [];
        const pointStrings = line.split(' -> ');
        for (const pointString of pointStrings) {
            const [x, y] = pointString.split(',').map(Number);
            points.push([y, x]);
        }

        let currentPoint = points.shift() || [];
        let nextPoint = points.shift();
        if (currentPoint[0] > maxY) {
            maxY = currentPoint[0];
        }
        while (nextPoint) {
            if (nextPoint[0] > maxY) {
                maxY = nextPoint[0];
            }

            let distance = getDistance2D(currentPoint, nextPoint);
            while (distance.length > 0) {

                if (!area[currentPoint[0]]) {
                    area[currentPoint[0]] = new Set();
                }
                area[currentPoint[0]].add(currentPoint[1]);

                currentPoint = adjust2D({ ...distance, length: 1 }, currentPoint);

                distance = getDistance2D(currentPoint, nextPoint);
            }
            if (!area[currentPoint[0]]) {
                area[currentPoint[0]] = new Set();
            }
            area[currentPoint[0]].add(currentPoint[1]);


            nextPoint = points.shift();
        }


    }

    return {
        area,
        maxY
    };
}

interface Input {
    area: Record<number, Set<number>>
    maxY: number
}

interface Distance {
    direction: Direction;
    length: number;
}

type Direction = 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW';


run();
