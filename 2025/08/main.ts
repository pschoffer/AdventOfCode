import * as path from 'path';
import * as fs from 'fs';
import { calculateDistance, calculateDistanceEu, explode, parseArea } from '../lib/area.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');


interface Distance {
    distance: number;
    target: string;
}
type PossibleConnections = Record<string, {
    distances: Distance[]
}>

// const CONNECTIN_COUNT = 10;
// const CONNECTIN_COUNT = 500;
const CONNECTIN_COUNT = 1000;

const run = async () => {
    const input = parseInput(inputPath);

    const possibleConnections: PossibleConnections = {};
    let circuits: string[][] = []


    for (let junktionIx = 0; junktionIx < input.length; junktionIx++) {
        const junction = input[junktionIx]!;
        const key = JSON.stringify(junction);
        circuits.push([key])

        const distances: Distance[] = [];
        for (let otherIx = junktionIx + 1; otherIx < input.length; otherIx++) {
            const otherJunction = input[otherIx]!;
            const otherKey = JSON.stringify(otherJunction)
            if (otherKey === key) {
                continue;
            }

            const distance = calculateDistanceEu(junction, otherJunction)
            distances.push({
                distance,
                target: otherKey
            })
        }

        distances.sort((a, b) => a.distance - b.distance);

        possibleConnections[key] = { distances };
    }


    let connectionCount = 0;
    while (connectionCount < CONNECTIN_COUNT) {
        const candidates = Object.keys(possibleConnections)
        candidates.sort((a, b) => (possibleConnections[a]?.distances[0]?.distance! || 99999999) - (possibleConnections[b]?.distances[0]?.distance! || 99999999))

        const source = candidates[0]!
        const connection = possibleConnections[source!]!.distances.shift()!
        const target = connection.target;
        console.info(`[${connectionCount}]: Connecting ${source} <=> ${target} (d: ${connection.distance})`)

        let firstCircuitIx = -1;
        let combined = false;
        let alreadyConnected = false;
        const newCircuits: string[][] = []
        for (let ix = 0; ix < circuits.length; ix++) {
            const circuit = circuits[ix]!;

            if (combined) {
                newCircuits.push(circuit);
                continue;
            }

            let justCombinedThisone = false;
            for (let junctionKey of [source, target]) {
                if (circuit.includes(junctionKey)) {
                    if (firstCircuitIx === -1) {
                        firstCircuitIx = ix;
                    } else if (firstCircuitIx === ix) {
                        alreadyConnected = true;
                        // console.log('already connected')
                        break;
                    } else {
                        justCombinedThisone = true;
                        const combinedCircuit = circuits[firstCircuitIx]?.concat(circuits[ix]!)!;
                        newCircuits[firstCircuitIx] = combinedCircuit;
                    }
                }
            }

            if (alreadyConnected) {
                break
            }
            if (justCombinedThisone) {
                combined = true;
            } else {
                newCircuits.push(circuit);
            }

        }

        connectionCount++;
        if (!alreadyConnected) {
            circuits = newCircuits;
        }
    }

    const circuitLenghts = circuits.map(circuit => circuit.length)
    circuitLenghts.sort((a, b) => b - a)

    const result = circuitLenghts[0]! * circuitLenghts[1]! * circuitLenghts[2]!;


    console.log(result)
}

const parseInput = (inputPath: string) => {
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines: string[] = data.split("\n");

    const result = [];

    for (const line of lines) {
        const coordinates = line.split(',').map(Number) as [number, number, number]
        result.push(coordinates);
    }

    return result;
}

run();
