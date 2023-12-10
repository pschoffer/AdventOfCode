const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');
const { sum, mul } = require(__dirname + '/../lib/math')

const run = async () => {
    const input = parsePath(inputPath);

    input.sort(compareHands)
    for (const hand of input) {
        console.log(`${hand.cards.join('')} ${hand.type} ${hand.bid}`)

    }

    const winnings = input.map((hand, ix) => (ix + 1) * hand.bid);

    console.log(sum(winnings));

}

const compareHands = (hand1, hand2) => {
    const type1 = handTypes.indexOf(hand1.type);
    const type2 = handTypes.indexOf(hand2.type);

    if (type1 !== type2) {
        return type1 - type2;
    }

    for (let ix = 0; ix < hand1.cards.length; ix++) {
        const card1 = hand1.cards[ix];
        const card2 = hand2.cards[ix];

        const card1Ix = CARDS.indexOf(card1);
        const card2Ix = CARDS.indexOf(card2);

        if (card1Ix !== card2Ix) {
            return card1Ix - card2Ix;
        }
    }

    return 0;
}

const CARDS = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'];
const handTypes = ['one', 'pair', 'twoPairs', 'three', 'fullHouse', 'four', 'five'];

const getType = (counts, jokerCount) => {
    const values = Object.values(counts);

    values.sort();
    const highestCount = values[values.length - 1];
    const secondHighestCount = values[values.length - 2];

    if (highestCount + jokerCount === 5 || jokerCount === 5) {
        return 'five';
    }
    if (highestCount + jokerCount === 4) {
        return 'four';
    }
    if (highestCount + jokerCount === 3) {
        if (secondHighestCount === 2) {
            return 'fullHouse';
        }
        return 'three';
    }

    const pairCount = values.filter(value => value === 2).length;
    if (pairCount === 2) {
        return 'twoPairs';
    }
    if (highestCount + jokerCount === 2) {
        return 'pair';
    }
    return 'one';
}

const parsePath = (inputPath) => {

    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');

    const lines = data.split('\n');
    const hands = [];

    for (const line of lines) {
        const [cardString, bidString] = line.split(' ');
        const cards = cardString.split('');
        const counts = {};
        let jokerCount = 0;
        for (const card of cards) {
            if (card === 'J') {
                jokerCount++;
                continue;
            }
            counts[card] = (counts[card] || 0) + 1;
        }

        hands.push({
            cards: cards,
            counts,
            jokerCount,
            type: getType(counts, jokerCount),
            bid: Number(bidString)
        });
    }

    return hands
}


run();
