import { getManhattanDistance } from "../lib/area";

const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const SIDE_COUNT = 6;

const run = async () => {
    const input = parseInput(inputPath);
    // const input = parseInput(inputTestPath);

    const grouped: Record<number, Droplet[]> = {};
    for (const droplet of input) {
        if (!grouped[droplet.distance]) {
            grouped[droplet.distance] = [];
        }
        grouped[droplet.distance].push(droplet);
    }

    let freeSides = 0;
    for (const droplet of input) {
        const candidates = [grouped[droplet.distance - 1], grouped[droplet.distance], grouped[droplet.distance + 1]]
            .filter(arr => !!arr)
            .flat();

        const directNeighbours = candidates
            .map(candidate => getManhattanDistance(candidate.position, droplet.position))
            .filter(distance => distance === 1)
        freeSides += SIDE_COUNT - directNeighbours.length;
    }

    console.log(freeSides)
}

const parseInput = (inputPath: string) => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines = data.split("\n");

    const result: Droplet[] = [];

    for (const line of lines) {
        const [x, y, z] = line.split(',').map(Number);
        const position = [z, y, x];
        result.push({
            position,
            distance: getManhattanDistance(position, [0, 0, 0])
        });
    }

    result.sort((a, b) => a.distance - b.distance);
    return result;
}

interface Droplet {
    position: number[],
    distance: number,
}

run();
