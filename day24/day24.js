const { readFileToString } = require('../lib/lib.js');

function diffForStep(step) {
    let diffX = 0, diffY = 0;

    switch (step) {
        case 'e':
            diffX += 2;
            break;
        case 'w':
            diffX -= 2;
            break;
        case 'sw':
            diffY += 1;
            diffX -= 1;
            break;
        case 'nw':
            diffY -= 1;
            diffX -= 1;
            break;
        case 'se':
            diffY += 1;
            diffX += 1;
            break;
        case 'ne':
            diffY -= 1;
            diffX += 1;
            break;

        default:
            throw new Error(`Unknown direction: ${step}`);
    }
    return { diffY, diffX };
}

function getTileReference(line) {
    let x = 0, y = 0;

    while (line.length > 0) {
        const [, step] = line.match(/^(e|w|se|sw|nw|ne)/);
        const { diffX, diffY } = diffForStep(step);

        x += diffX;
        y += diffY;

        line = line.substring(step.length);
    }

    return { x, y }
}

const getTileId = (x, y) => [x, y].join(',');

function getAdjacentTiles([x, y]) {
    const ids = [];

    for (const step of ['e', 'w', 'sw', 'nw', 'se', 'ne']) {
        const { diffX, diffY } = diffForStep(step);
        ids.push(getTileId(x + diffX, y + diffY));
    }

    return ids;
}

function findNewBlacks(tileId, flippedBlack, alreadyChecked = []) {
    const newBlacks = [];
    if (alreadyChecked.includes(tileId)) {
        return newBlacks;
    }

    const [x, y] = tileId.split(',').map(n => parseInt(n, 10));
    const adjacent = getAdjacentTiles([x, y]);
    const blackAdjacent = adjacent.filter(id => flippedBlack.includes(id));
    const blackAdjacentCount = blackAdjacent.length;
    const isBlack = flippedBlack.includes(tileId);

    if (isBlack) {
        if (!(0 === blackAdjacentCount || blackAdjacentCount > 2)) {
            newBlacks.push(tileId);
        }
    } else { // white now
        if (blackAdjacentCount === 2) {
            newBlacks.push(tileId);
        }
    }
    if (isBlack || blackAdjacentCount > 0) {
        alreadyChecked.push(tileId);

        for (const a of adjacent) {
            newBlacks.push(...findNewBlacks(a, flippedBlack, alreadyChecked));
        }
    }

    return newBlacks;
}

function moveOnTiles(instructions) {
    let flippedBlack = [];

    for (const instruction of instructions) {
        const { x, y } = getTileReference(instruction);

        const coordinates = getTileId(x, y);
        if (flippedBlack.includes(coordinates)) {
            flippedBlack = flippedBlack.filter(id => id !== coordinates);
        } else {
            flippedBlack.push(coordinates);
        }
    }

    return flippedBlack;
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        let flippedBlack = moveOnTiles(input.split('\n'));

        for (let day = 0; day <= 100; day++) {
            console.log(`Day ${day}: ${flippedBlack.length}`);
            const newBlacks = [];
            const alreadyChecked = [];

            for (const flipped of flippedBlack) {
                newBlacks.push(...findNewBlacks(flipped, flippedBlack, alreadyChecked));
            }

            flippedBlack = newBlacks;
        }
    })();
}

module.exports = {};
