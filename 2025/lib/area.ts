export const parseArea = (input: string) => {
    const lines: string[] = input.split("\n");

    const result: string[][] = [];

    for (let y = 0; y < lines.length; y++) {
        const row: string[] = lines[y]?.split('') || [];
        result.push(row);
    }

    return result;
}



export const explode = (coordinates: number[], minCoordinate: number[], maxCoordinate: number[], removeOriginal: boolean = true) => {
    const originalCoordinatesString = JSON.stringify(coordinates);
    if (!coordinates.length) {
        return []
    }

    const value = coordinates.shift() || 0;
    const min = minCoordinate.shift() || 0;
    const max = maxCoordinate.shift() || 0;

    let valueOptions: number[][] = [[value]]
    if (value > min) {
        valueOptions.push([value - 1])
    }
    if (value < max) {
        valueOptions.push([value + 1])
    }

    if (!coordinates.length) {
        return valueOptions;
    }

    const subOptions = explode(coordinates, minCoordinate, maxCoordinate, false)
    let finalOptions: number[][] = [];

    for (let thisOption of valueOptions) {
        for (let subOption of subOptions) {
            const newOption = thisOption.concat(subOption)
            finalOptions.push(newOption);
        }
    }

    if (removeOriginal) {
        finalOptions = finalOptions.filter(option => JSON.stringify(option) !== originalCoordinatesString);
    }

    return finalOptions;
}


export const calculateDistanceEu = (a: number[], b: number[]) => {
    let distance = 0;

    for (let ix = 0; ix < a.length; ix++) {
        distance += Math.pow(a[ix]! - b[ix]!, 2)
    }

    distance = Math.sqrt(distance)

    return distance;
}

export const calculateDistance = (a: number[], b: number[]) => {
    let distance = 0;

    for (let ix = 0; ix < a.length; ix++) {
        distance += Math.abs(a[ix]! - b[ix]!)
    }

    return distance;
}

export const calculatePerAxisDistance = (a: number[], b: number[]) => {
    const result: number[] = [];

    for (let ix = 0; ix < a.length; ix++) {
        result.push(Math.abs(a[ix]! - b[ix]!))
    }

    return result;
}
