import { getManhattanDistance } from "../lib/area";

const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    // const input = parseInput(inputTestPath);
    // const targetY = 10;
    const input = parseInput(inputPath);
    const targetY = 2000000;

    const emptySpace = new Set<number>();
    const beacons = new Set<number>();

    for (const line of input) {
        if (line.beacon[0] === targetY) {
            beacons.add(line.beacon[1]);
        }

        const targetLineDistance = getManhattanDistance(line.sensor, [targetY, line.sensor[1]]);
        const targetLineSpace = line.distance - targetLineDistance;
        if (targetLineSpace <= 0) {
            continue;
        }

        for (let x = line.sensor[1] - targetLineSpace; x <= line.sensor[1] + targetLineSpace; x++) {
            emptySpace.add(x);
        }
    }

    console.log(emptySpace.size - beacons.size);
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
