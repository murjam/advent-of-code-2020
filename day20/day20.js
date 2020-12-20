const { readFileToString } = require('../lib/lib.js');

const tiles = {};

function flip(matrix) {
    const newMatrix = [];
    for (let i = 0; i < matrix.length; i++) {
        newMatrix.push(matrix[i].slice().reverse());
    }

    return newMatrix;
}

function rotate(matrix) {
    const last = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[last - j][i])
    );
    matrix.length = 0;
    matrix.push(...result);
    return matrix;
}

function print(matrix) {
    matrix.forEach(line => console.log(line.join('')));
    console.log('\n');
}

function readTile(part) {
    const [head, ...lines] = part.split('\n');
    const [, tileId] = head.match(/Tile ([0-9]+):/);

    tiles[tileId] = lines.map(line => line.split(''));
}

function getFirstRow(tile) {
    return tile[0].join('');
}

function getLastRow(tile) {
    return tile[tile.length - 1].join('');
}

function getFirstColumn(tile) {
    return tile.map(line => line[0]).join('');
}

function getLastColumn(tile) {
    return tile.map(line => line[line.length - 1]).join('');
}

function findLastRowMatchesFirstRow(matrix, ignoreTileIds = []) {
    const tileFirstRow = getLastRow(matrix);
    for (const tileId in tiles) {
        if (ignoreTileIds.includes(tileId)) {
            continue;
        }
        let currentTile = tiles[tileId];
        let rotations = 0;
        do {
            if (tileFirstRow === getFirstRow(currentTile)) {
                return { tileId, turns: rotations, flipped: false };
            } else if (tileFirstRow === getFirstRow(flip(currentTile))) {
                return { tileId, turns: rotations, flipped: true };
            }

            currentTile = rotate(currentTile);

            rotations++;
        } while (rotations < 4);
    }

    return {};
}

function findCorners(size) {
    const matrix = new Array(size).fill(1).map(() => new Array(size).fill(null));
    const corners = [];
    for (const tileId in tiles) {
        const usedTileIds = []; //corners.slice();

        usedTileIds.push(tileId);
        let tile = tiles[tileId];
        let resultBottom = findLastRowMatchesFirstRow(tile, usedTileIds);

        if (resultBottom.tileId) {
            usedTileIds.push(resultBottom.tileId);
        }
        tile = rotate(tile);
        let resultLeft = findLastRowMatchesFirstRow(tile, usedTileIds);

        if (resultLeft.tileId) {
            usedTileIds.push(resultLeft.tileId);
        }
        tile = rotate(tile);

        let resultTop = findLastRowMatchesFirstRow(tile, usedTileIds);

        if (resultTop.tileId) {
            usedTileIds.push(resultTop.tileId);
        }
        tile = rotate(tile);
        let resultRight = findLastRowMatchesFirstRow(tile, usedTileIds);

        const foundMatchesCount = [resultTop, resultRight, resultBottom, resultLeft].filter(res => res.tileId).length;
        if (foundMatchesCount === 2) {

            if (resultTop.tileId && resultBottom.tileId || resultLeft.tileId && resultRight.tileId) {
                continue;
            }

            // console.log(tileId, {resultTop, resultRight, resultBottom, resultLeft});

            corners.push(tileId);

            if (!resultTop.tileId && !resultLeft.tileId && resultBottom.tileId && resultRight.tileId) {
                matrix[0][0] = tileId;
            }
            if (resultTop.tileId && !resultLeft.tileId && !resultBottom.tileId && resultRight.tileId) {
                matrix[size - 1][0] = tileId;
            }
            if (!resultTop.tileId && resultLeft.tileId && resultBottom.tileId && !resultRight.tileId) {
                matrix[size][size - 1] = tileId;
            }
            if (resultTop.tileId && resultLeft.tileId && !resultBottom.tileId && !resultRight.tileId) {
                matrix[0][size - 1] = tileId;
            }
        }
    }

    return { corners, matrix };
}

