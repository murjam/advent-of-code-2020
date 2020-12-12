const { readFileToString } = require('../lib/lib.js');

let shipX = 0, shipY = 0, wayPointX = 10, wayPointY = -1, direction = 'E';
const directions = 'NESWNESW';

function move(dir, amount) {
    switch (dir) {
        case 'E':
            shipX += amount;
            break;
        case 'W':
            shipX -= amount;
            break;
        case 'S':
            shipY += amount;
            break;
        case 'N':
            shipY -= amount;
            break;
    }
}

function moveWayPoint(dir, amount) {
    switch (dir) {
        case 'E':
            wayPointX += amount;
            break;
        case 'W':
            wayPointX -= amount;
            break;
        case 'S':
            wayPointY += amount;
            break;
        case 'N':
            wayPointY -= amount;
            break;
    }
}

function step(line) {
    const matches = line.match(/^([WENSFLR])([0-9]+)$/);
    const [_, command, am] = matches;
    const amount = parseInt(am);

    switch (command) {
        case 'E':
        case 'W':
        case 'N':
        case 'S':
            moveWayPoint(command, amount);
            break;
        case 'F':
            shipX += wayPointX * amount;
            shipY += wayPointY * amount;
            break;
        case 'L': {
            const steps = ((amount % 360) / 90) ;
            for (let i = 0; i < steps; i++) {
                const memo = wayPointX;
                wayPointX = wayPointY;
                wayPointY = -memo;
            }

            // const start = directions.lastIndexOf(direction);
            // direction = directions.charAt(start - steps);
            break;
        }
        case 'R': {
            const steps = ((amount % 360) / 90) ;
            for (let i = 0; i < steps; i++) {
                const memo = wayPointX;
                wayPointX = -wayPointY;
                wayPointY = memo;
            }
            break;
        }
    }
}

function sail(lines) {
    for (const line of lines) {
        step(line);
    }
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        sail(input.split('\n'));

        console.log(shipX, shipY, Math.abs(shipX) + Math.abs(shipY));
    })();
}

module.exports = {};
