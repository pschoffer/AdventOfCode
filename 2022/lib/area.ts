const isInBounds = (test: number[], edge: number[], start?: number[]): boolean => {
    let startEdge = start || edge.map((e) => 0);

    for (let i = 0; i < test.length; i++) {
        if (test[i] < startEdge[i] || test[i] > edge[i]) {
            return false;
        }
    }

    return true;
}

export = {
    isInBounds
}