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
    const reverse: Record<string, string[]> = {};

    for (const source of Object.keys(input)) {
        const targets = input[source] || [];
        for (const target of targets) {
            if (!reverse[target]) {
                reverse[target] = [];
            }
            reverse[target] = [...new Set(reverse[target].concat([source]))]
        }
    }

    const findValidPoints = (target: string) => {
        const validPoints: Set<string> = new Set();
        let paths: Path[] = [{
            currentPlace: target,
            visited: []
        }]

        while (paths.length) {
            paths = paths.filter(path => !validPoints.has(path.currentPlace))

            const currentPath = paths.shift()!;
            if (!currentPath) {
                break;
            }
            validPoints.add(currentPath.currentPlace);

            const connections = reverse[currentPath.currentPlace] || [];
            const notVisitedConnections = connections
                .filter(con => !currentPath.visited.includes(con))
            for (const connection of notVisitedConnections) {
                const newPath: Path = {
                    currentPlace: connection,
                    visited: [...currentPath.visited].concat([currentPath.currentPlace])
                }
                paths.push(newPath)
            }
        }
        return validPoints;
    }

    const fftValidPoints = findValidPoints('fft');
    const dacValidPoints = findValidPoints('dac');

    const allValidPoints: Set<string> = new Set();
    for (const point of fftValidPoints) {
        if (dacValidPoints.has(point)) {
            allValidPoints.add(point)
        }
    }


    const countCache: Record<string, number> = {};
    const countPaths = (currentPath: Path) => {
        if (countCache[currentPath.currentPlace]) {
            return countCache[currentPath.currentPlace]!;
        }

        if (currentPath.currentPlace === 'out') {
            if (currentPath.visited.includes('fft') && currentPath.visited.includes('dac')) {
                console.log(`Found path - ${JSON.stringify(currentPath.visited)}`)
                return 1;
            }
            return 0;
        }

        const connections = input[currentPath.currentPlace] || [];
        const notVisitedConnections = connections
            .filter(con => !currentPath.visited.includes(con))
        const newVisited = [...currentPath.visited].concat([currentPath.currentPlace]);

        const allValidConnections = notVisitedConnections
            .filter(con => {
                if (newVisited.includes('fft') && newVisited.includes('dac')) {
                    return true;
                }
                if (newVisited.includes('fft')) {
                    return dacValidPoints.has(con)
                }
                if (newVisited.includes('dac')) {
                    return fftValidPoints.has(con)
                }
                return allValidPoints.has(con)
            })

        let localPathsCount = 0;
        for (const connection of allValidConnections) {
            localPathsCount += countPaths({ currentPlace: connection, visited: newVisited })
        }

        countCache[currentPath.currentPlace] = localPathsCount;
        return localPathsCount;
    }

    const foundPaths = countPaths({
        currentPlace: 'svr',
        visited: []
    });

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
