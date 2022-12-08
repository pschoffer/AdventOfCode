const { isInBounds } = require("../lib/area");

const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);
    // const input = parseInput(inputTestPath);
    let maxScore = 0;
    const blockers: BlockerMap = { cols: {}, rows: {} };
    const edge = [input.length - 1, input[0].length - 1];

    for (let height = 9; height > 1; height--) {
        const candidates = findCandidatesAndAddToBlockers(input, height, blockers);
        console.log('testing height', height, 'candidates', candidates.length, 'prev max', maxScore);
        for (const candidate of candidates) {
            const score = calculateScore(blockers, candidate, edge);
            if (score > maxScore) {
                maxScore = score;
            }
        }

    }


    console.log(maxScore);
}

const calculateScore = (blockers: BlockerMap, test: number[], edge: number[]): number => {
    let score = 1;

    for (const direction of ['top', 'bottom', 'left', 'right'] as Direction[]) {
        let distance = calculateDistance(blockers, test, direction, edge);
        score *= distance;
        if (score === 0) {
            break;
        }
    }


    return score;
}

const calculateDistance = (blockers: BlockerMap, test: number[], direction: Direction, edge: number[]): number => {


    if (direction === 'left' || direction === 'right') {
        const row = blockers.rows[test[0]] || [];
        const adjust = direction === 'left' ? -1 : 1;
        const ix = row.indexOf(test[1]);
        const blockerIx = ix + adjust;
        if (blockerIx < 0 || blockerIx >= row.length) {
            return direction === 'left' ? test[1] : edge[1] - test[1];
        } else {
            return Math.abs(row[blockerIx] - test[1]);
        }
    } else {
        const col = blockers.cols[test[1]] || [];
        const adjust = direction === 'top' ? -1 : 1;

        const ix = col.indexOf(test[0]);
        const blockerIx = ix + adjust;
        if (blockerIx < 0 || blockerIx >= col.length) {
            return direction === 'top' ? test[0] : edge[0] - test[0];
        } else {
            return Math.abs(col[blockerIx] - test[0]);
        }
    }
}

function findCandidatesAndAddToBlockers(input: number[][], height: number, blockers: BlockerMap): number[][] {
    const candidates: number[][] = [];
    for (let y = 0; y < input.length; y++) {
        for (let x = 0; x < input[y].length; x++) {
            const element = input[y][x];
            if (element === height) {
                candidates.push([y, x]);
                blockers.rows[y] = (blockers.rows[y] || []).concat([x]);
                blockers.cols[x] = (blockers.cols[x] || []).concat([y]);
                blockers.rows[y].sort((a, b) => a - b);
                blockers.cols[x].sort((a, b) => a - b);
            }
        }
    }
    return candidates;
}



const parseInput = (inputPath: string): number[][] => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines = data.split("\n");

    const result: number[][] = [];

    for (const line of lines) {
        result.push(line.split('').map((c: string) => parseInt(c)));
    }

    return result;
}

type Direction = 'top' | 'bottom' | 'left' | 'right';

interface BlockerMap {
    rows: Record<number, number[]>
    cols: Record<number, number[]>
}


run();



