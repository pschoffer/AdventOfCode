const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);

    const decrypted = input
        .map(decryptRound)
        .map(evaluateRound)
        .map(calculateScore);


    const result = decrypted.reduce((a, b) => a + b, 0);
    console.log(result)
}


const KEY_ENEMY: Record<string, HandSymbol> = {
    A: 'rock',
    B: 'paper',
    C: 'scissors',
}
const KEY_RESULT: Record<string, Result> = {
    X: 'lose',
    Y: 'draw',
    Z: 'win',
}

const calculateScore = (round: Round): number => {
    let score = 1;
    if (round.you === 'paper') {
        score += 1;
    } else if (round.you === 'scissors') {
        score += 2;
    }

    if (round.result === 'win') {
        score += 6;
    } else if (round.result === 'draw') {
        score += 3;
    }

    return score;
}

const evaluateRound = (round: Round): Round => {
    let you: HandSymbol = 'unknown';

    if (round.result === 'draw') {
        you = round.enemy;
    } else if (round.enemy === 'rock') {
        if (round.result === 'lose') {
            you = 'scissors';
        } else {
            you = 'paper';
        }
    } else if (round.enemy === 'paper') {
        if (round.result === 'lose') {
            you = 'rock';
        } else {
            you = 'scissors';
        }
    } else if (round.enemy === 'scissors') {
        if (round.result === 'lose') {
            you = 'paper';
        } else {
            you = 'rock';
        }
    }



    return {
        ...round,
        you
    };
}

const decryptRound = (input: InputRound): Round => {
    return {
        enemy: KEY_ENEMY[input.enemy],
        you: 'unknown',
        result: KEY_RESULT[input.result]
    };
}

type HandSymbol = 'unknown' | 'rock' | 'paper' | 'scissors';
type Result = 'unknown' | 'win' | 'lose' | 'draw'

interface Round {
    enemy: HandSymbol;
    you: HandSymbol;
    result: Result;
}

interface InputRound {
    enemy: string;
    result: string;
}

const parseInput = (inputPath: string) => {
    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines = data.split("\n");

    const result: InputRound[] = [];

    for (const line of lines) {
        const parts = line.split(" ");

        result.push({
            enemy: parts[0],
            result: parts[1],
        });
    }

    return result;
}

run();
