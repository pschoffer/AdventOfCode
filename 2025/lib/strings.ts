export const allIndexesOf = (source: string, pattern: string) => {
    let indexes: number[] = [];

    let lastIndex = 0;
    while (true) {
        const newIndex = source.indexOf(pattern, lastIndex + 1);
        if (newIndex === undefined || newIndex === -1) {
            break;
        }

        lastIndex = newIndex;
        indexes.push(newIndex);
    }

    return indexes;
}