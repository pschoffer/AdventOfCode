import * as path from 'path';
import * as fs from 'fs';
import { explode, parseArea } from '../lib/area.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

interface Path {
    currentPlace: string;
    visited: string[];
}

const run = async () => {
    const input = parseInput(inputPath);
    const paths: Path[] = [{
        currentPlace: 'you',
        visited: []
    }]

    let foundPaths = 0;
    while (paths.length) {
        const currentPath = paths.shift()!;

        if (currentPath.currentPlace === 'out') {
            console.log(`Found path - ${JSON.stringify(currentPath.visited)} - ${paths.length}`)
            foundPaths++;
            continue;
        }

        const connections = input[currentPath.currentPlace] || [];
        const notVisitedConnections = connections.filter(con => !currentPath.visited.includes(con))
        for (const connection of notVisitedConnections) {
            const newPath: Path = {
                currentPlace: connection,
                visited: [...currentPath.visited].concat([currentPath.currentPlace])
            }
            paths.push(newPath)
        }
    }


    console.log(foundPaths)
}

const parseInput = (inputPath: string) => {
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines: string[] = data.split("\n");

    const outputs: Record<string, string[]> = {}
    for (const line of lines) {
        const [source, targets] = line.split(': ');
        outputs[source!] = targets?.split(' ')!
    }

    return outputs;
}

run();
