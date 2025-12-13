import * as path from 'path';
import * as fs from 'fs';
import { Coord2D, explode, parseArea } from '../lib/area.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);
    const shapeVariants = input.baseShapes.map(explodeShape);

    let result = 0;
    for (let rIx = 0; rIx < input.regions.length; rIx++) {
        const region = input.regions[rIx]!;
        const placeNextShape = (validCoords: Coord2D[], area: string[][], remainingShapes: number[], remainingShapesCount: number): boolean => {

            const missingShapeIxs = remainingShapes.map((shapeCount, ix) => shapeCount > 0 ? ix : null)
                .filter(ix => ix !== null);

            for (const candidateCoord of validCoords) {
                for (const shapeIx of missingShapeIxs) {
                    for (const variant of shapeVariants[shapeIx]!) {
                        const newArea = deepCopy(area);
                        const newValidCoords: Coord2D[] = []

                        let canFit = true;
                        for (let y = 0; y < variant.length; y++) {
                            for (let x = 0; x < variant[y]!.length; x++) {
                                const areaY = y + candidateCoord[0]!
                                const areaX = x + candidateCoord[1]!
                                if (areaY >= region.size[0] || areaX >= region.size[1]) {
                                    canFit = false;
                                    break;
                                }

                                const isPart = variant[y]![x]!
                                if (isPart && newArea[areaY]![areaX] === '#') {
                                    canFit = false;
                                    break;
                                }
                                if (isPart) {
                                    newArea[areaY]![areaX] = '#';
                                }
                                if (!isPart && newArea[areaY]![areaX] === '.') {
                                    newValidCoords.push([areaY, areaX]);
                                }
                            }
                            if (!canFit) break;
                        }

                        if (!canFit) continue

                        const newRemainigShapeCount = remainingShapesCount - 1;
                        if (newRemainigShapeCount === 0) {
                            console.log(`FOUND IT!`);
                            return true;
                        }

                        const borderCoords = getBorderCoords(candidateCoord, region.size);
                        for (const coord of borderCoords.concat(validCoords)) {
                            if (newArea[coord[0]]![coord[1]] === '#') {
                                continue;
                            }
                            if (!newValidCoords.includes(coord)) {
                                newValidCoords.push(coord);
                            }
                        }
                        const newRemainigShapse = deepCopy(remainingShapes);
                        newRemainigShapse[shapeIx]!--;


                        const canPlaceNextShapes = placeNextShape(newValidCoords, newArea, newRemainigShapse, newRemainigShapeCount)
                        if (canPlaceNextShapes) {
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        // const initialArea: string[][] = [];
        // for (let y = 0; y < region?.size[0]!; y++) {
        //     initialArea.push([])
        //     for (let x = 0; x < region?.size[1]!; x++) {
        //         initialArea[y]?.push('.');
        //     }
        // }


        // const initialShapeCount = region.gifts.reduce((prev, curr) => prev + curr, 0)
        // const canPlace = placeNextShape([[0, 0]], initialArea, region.gifts, initialShapeCount);
        // console.log(`[${rIx}] Checked region - ${canPlace}`)
        // if (canPlace) {
        //     result++;
        // }

        const area = region.size[0] * region.size[1];
        const neededPlace = region.gifts
            .map((count, ix) => count * 9)
            .reduce((prev, curr) => prev + curr, 0)
        const canFit = (area - neededPlace) >= 0
        console.log(`Area ${area}, nee ${neededPlace} - canFit ${canFit}`)
        if (canFit) {
            result++;
        }
    }

    console.log('Res', result)
}

const getBorderCoords = (coord: Coord2D, size: [number, number]) => {
    const borderCoords: Coord2D[] = [];

    const currentCoord = [coord[0] - 1, coord[1] - 1]
    const adjustments: Coord2D[] = [[0, 1], [1, 0], [0, -1], [-1, 0]]

    for (const adjustment of adjustments) {
        for (let shifIx = 0; shifIx < 4; shifIx++) {
            if (currentCoord[0]! >= 0 && currentCoord[0]! < size[0] &&
                currentCoord[1]! >= 0 && currentCoord[1]! < size[1]
            ) {
                borderCoords.push(deepCopy(currentCoord) as any)
            }

            currentCoord[0]! += adjustment[0]!
            currentCoord[1]! += adjustment[1]!
        }
    }


    return borderCoords;
}

const explodeShape = (shape: boolean[][]) => {
    const shapes: boolean[][][] = []
    const flippedShape = flipShape(shape);

    const rotatedShapes = rotateShape(shape);
    const rotatedFlippedShapes = rotateShape(flippedShape)

    const shapeKeys: string[] = [];
    for (const shape of rotatedShapes.concat(rotatedFlippedShapes)) {
        const key = JSON.stringify(shape);
        if (shapeKeys.includes(key)) {
            continue;
        }
        shapeKeys.push(key);
        shapes.push(shape);
    }

    return shapes;
}

const flipShape = (shape: boolean[][]) => {
    const newShape = deepCopy(shape);
    for (let y = 0; y < newShape.length; y++) {
        for (let x = 0; x < newShape.length; x++) {
            const newX = newShape.length - 1 - x;
            newShape[y]![newX] = shape[y]![x]!;
        }
    }
    return newShape;;
}
const rotateShape = (shape: boolean[][]) => {
    const rotatedShapes: boolean[][][] = []

    rotatedShapes.push(deepCopy(shape));
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
        rotatedShapes.push(newShape);

        prevShape = newShape;
    }
    return rotatedShapes;
}


const deepCopy = function <V>(a: V) { return JSON.parse(JSON.stringify(a)) as V }

const parseInput = (inputPath: string) => {
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines: string[] = data.split("\n");


    let parsingShapes = true;
    const baseShapes: boolean[][][] = [];
    const baseShapeAreas: number[] = []
    let currentShape: boolean[][] = [];
    let currentShapeParts = 0;
    const regions: Region[] = [];
    for (const line of lines) {
        if (line.includes('x')) {
            parsingShapes = false;
        }
        if (!line.length) {
            if (parsingShapes) {
                baseShapes.push(currentShape)
                baseShapeAreas.push(currentShapeParts);
                currentShape = [];
                currentShapeParts = 0;
            }
            continue;
        }
        if (line.match(`^[0-9]:`)) {
            continue;
        }

        if (parsingShapes) {
            const row = line.split('').map(char => char === '#');
            currentShapeParts += row.filter(Boolean).length;
            currentShape.push(row)
        } else {
            const [sizeStr, giftsStr] = line.split(': ');
            const size = sizeStr!.split('x').map(Number) as Coord2D;
            const gifts = giftsStr!.split(' ').map(Number);
            const newRegion: Region = {
                size: [size[1], size[0]],
                gifts,
            }
            regions.push(newRegion);
        }
    }

    return { baseShapes, baseShapeAreas, regions };
}

interface Region {
    size: Coord2D,
    gifts: number[]
}

run();
