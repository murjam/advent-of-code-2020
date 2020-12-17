const { readFileToString } = require('../lib/lib.js');

function newLine(size) {
    return new Array(size).fill('.');
}

function newSlice(size) {
    return new Array(size).fill(newLine(size));
}

function newCube(size) {
    return new Array(size).fill(newSlice(size));
}

function growHyper(hyper) {
    const newHyper = [];
    const initialSize = hyper.length;
    const newSize = initialSize + 2;

    newHyper.push(newCube(newSize));

    for (let w = 0; w < initialSize; w++) {
        const oldCube = hyper[w];
        const newCube = [];
        newCube.push(newSlice(newSize));

        for (let i = 0; i < initialSize; i++) {
            const oldSlice = oldCube[i];
            const newSlice = [newLine(newSize)];
            for (let j = 0; j < initialSize; j++) {
                const oldLine = oldSlice[j];
                const newLine = ['.', ...oldLine, '.'];
                newSlice.push(newLine);
            }
            newSlice.push(newLine(newSize));
            newCube.push(newSlice);
        }
        newCube.push(newSlice(newSize));
        newHyper.push(newCube);
    }
    newHyper.push(newCube(newSize));

    return newHyper;
}

function getNeighbours({ x, y, z, w }, hyper) {
    const neighbours = [];
    for (let wDiff = -1; wDiff <= 1; wDiff++) {
        const wCube = hyper[w + wDiff];
        if (!wCube) {
            continue;
        }
        for (let zDiff = -1; zDiff <= 1; zDiff++) {
            const slice = wCube[z + zDiff];
            if (!slice) {
                continue;
            }

            for (let yDiff = -1; yDiff <= 1; yDiff++) {
                const row = slice[y + yDiff];
                if (!row) {
                    continue;
                }
                for (let xDiff = -1; xDiff <= 1; xDiff++) {
                    if (xDiff === 0 && zDiff === 0 && yDiff === 0 && wDiff === 0) {
                        continue;
                    }
                    const neighbour = row[x + xDiff];
                    if (neighbour) {
                        neighbours.push(neighbour);
                    }
                }
            }
        }
    }

    return neighbours;
}

function changeHyper(hyper) {
    const newHyper = [];

    for (let w = 0; w < hyper.length; w++) {
        const newCube = [];
        for (let z = 0; z < hyper[w].length; z++) {
            const newSlice = [];
            for (let y = 0; y < hyper[w][z].length; y++) {
                const newRow = [];
                for (let x = 0; x < hyper[w][z][y].length; x++) {
                    const value = hyper[w][z][y][x];
                    const neighbours = getNeighbours({w, x, y, z}, hyper);
                    const activeNeighbours = neighbours.filter(n => n === '#');
                    let newValue = '.';

                    if (value === '#' && [2, 3].includes(activeNeighbours.length)) {
                        newValue = '#';
                    } else if (value === '.' && 3 === activeNeighbours.length) {
                        newValue = '#';
                    }

                    newRow.push(newValue);
                }
                newSlice.push(newRow);
            }
            newCube.push(newSlice);
        }
        newHyper.push(newCube);
    }

    return newHyper;
}

function getIndices(cube) {
    const edge = Math.floor(cube.length / 2);
    const indices = [0];
    for (let i = 0; i < edge; i++) {
        indices.unshift(-i - 1);
        indices.push(+i + 1);
    }
    return indices;
}

function printCube(cube) {
    const indices = getIndices(cube);

    for (let i = 0; i < cube.length; i++) {
        const z = indices[i];
        const slice = cube[i];
        console.log(
            `z=${z}\n${slice.map(line => line.join('')).join('\n')}`
        );
    }
}

function evolve(hyper) {
    for (let i = 0; i < 6; i++) {
        hyper = growHyper(hyper);
        hyper = changeHyper(hyper);
    }

    return hyper;
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const slice = input.split('\n').map(line => line.split(''));
        const fillCube = () => {
            const result = [
                newSlice(slice.length),
                slice,
            ];
            while (result.length < slice.length) {
                result.push(newSlice(slice.length));
            }

            return result;
        }
        const cube = fillCube();
        const fillHyper = () => {
            const result = [
                newCube(slice.length),
                cube,
            ];
            while (result.length < slice.length) {
                result.push(newCube(slice.length));
            }

            return result;
        }
        const hyper = fillHyper();

        const result = evolve(hyper);


        // printCube(result);

        let count = 0;
        result.forEach(cube => cube.forEach( slice => slice.forEach(row => row.forEach(c => {
            if (c === '#') {
                count++;
            }
        }))))

        console.log(count);
    })();
}

module.exports = {};
