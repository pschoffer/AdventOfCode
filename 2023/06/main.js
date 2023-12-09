const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');
const { sum, mul } = require(__dirname + '/../lib/math')

const run = async () => {
    const input = parsePath(inputPath);

    const waysToBeat = input.map(countWaysToWin);

    console.log(mul(waysToBeat));

}

const countWaysToWin = (race) => {
    const { time, distanceToBeat } = race;

    let wayToBeat = 0;
    for (let charge = 1; charge < time; charge++) {
        const distance = (time - charge) * charge;
        if (distance > distanceToBeat) {
            wayToBeat++;
        }
    }
    return wayToBeat;
}

const parsePath = (inputPath) => {

    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');

    const lines = data.split('\n');

    const timeSting = lines[0].split(':')[1].trim();
    const distanceString = lines[1].split(':')[1].trim();


    const times = timeSting.split(/\s+/g).map(Number)
    const distances = distanceString.split(/\s+/g).map(Number)


    const races = [];
    for (let ix = 0; ix < times.length; ix++) {
        races.push({
            time: times[ix],
            distanceToBeat: distances[ix]
        })
    }


    return races
}


run();
