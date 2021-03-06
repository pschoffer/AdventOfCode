const path = require('path');
const { Point, AreaXD, PointXD } = require('../utils/area');
const array = require('../utils/array');
const { constructArea } = require('../utils/array');
const { readFileLines } = require('../utils/file');
const { Interval, range } = require('../utils/interval');
const { sumArr, mulArr } = require('../utils/math');
const { progress } = require('../utils/print');

let inputPath = path.join(__dirname, 'input.txt');
// inputPath = path.join(__dirname, 'test.txt');



const getBorders = (area) => {
    const borders = [];

    borders.push(area.getRow(0));
    borders.push(area.getColumn(area.maxX));

    const button = area.getRow(area.maxY);
    button.reverse();
    borders.push(button);

    const left = area.getColumn(0);
    left.reverse()
    borders.push(left);

    return borders;
}

const parseTiles = (lines) => {
    const tiles = new Map();

    let currentTile = null;
    let currentTileLines = [];
    for (let ix = 0; ix <= lines.length; ix++) {
        const line = lines[ix] || '';

        if (titleLine = line.match(/Tile (\d+):/)) {
            currentTile = Number(titleLine[1]);
        } else if (line) {
            currentTileLines.push(line)
        } else {
            const area = constructArea(currentTileLines);
            const flippedArea = area.flip();
            tiles.set(currentTile, {
                id: currentTile,
                area: {
                    regular: area,
                    flipped: flippedArea
                },
                borders: {
                    regular: getBorders(area),
                    flipped: getBorders(flippedArea)
                }
            });

            currentTileLines = [];
        }

    }

    return tiles;
}

const possiblePositions = [false, true]
    .map(flipped => [0, 1, 2, 3].map(rotated => [flipped, rotated]))
    .reduce((prev, curr) => prev.concat(curr), []);

const getBorderAfterAdjustment = (borders, ix, flipped, rotated) => {
    const finalIx = (ix + rotated) % 4;

    const border = borders[flipped ? 'flipped' : 'regular'][finalIx]


    return border

}

const findSolution = (solutionSize, currentPoint, currentAttempt, candidates, tiles) => {

    if (!currentAttempt) {
        currentAttempt = range(solutionSize - 1).map(ix => Array(solutionSize));
    }

    if (candidates.length < 1) {
        return currentAttempt;
    }

    // Let's test
    const matchNeeded = {
        left: null,
        up: null
    };
    if (currentPoint.x > 0) {
        matchNeeded.left = {
            pos: 1,
            neighbour: currentAttempt[currentPoint.y][currentPoint.x - 1]
        }
    }
    if (currentPoint.y > 0) {
        matchNeeded.up = {
            pos: 2,
            neighbour: currentAttempt[currentPoint.y - 1][currentPoint.x],
        }
    }
    for (const dir of Object.keys(matchNeeded)) {
        if (matchNeeded[dir]) {
            const { pos, neighbour } = matchNeeded[dir];
            const border = [...getBorderAfterAdjustment(tiles.get(neighbour.id).borders, pos, neighbour.flipped, neighbour.rotated)];
            border.reverse();
            matchNeeded[dir] = JSON.stringify(border);
        }
    }

    for (const candidate of candidates) {
        for (const [flipped, rotated] of possiblePositions) {
            if (matchNeeded.left) {
                const leftBorder = getBorderAfterAdjustment(tiles.get(candidate).borders, 3, flipped, rotated);
                if (JSON.stringify(leftBorder) !== matchNeeded.left) {
                    continue;
                }
            }
            if (matchNeeded.up) {
                const upBorder = getBorderAfterAdjustment(tiles.get(candidate).borders, 0, flipped, rotated);
                if (JSON.stringify(upBorder) !== matchNeeded.up) {
                    continue;
                }
            }

            // This will work
            const newAtempt = JSON.parse(JSON.stringify(currentAttempt));
            newAtempt[currentPoint.y][currentPoint.x] = {
                id: candidate,
                flipped,
                rotated
            };
            const newCandidates = candidates.filter(c => c !== candidate);
            const newPoint = currentPoint.x >= solutionSize - 1 ? new PointXD(0, currentPoint.y + 1) : new PointXD(currentPoint.x + 1, currentPoint.y);
            const solution = findSolution(solutionSize, newPoint, newAtempt, newCandidates, tiles);

            if (solution) {
                return solution;
            }
        }
    }


    return null;
}

const run = async () => {
    const lines = (await readFileLines(inputPath));

    const tiles = parseTiles(lines);

    const resultSize = Math.sqrt(tiles.size);

    const candidates = [...tiles.keys()];


    const result = findSolution(resultSize, new PointXD(0, 0), null, candidates, tiles);

    return {
        result,
        tiles
    }
}


// ------------------------------- Part 2 -------------------------------

const getLines = (result, tiles) => {
    const tilesWithoutBorder = new Map();

    [...tiles.keys()].forEach(id => { tilesWithoutBorder.set(id, tiles.get(id).area.regular.removeBorder()) })

    const lines = result
        .map(resultLine => {
            return resultLine.map(({ id, flipped, rotated }) => {
                let area = tilesWithoutBorder.get(id);
                if (flipped) {
                    area = area.flip();
                }
                if (rotated) {
                    area = area.rotateCounter(rotated);
                }

                return area.lines();
            })
        })
        .map(resultLine => {
            return resultLine.reduce((prev, curr) => {
                if (prev.length === 0) {
                    return curr;
                } else {
                    const collector = [];
                    for (let ix = 0; ix < curr.length; ix++) {
                        collector.push(prev[ix].concat(curr[ix]));
                    }
                    return collector;
                }
            }, [])
        })
        .reduce((prev, curr) => prev.concat(curr), [])
        .map(line => line.join(''));
    return lines;
}

const line1 = /^.{18}#/;
const line2 = /#.{4}##.{4}##.{4}###/;
const line3 = /^.#..#..#..#..#..#/;

const monsterCharCount = 1 + 8 + 6;

const findMonster = (lines) => {
    let monsterCount = 0;
    for (let lineIx = 1; lineIx < lines.length - 1; lineIx++) {
        let currentIx = 0;
        let match = lines[lineIx].match(line2);


        while (match) {
            currentIx += match['index'];

            if (lines[lineIx - 1].substr(currentIx).match(line1) && lines[lineIx + 1].substr(currentIx).match(line3)) {
                monsterCount++;
            }

            currentIx++;
            line = lines[lineIx].substr(currentIx);
            match = line.match(line2);
        }
    }
    return monsterCount;
}

const run2 = async () => {
    const { result, tiles } = (await run());

    let lines = getLines(result, tiles);

    // I noticed fliping the picture no rotation results in some monsters so no need to try different variants.
    lines = constructArea(lines).flip().lines().map(line => line.join(''));

    const monsterCount = findMonster(lines);

    console.log(monsterCount, constructArea(lines).countValue('#') - (monsterCount * monsterCharCount));
}

// run2()

module.exports = {
    getBorders,
    getBorderAfterAdjustment,
    findMonster
}