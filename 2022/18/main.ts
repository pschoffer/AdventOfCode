import { getManhattanDistance, explodePoint } from "../lib/area";

const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);
    // const input = parseInput(inputTestPath);

    const airPoints = findAirPoints(input);

    const lavaPoints = new Set(input.map(droplet => makeKey(droplet.position)))
    const airTouchingPoints = new Set(airPoints.map(makeKey))
    const processedAirPoints = new Set<string>();

    const pockets: AirPocket[] = []
    for (const airPoint of airPoints) {
        if (processedAirPoints.has(makeKey(airPoint))) {
            continue;
        }
        const pocket = findAirPocket(airPoint, lavaPoints, airTouchingPoints, processedAirPoints);
        pockets.push(pocket);
    }

    pockets.sort((a, b) => b.touch - a.touch);

    console.log(pockets[0].touch)
}

const makeKey = (point: number[]): string => point.join('-');

const findAirPocket = (startPoint: number[], lavaPoints: Set<string>, airTouchingPoints: Set<string>, processedAirPoints: Set<string>): AirPocket => {
    let touch = 0;
    let points: string[] = [];
    const startKey = makeKey(startPoint);
    if (!processedAirPoints.has(startKey)) {
        const neighbours = explodePoint(startPoint);
        let lavaNeighbours: number[][] = [];
        let airNeighbourTouching: number[][] = [];
        let airNeighbourNotTouching: number[][] = [];
        for (const neighbour of neighbours) {
            const key = makeKey(neighbour);
            if (lavaPoints.has(key)) {
                lavaNeighbours.push(neighbour);
            } else if (airTouchingPoints.has(key)) {
                airNeighbourTouching.push(neighbour);
            } else {
                airNeighbourNotTouching.push(neighbour)
            }
        }

        const fill = lavaNeighbours.length
        processedAirPoints.add(startKey);
        touch += fill;
        points.push(startKey)

        const neighboursToInclude = fill > 0 ? airNeighbourTouching.concat(airNeighbourNotTouching) : airNeighbourTouching;
        for (const neighbour of neighboursToInclude) {
            const neighbourResult = findAirPocket(neighbour, lavaPoints, airTouchingPoints, processedAirPoints);
            touch += neighbourResult.touch;
            points = points.concat(neighbourResult.points);
        }

    }

    return {
        points,
        touch
    }

}

const findAirPoints = (droplets: Droplet[]): number[][] => {
    const groupedLava: Record<number, Droplet[]> = {};
    for (const droplet of droplets) {
        if (!groupedLava[droplet.distance]) {
            groupedLava[droplet.distance] = [];
        }
        groupedLava[droplet.distance].push(droplet);
    }

    const airCoordinateSet: Set<string> = new Set();
    for (const droplet of droplets) {
        const candidates = [groupedLava[droplet.distance - 1], groupedLava[droplet.distance], groupedLava[droplet.distance + 1]]
            .filter(arr => !!arr)
            .flat();

        const fullNeighbours = candidates
            .filter(candidate => getManhattanDistance(candidate.position, droplet.position) === 1)
            .map(candidate => candidate.position.join(','))

        const allNeighbours = explodePoint(droplet.position);
        for (const neighbour of allNeighbours) {
            const key = neighbour.join(',');
            if (!fullNeighbours.includes(key)) {
                airCoordinateSet.add(key)
            }
        }
    }

    const airCoordinates: number[][] = [...airCoordinateSet]
        .map(coordinateString => coordinateString.split(',').map(Number))
    return airCoordinates;
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

interface AirPocket {
    points: string[],
    touch: number
}


interface Droplet {
    position: number[],
    distance: number,
}

run();
