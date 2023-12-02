const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');
const { sum } = require(__dirname + '/../lib/math')

const run = async () => {
    const input = parsePath(inputPath);

    const possibleGames = input.map(getGamePower);

    console.log(sum(possibleGames));

}

const COLORS = ['red', 'green', 'blue'];
const MAX_CUBES = {
    'red': 12,
    'green': 13,
    'blue': 14,
}
const isGamePossible = (game) => {
    for (const round of game.rounds) {
        for (const color of COLORS) {
            if ((round.cubes[color] || 0) > MAX_CUBES[color]) {
                return false;
            }
        }
    }
    return true;
}

const getGamePower = (game) => {
    const minCubes = {
        'red': 0,
        'green': 0,
        'blue': 0,
    }
    for (const round of game.rounds) {
        for (const color of COLORS) {
            if (round.cubes[color] && round.cubes[color] > minCubes[color]) {
                minCubes[color] = round.cubes[color];
            }
        }
    }

    return minCubes.red * minCubes.green * minCubes.blue;

}


const parsePath = (inputPath) => {

    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');

    const lines = data.split('\n');

    const games = [];
    for (const line of lines) {
        // Game 1: 10 red, 7 green, 3 blue; 5 blue, 3 red, 10 green; 4 blue, 14 green, 7 red; 1 red, 11 green; 6 blue, 17 green, 15 red; 18 green, 7 red, 5 blue
        const [gameIdString, rest] = line.split(':');

        const gameId = Number(gameIdString.replace('Game ', ''));

        const roundStrings = rest.trim().split(';');

        const rounds = [];
        for (const round of roundStrings) {
            const items = round.trim().split(', ');

            const cubes = {};

            for (const item of items) {
                const [countString, color] = item.split(' ');

                const count = Number(countString);
                cubes[color] = count;
            }


            rounds.push({
                cubes
            })

        }

        games.push({
            gameId,
            rounds
        })

    }

    return games;
}


run();
