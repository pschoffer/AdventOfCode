const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');
const { sum } = require(__dirname + '/../lib/math')

const run = async () => {
    const input = parsePath(inputPath);

    const seedIntervals = [];
    for (let ix = 0; ix < input.seeds.length; ix = ix + 2) {
        const element = input.seeds[ix];
        seedIntervals.push({
            start: element,
            end: element + input.seeds[ix + 1] - 1
        })

    }

    const locations = seedIntervals.map(seedInterval => mapSeedIntervalToLocation(seedInterval, input.maps))
    const locationsFlattened = locations.flat();

    console.log(Math.min(...locationsFlattened));

}

const mapSeedIntervalToLocation = ({ start, end }, maps) => {

    const locations = [];
    let currentSeed = start;
    let step = end - currentSeed;
    while (currentSeed <= end) {
        step = end - currentSeed + 1;
        let currentValue = currentSeed;
        for (const map of maps) {
            const mappings = map.maps;

            for (const mapping of mappings) {
                if (currentValue < mapping.sourceStart) {
                    const stepCandidate = mapping.sourceStart - currentValue;
                    if (stepCandidate < step) {
                        step = stepCandidate;
                    }
                    break;
                }
                if (currentValue > mapping.sourceEnd) {
                    continue;
                }

                const stepCandidate = (mapping.sourceEnd - currentValue) + 1;
                if (stepCandidate < step) {
                    step = stepCandidate;
                }
                currentValue += mapping.diff;
                break;
            }
        }
        locations.push(currentValue);
        currentSeed += step;
    }

    return locations;

}

const mapSeedToLocation = (seed, maps) => {
    let currentValue = seed;

    for (const map of maps) {
        const mappings = map.maps;

        for (const mapping of mappings) {
            if (currentValue < mapping.sourceStart) {
                break;
            }
            if (currentValue > mapping.sourceEnd) {
                continue;
            }

            currentValue += mapping.diff;
            break;
        }
    }

    return currentValue;

}


const parsePath = (inputPath) => {

    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');

    const lines = data.split('\n');

    const [_, seedsString] = lines[0].split(':');
    const seeds = seedsString.trim().split(/\s+/).map(n => Number(n));

    let currentMap = {};
    const maps = [];
    for (let ix = 2; ix < lines.length; ix++) {
        const line = lines[ix];

        // fertilizer-to-water map:
        const match = line.match(/(\w+)-to-(\w+) map/);
        if (match) {
            const [, from, to] = match;
            currentMap = {
                from,
                to,
                maps: []
            }
            continue;
        }

        if (!line.trim()) {
            maps.push(currentMap);
            continue;
        }

        const [destinationStart, sourceStart, range] = line.trim().split(/\s+/).map(Number);
        const diff = destinationStart - sourceStart;
        currentMap.maps.push({
            sourceStart,
            sourceEnd: sourceStart + range - 1,
            diff,
        });

        currentMap.maps.sort((a, b) => a.sourceStart - b.sourceStart);
    }
    maps.push(currentMap);

    return {
        seeds,
        maps,
    }
}


run();
