const isInBounds = (test: number[], edge: number[], start?: number[]): boolean => {
    let startEdge = start || edge.map((e) => 0);

    for (let i = 0; i < test.length; i++) {
        if (test[i] < startEdge[i] || test[i] > edge[i]) {
            return false;
        }
    }

    return true;
}


interface Distance {
    direction: Direction;
    length: number;
}

type Direction = 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW';

const getDistance2D = (from: number[], to: number[]): Distance => {


    if (from[0] === to[0] && from[1] === to[1]) {
        return {
            direction: 'N',
            length: 0
        }
    }
    const distance = {
        direction: '',
        length: 0
    }

    if (from[0] > to[0]) {
        distance.direction += 'N';
    } else if (from[0] < to[0]) {
        distance.direction += 'S';
    }

    if (from[1] > to[1]) {
        distance.direction += 'W';
    } else if (from[1] < to[1]) {
        distance.direction += 'E';
    }

    distance.length = Math.max(Math.abs(from[0] - to[0]), Math.abs(from[1] - to[1]));
    return distance as Distance;
}

const adjust2D = (distance: Distance, start: number[]): number[] => {
    let result = [...start];
    const directions = distance.direction.split('');

    for (const direction of directions) {
        switch (direction) {
            case 'N':
                result[0] -= distance.length;
                break;
            case 'S':
                result[0] += distance.length;
                break;
            case 'E':
                result[1] += distance.length;
                break;
            case 'W':
                result[1] -= distance.length;
                break;
        }
    }

    return result;
}


export {
    isInBounds,
    adjust2D,
    getDistance2D,
}