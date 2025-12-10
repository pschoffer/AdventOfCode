import * as path from 'path';
import * as fs from 'fs';
import { calculatePerAxisDistance, Coord2D, explode, isInBounds, parseArea } from '../lib/area.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');
const inputTestPath2 = path.join(__dirname, 'test2.txt');

interface Line {
    sharedCoord: number;
    min: number;
    max: number;
}

const run = async () => {
    const input = parseInput(inputPath);
    const lines: Record<0 | 1, Line[]> = {
        0: [],
        1: [],
    };
    const mins: Record<0 | 1, number> = {
        0: input[0]![0],
        1: input[0]![1],
    };

    for (let ix = 0; ix < input.length; ix++) {
        const first = input[ix]!;
        let secondIx = ix < (input.length - 1) ? ix + 1 : 0;
        const second = input[secondIx]!

        let addedLine = false;
        for (const axIx of [0, 1] as (0 | 1)[]) {
            if (first[axIx] === second[axIx]) {
                const otherAxIx = axIx === 0 ? 1 : 0;
                const sharedCoord = first[axIx];
                const newLine: Line = {
                    sharedCoord,
                    min: Math.min(first[otherAxIx], second[otherAxIx]),
                    max: Math.max(first[otherAxIx], second[otherAxIx]),
                }
                lines[axIx].push(newLine);

                if (sharedCoord < mins[axIx]) {
                    mins[axIx] = sharedCoord;
                }
                addedLine = true;
            }
        }
        if (!addedLine) {
            throw Error('No bueno')
        }
    }

    const pointsOutside: Set<string> = new Set();

    const isLineInArea = (points: [Coord2D, Coord2D], axIx: 0 | 1) => {
        const fixed = points[0][axIx === 0 ? 1 : 0];
        const possibleTouchingLines = lines[axIx].filter(line => line.min <= fixed && line.max >= fixed)
        const edgeLines = possibleTouchingLines.filter(line => line.min === fixed || line.max === fixed);
        const pointsCoord = points.map(point => point[axIx])
        const linesCoord = possibleTouchingLines
            .map(line => [line.sharedCoord, line.sharedCoord + 1])
            .reduce((prev, current) => prev.concat(current), [])
        const possibleActionCoords = [...new Set(pointsCoord.concat(linesCoord))]
        possibleActionCoords.sort((a, b) => a - b);
        let current = possibleActionCoords.shift()!;


        let pointsFound = 0;
        let inside = false;
        while (pointsFound < points.length && current !== undefined) {
            if (pointsFound === 1 && !inside) {
                return false;
            }

            let newInside: boolean = inside;
            const enteringLines = possibleTouchingLines
                .filter(line => line.sharedCoord === current)
            let relevantLinesLength = 0
            if (inside) {
                const touchingEdgeLines = edgeLines.filter(lines => lines.sharedCoord === current);
                relevantLinesLength = enteringLines.length;
                for (const touchingEdgeLine of touchingEdgeLines) {
                    const nextPoint: Coord2D = [fixed, fixed]
                    nextPoint[axIx] = touchingEdgeLine.sharedCoord + 1;
                    const isNextPointInAreaFromOtherAxis = isLineInArea([nextPoint, nextPoint], axIx === 0 ? 1 : 0);
                    if (isNextPointInAreaFromOtherAxis) {
                        relevantLinesLength--;
                    }
                }
            } else {
                relevantLinesLength = enteringLines.length;
            }


            const changingInside = !!(relevantLinesLength % 2)
            if (changingInside) {
                newInside = !inside
            }

            const touchingPoints = points.filter(point => point[axIx] === current);
            if (touchingPoints.length && !inside && !newInside) {
                for (const touchingPoint of touchingPoints) {
                    pointsOutside.add(JSON.stringify(touchingPoint))
                }
                return false;
            }

            pointsFound += touchingPoints.length;
            inside = newInside;
            current = possibleActionCoords.shift()!;
        }
        return true;
    }

    let highestArea = 0;
    for (let firstIx = 0; firstIx < input.length; firstIx++) {
        for (let secondIx = firstIx + 1; secondIx < input.length; secondIx++) {
            const firstCoord = input[firstIx]!
            const secondCoord = input[secondIx]!

            const distances = calculatePerAxisDistance(firstCoord, secondCoord)
            const area = (distances[0]! + 1) * (distances[1]! + 1);
            if (area <= highestArea) {
                continue;
            }

            const firstRowPoints: [Coord2D, Coord2D] = [firstCoord, [secondCoord[0], firstCoord[1]]];
            const secondRowPoints: [Coord2D, Coord2D] = [[firstCoord[0], secondCoord[1]], secondCoord];
            const firstColumnPoints: [Coord2D, Coord2D] = [firstRowPoints[0], secondRowPoints[0]];
            const secondColumnPoints: [Coord2D, Coord2D] = [firstRowPoints[1], secondRowPoints[1]];
            const edges = firstRowPoints.concat(secondRowPoints);
            const anyEdgeOutside = edges.some(edge => pointsOutside.has(JSON.stringify(edge)))
            if (anyEdgeOutside) {
                continue;
            }

            const bothRowsInArea = [firstRowPoints, secondRowPoints]
                .every(row => isLineInArea(row, 0));
            if (!bothRowsInArea) {
                continue;
            }

            const bothColumnsInarea = [firstColumnPoints, secondColumnPoints]
                .every(column => isLineInArea(column, 1))
            if (!bothColumnsInarea) {
                continue;
            }


            highestArea = area;
            console.log(`[${firstIx} - ${secondIx}/${input.length}] Found area ${firstCoord}, ${secondCoord} - ${area}`)
        }
    }

    console.log(highestArea)
}

const parseInput = (inputPath: string) => {
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines: string[] = data.split("\n");

    const result = [];

    for (const line of lines) {
        const coordinate = line.split(',').map(Number) as Coord2D;
        result.push(coordinate);
    }

    return result;
}

run();