function findNext(tile, ignored) {
    let resultBottom = findLastRowMatchesFirstRow(tile, ignored);

    if (resultBottom.tileId) {
        return resultBottom;
    }
    tile = rotate(tile);
    let resultLeft = findLastRowMatchesFirstRow(tile, ignored);

    if (resultLeft.tileId) {
        return resultLeft;
    }
    tile = rotate(tile);

    let resultTop = findLastRowMatchesFirstRow(tile, ignored);

    if (resultTop.tileId) {
        return resultTop;
    }
    tile = rotate(tile);
    let resultRight = findLastRowMatchesFirstRow(tile, ignored);

    return resultRight;
}

function combineMatrix(matrix, size) {
    const flatIds = [];

    let lastTile = tiles[matrix[0][0]];
    for (let row = 0; row < size; row++) {
        for (let column = 0; column < size; column++) {
            if (matrix[row][column]) {
                flatIds.push(matrix[row][column]);
                lastTile = tiles[matrix[row][column]];
                continue;
            }
            const found = findNext(lastTile, flatIds);

            if (found.tileId) {
                matrix[row][column] = found.tileId;
                lastTile = tiles[found.tileId];
                flatIds.push(found.tileId);
            }
        }
        // if (row === 0) { // fill first column
        //     for (let r = 1; r < size; r++) {
        //         if (matrix[r][0]) {
        //             flatIds.push(matrix[r][0]);
        //             lastTile = tiles[matrix[r][0]];
        //             continue;
        //         }
        //         const found = findNext(lastTile, flatIds);
        //
        //         if (found.tileId) {
        //             matrix[r][0] = found.tileId;
        //             lastTile = tiles[found.tileId];
        //             flatIds.push(found.tileId);
        //         }
        //     }
        //     lastTile = tiles[matrix[1][0]];
        // }
    }

    const tileSize = lastTile.length;

    let combinedMatrix = new Array(size * tileSize).fill(1).map(() => new Array(size * tileSize).fill(null));
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            let tile = combinedMatrix[row][col] || tiles[matrix[row][col]];

            allFlip:
            for (let i = 0; i < 4; i++) {
                tile = rotate(tile);
                for (let k = 0; k < 2; k++) {
                    tile = flip(tile);
                    if (col !== size - 1) {
                        let nextRight = combinedMatrix[row][col + 1] || tiles[matrix[row][col + 1]];
                        rightFlip:
                        for (let j = 0; j < 4; j++) {
                            nextRight = rotate(nextRight);
                            for (let l = 0; l < 2; l++) {
                                nextRight = flip(nextRight);
                                if (getLastColumn(tile) === getFirstColumn(nextRight)) {
                                    combinedMatrix[row][col] = tile;
                                    combinedMatrix[row][col + 1] = nextRight;
                                    break rightFlip;
                                }
                            }
                        }
                    }
                    if (row !== size - 1) {
                        let nextDown = combinedMatrix[row + 1][col] || tiles[matrix[row + 1][col]];
                        for (let j = 0; j < 4; j++) {
                            nextDown = rotate(nextDown);
                            for (let l = 0; l < 2; l++) {
                                nextDown = flip(nextDown);
                                if (getLastRow(tile) === getFirstRow(nextDown)) {
                                    combinedMatrix[row][col] = tile;
                                    combinedMatrix[row + 1][col] = nextDown;
                                    break allFlip;
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    return { matrix, combinedMatrix };
}

function doIt(input) {
    for (const inputElement of input) {
        readTile(inputElement);
    }
    const size = Math.sqrt(Object.keys(tiles).length);
    const { corners, matrix } = findCorners(size);

    const flippedMatrix = rotate(rotate(flip(matrix)));
    const { matrix: res, combinedMatrix } = combineMatrix(flippedMatrix, size);

    console.log(res);
    // print(combinedMatrix[0][0]);
    // print(combinedMatrix[1][0]);

    return { corners };
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const result = doIt(input.split('\n\n'));

        console.log(result, result.corners.reduce((acc, elem) => acc * parseInt(elem, 10), 1));

        // const test = Object.values(tiles)[0];
        // print(test);
        // print(flip(test));
    })();
}

module.exports = {};
