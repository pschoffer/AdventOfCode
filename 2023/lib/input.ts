function splitArrayBy<T>(array: T[], test: (a: T) => boolean): T[][] {
    const result: T[][] = [];
    let current: T[] = [];
    for (const item of array) {
        if (test(item)) {
            result.push(current);
            current = [];
        } else {
            current.push(item);
        }
    }
    if (current.length > 0) {
        result.push(current);
    }
    return result;
}

export {
    splitArrayBy
}