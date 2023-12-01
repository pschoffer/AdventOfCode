const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);


function group<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

export {
    sum,
    group
}