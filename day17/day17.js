const { readFileToString } = require('../lib/lib.js');



function moveSlice(z, cube) {
    let slice = cube[z];
    if (typeof slice === 'undefined') {
        slice = [];
        const anotherSlice = Object.values(cube)[0];
        for (let i = 0; i < anotherSlice.length; i++) {
            slice.push(new Array(anotherSlice[i].length + 2).join('.'));
        }
    }

    for (let y = 0; y < cube.length; y++) {

    }
}

function newLine(size) {
    return new Array(size).fill('.');
}

function newSlice(size) {
    return new Array(size).fill(newLine(size));
}

function growCube(cube) {
    const newCube = [];
    const initialSize = cube.length;
    const newSize = initialSize + 2;

    newCube.push(newSlice(newSize));

    for (let i = 0; i < initialSize; i++) {
        const oldSlice = cube[i];
        const newSlice = [newLine(newSize)];
        for (let j = 0; j < initialSize; j++) {
            const oldLine = oldSlice[j];
            const newLine = ['.', ...oldLine , '.'];
            newSlice.push(newLine);
        }
        newSlice.push(newLine(newSize));
        newCube.push(newSlice);
    }

    newCube.push(newSlice(newSize));

    return newCube;
}

function getNeighbours({ x, y, z }, cube) {
    const neighbours = [];

    for (let zDiff = -1; zDiff <= 1; zDiff++) {
        const slice = cube[z + zDiff];
        if (!slice) {
            continue;
        }

        for (let yDiff = -1; yDiff <= 1; yDiff++) {
            const row = slice[y + yDiff];
            if (!row) {
                continue;
            }
            for (let xDiff = -1; xDiff <= 1; xDiff++) {
                if (xDiff === 0 && zDiff === 0 && yDiff === 0) {
                    continue;
                }
                const neighbour = row[x + xDiff];
                if (neighbour) {
                    neighbours.push(neighbour);
                }
            }
        }
    }

    return neighbours;
}

function changeCube(cube) {
    const newCube = [];

    for (let z = 0; z < cube.length; z++) {
        const newSlice = [];
        for (let y = 0; y < cube[z].length; y++) {
            const newRow = [];
            for (let x = 0; x < cube[z][y].length; x++) {
                const value = cube[z][y][x];
                const neighbours = getNeighbours({ x, y, z }, cube);
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

    return newCube;
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

function evolve(cube) {
    for (let i = 0; i < 6; i++) {
        cube = growCube(cube);
        cube = changeCube(cube);
    }

    return cube;
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
        const result = evolve(cube);


        // printCube(result);

        let count = 0;
        result.forEach(slice => slice.forEach(row => row.forEach(c => {
            if (c === '#') {
                count++;
            }
        })))

        console.log(count);
    })();
}

module.exports = {};
