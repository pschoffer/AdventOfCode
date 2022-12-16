const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const MAX_TIME = 26;
// const MAX_TIME = 30;

const run = async () => {
    const input = parseInput(inputPath);
    // const input = parseInput(inputTestPath);

    let queue: Item[] = [
        {
            position: ['AA', 'AA'],
            released: 0,
            minPotential: 0,
            potential: buildIdealScenario(input, [], MAX_TIME),
            minute: 0,
            openValves: [],
            path: ['AA', 'AA'],
        }
    ];

    let winningPath: Item | undefined;
    let checkCount = 0;
    const visited: Record<string, Item> = {};
    while (queue.length > 0) {
        const item = queue.shift()!;

        const remainingValvesCount = calculateRemaining(input, item);
        const visitedItem = visited[getItemKey(item)];
        if (remainingValvesCount && visitedItem) {
            if (item.minute >= visitedItem.minute) {
                if (item.minPotential <= visitedItem.minPotential) {
                    continue;
                }
            }
        }
        visited[getItemKey(item)] = item;

        if (!winningPath || winningPath.released < item.released) {
            winningPath = item;
        }

        if (checkCount % 10000 === 0) {
            console.log('Queue length', queue.length, 'Winning path', winningPath.released, 'M', winningPath.minute);
        }
        checkCount++;

        const options = buildOptions(item, input);

        queue.push(...options);
        queue = queue.filter(o => {
            if (o.minute > MAX_TIME) {
                return false;
            }

            return o.potential >= winningPath!.minPotential;
        })
        // queue.sort((a, b) => b.released * (MAX_TIME - b.minute) - a.released * (MAX_TIME - a.minute));
        // queue.sort((a, b) => b.released - a.released || b.minPotential - a.minPotential || b.potential - a.potential);
        queue.sort((a, b) => b.minPotential - a.minPotential || b.potential - a.potential);
    }
    console.log(winningPath?.released);
}

const getItemKey = (item: Item) => {
    item.openValves.sort();
    return `${item.position}-${item.openValves.join(',')}`;
};

const buildSubOption = (item: Item, valves: Record<string, Valve>, ix: number): string[] => {
    const subOptions: string[] = [];

    const currentValve = valves[item.position[ix]];
    if (currentValve.rate > 0 && !item.openValves.includes(currentValve.id)) {
        subOptions.push('open');
    }

    subOptions.push(...currentValve.neighbors);

    return subOptions;
}

const buildOptions = (item: Item, valves: Record<string, Valve>): Item[] => {
    const result: Item[] = [];

    const remainingValvesCount = calculateRemaining(valves, item);
    const remainingTime = MAX_TIME - item.minute - 1;
    const released = item.released + calculateIncrement(item.openValves, valves);
    if (!remainingValvesCount) {
        const minPotential = released + calculateIncrement(item.openValves, valves) * remainingTime;
        const potential = buildIdealScenario(valves, item.openValves, remainingTime) + minPotential;
        return [{
            position: item.position,
            minute: item.minute + 1,
            openValves: [...item.openValves],
            released,
            potential,
            minPotential,
            path: item.path.map(p => p + '!')
        }];
    }

    const subOptions = [0, 1]
        .map(ix => buildSubOption(item, valves, ix));
    const combinations: string[][] = [];
    for (let i = 0; i < subOptions[0].length; i++) {
        for (let j = 0; j < subOptions[1].length; j++) {
            combinations.push([subOptions[0][i], subOptions[1][j]]);
        }
    }

    for (const combination of combinations) {
        const openValvesSet = new Set(item.openValves);
        const position = [...item.position];
        const path = [...item.path];
        for (let ix = 0; ix < 2; ix++) {
            if (combination[ix] === 'open') {
                openValvesSet.add(valves[position[ix]].id);
                path[ix] += '[O]';
            } else {
                position[ix] = combination[ix];
                path[ix] += '->' + combination[ix];
            }
        }
        const openValves = [...openValvesSet];
        const minPotential = released + calculateIncrement(openValves, valves) * remainingTime;
        const potential = buildIdealScenario(valves, openValves, remainingTime) + minPotential;
        result.push({
            position,
            minute: item.minute + 1,
            openValves,
            released,
            minPotential,
            potential,
            path
        });
    }

    return result;
}

const calculateRemaining = (valves: Record<string, Valve>, item: Item): number => {
    return Object.values(valves)
        .filter(v => !item.openValves.includes(v.id))
        .filter(v => v.rate > 0)
        .length;
}

const calculateIncrement = (ids: string[], valves: Record<string, Valve>): number => {
    let total = 0;
    for (const id of ids) {
        total += valves[id].rate;
    }
    return total;
}

const buildIdealScenario = (valves: Record<string, Valve>, openedValves: string[], remainingTime: number): number => {

    const allValves = Object.values(valves).filter(v => !openedValves.includes(v.id)).filter(v => v.rate > 0);
    allValves.sort((a, b) => b.rate - a.rate);

    let opening = true;
    let total = 0;
    let increment = 0;
    for (let minute = 0; minute <= remainingTime; minute++) {
        total += increment;
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

    return total;
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
    position: string[],
    released: number,
    minPotential: number,
    potential: number,
    minute: number,
    openValves: string[],
    path: string[],
}

interface Valve {
    id: string,
    rate: number,
    neighbors: string[],
}

run();
