import { getManhattanDistance } from "../lib/area";

const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    // const input = parseInput(inputTestPath);
    // const maxCoord = 20;
    const input = parseInput(inputPath);
    const maxCoord = 4000000;

    const intervals: Record<number, number[][]> = {};
    for (let i = 0; i < maxCoord; i++) {
        intervals[i] = [[0, maxCoord]];
    }

    let count = 0;
    for (const line of input) {
        const { sensor, distance } = line;
        const minY = Math.max(sensor[0] - distance, 0);
        const maxY = Math.min(sensor[0] + distance, maxCoord);

        let currentYDiff = minY - sensor[0];
        for (let y = minY; y <= maxY; y++) {

            if (intervals[y]) {
                const xDiff = distance - Math.abs(currentYDiff);
                removeInterval(intervals[y], [sensor[1] - xDiff, sensor[1] + xDiff]);
                if (intervals[y].length === 0) {
                    delete intervals[y];
                }
            }

            currentYDiff++;
        }
        console.log('Line done', count++, Object.keys(intervals).length);
    }

    const y = Number(Object.keys(intervals)[0]);
    const x = Number(intervals[y][0][0]);
    console.log(y + x * 4000000);
}

const removeInterval = (intervals: number[][], interval: number[]) => {
    const [min, max] = interval;
    let i = 0;
    while (i < intervals.length) {
        const [currentMin, currentMax] = intervals[i];
        if (currentMin > max) {
            break;
        }
        if (currentMax < min) {
            i++;
            continue;
        }

        if (currentMin < min && currentMax > max) {
            intervals.splice(i, 1, [currentMin, min - 1], [max + 1, currentMax]);
            break;
        }
        if (currentMin < min) {
            intervals.splice(i, 1, [currentMin, min - 1]);
            continue;
        }
        if (currentMax > max) {
            intervals.splice(i, 1, [max + 1, currentMax]);
            break;
        }

        intervals.splice(i, 1);
    }
}


const parseInput = (inputPath: string) => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines = data.split("\n");

    const result: InputLine[] = [];

    for (const line of lines) {
        const match = line.match(/Sensor at x=(.*), y=(.*): closest beacon is at x=(.*), y=(.*)/);
        const sensor = [Number(match[2]), Number(match[1])];
        const beacon = [Number(match[4]), Number(match[3])];

        result.push({
            sensor,
            beacon,
            distance: getManhattanDistance(sensor, beacon)
        });
    }

    return result;
}


interface Distance {
    direction: Direction;
    length: number;
}

type Direction = 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW';

interface InputLine {
    sensor: number[];
    beacon: number[];
    distance: number;
}


run();
