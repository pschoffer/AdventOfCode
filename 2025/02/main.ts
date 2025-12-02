const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputPath);

    let result = 0;

    for (const interval of input) {
        let current = interval.low;

        while (current <= interval.high) {
            const halfs = getHalfs(current);
            console.log('Testing', current);
            if (!halfs) {
                const digitCount = (current + '').length;

                current = Math.pow(10, digitCount);
                continue;
            }

            if (halfs[0] === halfs[1]) {
                result += current;
                console.log('Increasing', result);
            }

            const half0Num = Number(halfs[0]);
            const half1Num = Number(halfs[1]);


            const newTry = half0Num <= half1Num ? ((Number(halfs[0] || '') + 1) + '') : half0Num + '';

            current = Number(newTry + newTry)
        }
    }


    console.log('result', result)
}

const getHalfs = (id: number) => {
    const stringId = id + '';
    const lenght = stringId.length;

    if (lenght % 2) {
        return null;
    }

    const firstHalv = stringId.substring(0, lenght / 2)
    const secondHalv = stringId.substring(lenght / 2);

    return [firstHalv, secondHalv]
}

const parseInput = (inputPath: string) => {
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines: string[] = data.split(",");

    const result = [];

    for (const line of lines) {
        const [firstPart, secondPart] = line.split('-');
        result.push({ low: Number(firstPart), high: Number(secondPart) });
    }

    return result;
}

run();
