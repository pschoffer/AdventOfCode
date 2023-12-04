const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');
const { sum } = require(__dirname + '/../lib/math')

const run = async () => {
    const input = parsePath(inputPath);

    const counts = {};
    for (const card of input) {
        if (!counts[card.cardId]) {
            counts[card.cardId] = 1;
        }
        const cardCount = counts[card.cardId];
        const winningCount = getWinningCount(card);

        let currentCardAdjustment = 0;
        while (winningCount > currentCardAdjustment) {
            currentCardAdjustment++;
            const newCardId = card.cardId + currentCardAdjustment;
            counts[newCardId] = cardCount + (counts[newCardId] || 1);
        }
    }

    const cardCounts = input.map(card => counts[card.cardId]);

    console.log(sum(cardCounts));

}

const getWinningCount = (card) => {
    const numbersSet = new Set(card.cardNumbers);
    const winningNumbers = [...numbersSet].filter(number => card.winningNumbers.includes(number));

    return winningNumbers.length;
}

const parsePath = (inputPath) => {

    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');

    const lines = data.split('\n');

    const cards = [];
    for (let y = 0; y < lines.length; y++) {
        const line = lines[y];

        const [cardIdString, rest] = line.split(':');
        const cardId = Number(cardIdString.trim().split(/\s+/)[1]);

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
