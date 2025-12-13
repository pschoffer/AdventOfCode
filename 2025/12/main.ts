import * as path from 'path';
import * as fs from 'fs';
import { Coord2D, explode, parseArea } from '../lib/area.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputTestPath);

    const shapeVariants = input.baseShapes.map(explodeShape);
    console.log(JSON.stringify(input, null, 2))
}

const explodeShape = (shape: boolean[][]) => {
    const shapes: boolean[][][] = []

    shapes.push(deepCopy(shape));
    let prevShape = shape;
    for (let rotateIx = 0; rotateIx < 3; rotateIx++) {
        const newShape = deepCopy(prevShape)

        for (let y = 0; y < newShape.length; y++) {
            for (let x = 0; x < newShape.length; x++) {
                const newY = x;
                const newX = newShape.length - 1 - y;
                newShape[newY]![newX] = prevShape[y]![x]!
            }
        }
        shapes.push(newShape);

        prevShape = newShape;
    }


    return shapes;
}

const deepCopy = function <V>(a: V) { return JSON.parse(JSON.stringify(a)) as V }

const parseInput = (inputPath: string) => {
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines: string[] = data.split("\n");


    let parsingShapes = true;
    const baseShapes: boolean[][][] = [];
    let currentShape: boolean[][] = [];
    const regions: Region[] = [];
    for (const line of lines) {
        if (line.includes('x')) {
            parsingShapes = false;
        }
        if (!line.length) {
            if (parsingShapes) {
                baseShapes.push(currentShape)
                currentShape = [];
            }
            continue;
        }
        if (line.match(`^[0-9]:`)) {
            continue;
        }

        if (parsingShapes) {
            currentShape.push(line.split('').map(char => char === '#'))
        } else {
            const [sizeStr, giftsStr] = line.split(': ');
            const size = sizeStr!.split('x').map(Number) as Coord2D;
            const gifts = giftsStr!.split(' ').map(Number);
            const newRegion: Region = {
                size,
                gifts,
            }
            regions.push(newRegion);
        }
    }

    return { baseShapes, regions };
}

interface Region {
    size: Coord2D,
    gifts: number[]
}

run();
