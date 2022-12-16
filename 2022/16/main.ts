const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const MAX_TIME = 30;

const run = async () => {
    const input = parseInput(inputPath);
    // const input = parseInput(inputTestPath);

    const idealScenario = buildIdealScenario(input);

    const queue: Item[] = [
        {
            position: 'AA',
            released: 0,
            minute: 0,
            openValves: [],
        }
    ];

    let winningPath: Item | undefined;
    let checkCount = 0;
    while (queue.length > 0) {
        const item = queue.shift()!;
        if (!winningPath || winningPath.released < item.released) {
            winningPath = item;
        }

        if (checkCount % 10000 === 0) {
            console.log('Queue length', queue.length, 'Winning path', winningPath.released);
        }
        checkCount++;

        const options = buildOptions(item, input);
        const optionRemainingTime = MAX_TIME - item.minute - 1;
        const maxPotential = idealScenario[optionRemainingTime];
        const worthOptions = options.filter(o => {
            if (o.minute > MAX_TIME) {
                return false;
            }

            const potentialRelease = o.released + calculateIncrement(o.openValves, input) * optionRemainingTime + maxPotential;
            return potentialRelease > winningPath!.released;
        });

        queue.push(...worthOptions);
        queue.sort((a, b) => (b.released - a.released) + (b.openValves.length - a.openValves.length) * optionRemainingTime);
    }
    console.log(winningPath?.released);
}

const buildOptions = (item: Item, valves: Record<string, Valve>): Item[] => {
    const result: Item[] = [];

    const currentValve = valves[item.position];
    if (currentValve.rate > 0 && !item.openValves.includes(currentValve.id)) {
        result.push({
            position: item.position,
            minute: item.minute + 1,
            openValves: [...item.openValves, currentValve.id],
            released: item.released + calculateIncrement(item.openValves, valves),
        });
    }

    for (const neighbor of currentValve.neighbors) {
        result.push({
            position: neighbor,
            minute: item.minute + 1,
            openValves: [...item.openValves],
            released: item.released + calculateIncrement(item.openValves, valves),
        });
    }

    return result;
}

const calculateIncrement = (ids: string[], valves: Record<string, Valve>): number => {
    let total = 0;
    for (const id of ids) {
        total += valves[id].rate;
    }
    return total;
}

const buildIdealScenario = (valves: Record<string, Valve>): number[] => {
    const idealRelease: number[] = [];

    const allValves = Object.values(valves);
    allValves.sort((a, b) => b.rate - a.rate);

    let opening = true;
    let total = 0;
    let increment = 0;
    for (let minute = 0; minute <= MAX_TIME; minute++) {
        total += increment;
        idealRelease.push(total);

        if (opening) {
            const valve = allValves.shift();
            if (valve) {
                increment += valve.rate;
            }
            opening = false;
        } else {
            opening = true;
        }

    }

    return idealRelease;
}

const parseInput = (inputPath: string): Record<string, Valve> => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines = data.split("\n");

    const result: Record<string, Valve> = {};

    for (const line of lines) {
        const match = line.match(/Valve (.*) has flow rate=(.*); tunnels? leads? to valves? (.*)/);
        const id = match[1];
        const rate = parseInt(match[2]);
        const neighbors = match[3].split(', ');

        result[id] = {
            id,
            rate,
            neighbors,
        };
    }

    return result;
}

interface Item {
    position: string,
    released: number,
    minute: number,
    openValves: string[],
}

interface Valve {
    id: string,
    rate: number,
    neighbors: string[],
}

run();
