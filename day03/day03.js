const { readFileToString } = require('../lib/lib.js');

function traverse(map, xAmount = 3, yAmount = 1) {
    let x = 0;
    let y = 0;

    let countTrees = 0;

    for (let internalX = 0; true;) {
        if (map[y] === undefined) {
            return countTrees;
        }
        const char = map[y][internalX];

        if (char === '#') {
            countTrees++;
        }

        internalX += xAmount;
        if (undefined === map[y][internalX]) {
            internalX = internalX % map[y].length;
        }

        x += xAmount;
        y += yAmount;
    }

    throw new Error(`Should not reach this ${x} ${y}`);
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('day03.txt');
        const map = input.split('\n');

        const results = [];
        results.push(traverse(map, 1, 1));
        results.push(traverse(map, 3, 1));
        results.push(traverse(map, 5, 1));
        results.push(traverse(map, 7, 1));
        results.push(traverse(map, 1, 2));

        console.log(results, results.reduce((acc, x) => acc * x, 1));
    })();
}

module.exports = {};
