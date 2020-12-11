const { readFileToString } = require('../lib/lib.js');

function getAdjacent(x, y, map) {
    const adjacent = [];
    const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
    ];

    for (const direction of directions) {
        const [stepX, stepY] = direction;

        if (!map[y + stepY] || !map[y + stepY][x + stepX]) {
            continue;
        }

        const place = map[y + stepY][x + stepX];
        adjacent.push(place);
    }

    return adjacent;
}
function getAdjacentVisible(locationX, locationY, map) {
    const adjacent = [];
    const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
    ];

    for (const direction of directions) {
        const [speedY, speedX] = direction;

        for (let y = locationY + speedY, x = locationX + speedX; y >= 0 && y < map.length && x >= 0 && x < map[y].length; y += speedY, x += speedX) {
            if (!map[y] || !map[y][x]) {
                break;
            }

            const place = map[y][x];

            if (place === 'L') {
                adjacent.push('L');
                break;
            }
            if (place === '#') {
                adjacent.push('#');
                break;
            }
        }
    }

    return adjacent;
}


function doRound(map) {
    const result = [];
    for (let y = 0; y < map.length; y++) {
        result.push([]);
        for (let x = 0; x < map[y].length; x++) {
            let place = map[y][x];

            if (place === 'L' || place === '#') {
                const adj = getAdjacentVisible(x, y, map);
                if (place === 'L' && !adj.includes('#')) {
                    place = '#';
                } else if (place === '#' && adj.filter(s => s === '#').length >= 5) {
                    place = 'L';
                }
            }

            result[y][x] = place;
        }
    }
    return result;
}

function mapString(map) {
    return map.map(line => line.join('')).join('\n');
}

function doRounds(map, maxRounds = 100) {

    for (let i = 0; i < maxRounds; i++) {
        const newMap = doRound(map);

        console.log(mapString(newMap));

        if (mapString(newMap) === mapString(map)){
            return { stopped: newMap, rounds: i } ;
        }
        map = newMap;
    }

    throw new Error(`Max rounds exceeded ${maxRounds}`);
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const map = input.split('\n').map(line => line.split(''));

        // console.log(getAdjacent(3, 4, map));

        const { stopped, rounds } = doRounds(map);
        const final = mapString(stopped);

        const count = final.replace(/[^#]/g, '').length;
        console.log(count, rounds);
    })();
}

module.exports = {};
