const { getManhattanDistance, explodePoint, isInBounds, pointsEqual } = require("../lib/area");

const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);
    // const input = parseInput(inputTestPath);

    const result = findPath(input);
    console.log(result)
}

const findPath = (input: Input): number => {
    const queue: Item[] = [{
        position: input.start,
        steps: 0,
        heuristic: getManhattanDistance(input.start, input.end),
    }];
    const visited = new Set<string>();
    const edge = [input.area.length - 1, input.area[0].length - 1];

    while (true) {
        const currentItem = queue.shift();
        if (!currentItem) {
            throw new Error('No path found');
        }

        if (visited.has(currentItem.position.join(','))) {
            continue;
        }


        if (pointsEqual(currentItem.position, input.end)) {
            return currentItem.steps;
        }

        const neighbours = explodePoint(currentItem.position) as number[][];
        const validNeighbours = neighbours.filter(neighbour => isInBounds(neighbour, edge))
        const accessibleNewigbours = validNeighbours
            .filter(neighbour => input.area[neighbour[0]][neighbour[1]] - input.area[currentItem.position[0]][currentItem.position[1]] <= 1);
        const nonVisitedNeighbours = accessibleNewigbours.filter(neighbour => !visited.has(neighbour.join(',')));

        for (const neighbour of nonVisitedNeighbours) {
            const steps = currentItem.steps + 1;
            queue.push({
                position: neighbour,
                steps: steps,
                heuristic: getManhattanDistance(neighbour, input.end) + steps,
            });
        }

        queue.sort((a, b) => a.heuristic - b.heuristic);

        visited.add(currentItem.position.join(','));
    }
}

const parseInput = (inputPath: string) => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines = data.split("\n");

    const result: Input = {
        area: [],
        start: [],
        end: []
    };

    for (let y = 0; y < lines.length; y++) {
        const newRow: number[] = [];
        for (let x = 0; x < lines[y].length; x++) {
            const char = lines[y][x];
            if (char === 'S') {
                result.start = [y, x];
                newRow.push("a".charCodeAt(0));
            } else if (char === 'E') {
                result.end = [y, x];
                newRow.push("z".charCodeAt(0));
            } else {
                newRow.push(char.charCodeAt(0));
            }
        }
        result.area.push(newRow);
    }

    return result;
}

interface Item {
    position: number[],
    steps: number,
    heuristic: number,
}

interface Input {
    area: number[][]
    start: number[]
    end: number[]
};

run();
