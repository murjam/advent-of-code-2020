const { readFileToString } = require('../lib/lib.js');

function passPortId(pass) {
    let top = 127;
    let bottom = 0;
    let step = 64;
    let colHigh = 7;
    let colLow = 0;
    let colStep = 4;

    for (let i = 0; i < pass.length; i++) {
        const letter = pass.charAt(i);
        if (letter === 'B') {
            bottom += step;
        } else if (letter === 'F') {
            top -= step;
        } else {
            if (letter === 'R') {
                colLow += colStep;
            } else if (letter === 'L') {
                colHigh -= colStep;
            } else {
                console.log(`Unknown character ${letter}`);
            }
            colStep = Math.floor(colStep / 2);
        }

        step = Math.floor(step / 2);
    }
    console.log(colHigh , top, colStep);

    return top * 8 + colHigh;
}

function highestId(passPorts) {
    let highest = 0;
    for (const pass of passPorts) {
        const passId = passPortId(pass);
        if (highest < passId) {
            highest = passId;
        }
    }
    return highest;
}

function findMineBetween(lines) {
    const all = lines.map(l => passPortId(l)).sort();
    let last = 0;

    for (let i = 0; i < all.length; i++) {
        const val = all[i];
        if (val - last === 2) {
            return [last, val];
        }
        last = val;
    }

    return 'noo';
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const highest = highestId(input.split('\n'));
        const mineBetween = findMineBetween(input.split('\n'));

        console.log({ highest, mineBetween });
    })();
}

module.exports = {};
