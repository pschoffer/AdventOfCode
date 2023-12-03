const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');
const { sum } = require(__dirname + '/../lib/math')

const run = async () => {
    const input = parsePath(inputPath);


    const numbersCloseToSymbol = Object.keys(input.numbers).filter((numberId) => isCloseToSymbol(input, numberId));

    const values = numbersCloseToSymbol.map((numberId) => input.numbers[numberId].value);
    console.log(sum(values));

}

const isCloseToSymbol = (input, numberId) => {
    const { start, end } = input.numbers[numberId];
    const { area } = input;

    const neigbourCells = getNeighbourCells(area, start, end);

    for (const cell of neigbourCells) {
        if (area[cell.y][cell.x] && area[cell.y][cell.x].type === 'symbol') {
            return true;
        }
    }
    return false;
}

const getNeighbourCells = (area, start, end) => {
    let current = {
        x: start.x - 1,
        y: start.y - 1,
    };
    const cells = [];
    while (current.y <= end.y + 1) {
        if (current.y < 0) {
            current.y++;
            continue;
        }
        if (current.y > area.length - 1 || current.y > end.y + 1) {
            break;
        }
        while (current.x <= end.x + 1) {
            if (current.x < 0) {
                current.x++;
                continue;
            }
            if (current.x > area[current.y].length - 1 || current.x > end.x + 1) {
                break;
            }
            cells.push({ ...current });
            current.x++;
        }
        current.x = start.x - 1;
        current.y++;
    }

    return cells;
}

const parsePath = (inputPath) => {

    const fs = require('fs');
    const data = fs.readFileSync(inputPath, 'utf8');

    const lines = data.split('\n');

    const area = [];
    const numbers = {};
    let currentNumberId = 0;
    let lastNumberId = 0;
    for (let y = 0; y < lines.length; y++) {
        const line = lines[y];

        const items = line.split('');
        area[y] = [];

        for (let x = 0; x < items.length; x++) {
            const item = items[x];
            if (Number.isInteger(parseInt(item))) {
                if (!currentNumberId) {
                    lastNumberId++;
                    currentNumberId = lastNumberId;
                }
                if (!numbers[currentNumberId]) {
                    numbers[currentNumberId] = {
                        id: currentNumberId,
                        numberString: '',
                        start: { x, y },
                    };
                }

                numbers[currentNumberId].numberString += item;
                numbers[currentNumberId].end = { x, y };
                area[y].push({
                    type: 'number',
                    numberId: currentNumberId,
                })
            } else if (item === '.') {
                if (currentNumberId) {
                    currentNumberId = 0;
                }
                area[y].push(null)
            } else {
                if (currentNumberId) {
                    currentNumberId = 0;
                }
                area[y].push({
                    type: 'symbol',
                    symbol: item,
                })
            }
        }
        if (currentNumberId) {
            currentNumberId = 0;
        }

    }

    for (const numberId of Object.keys(numbers)) {
        numbers[numberId].value = parseInt(numbers[numberId].numberString);
    }

    return {
        area,
        numbers
    };
}


run();
