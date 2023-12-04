const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');
const { sum } = require(__dirname + '/../lib/math')

const run = async () => {
    const input = parsePath(inputPath);

    const points = input.map(card => getPoints(card));

    console.log(sum(points));

}

const getPoints = (card) => {
    const winningNumbers = card.cardNumbers.filter(number => card.winningNumbers.includes(number));

    return winningNumbers.length ? Math.pow(2, winningNumbers.length - 1) : 0;
}

const parsePath = (inputPath) => {

    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');

    const lines = data.split('\n');

    const cards = [];
    for (let y = 0; y < lines.length; y++) {
        const line = lines[y];

        const [cardIdString, rest] = line.split(':');
        const cardId = Number(cardIdString.trim().split(' ')[1]);

        const [left, right] = rest.split('|');

        const winningNumbers = left.trim().split(/\s+/).map(n => Number(n));
        const cardNumbers = right.trim().split(/\s+/).map(n => Number(n));
        cards.push({
            cardId,
            winningNumbers,
            cardNumbers
        });
    }
    return cards
}


run();
