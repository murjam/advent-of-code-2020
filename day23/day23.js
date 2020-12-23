const { readFileToString } = require('../lib/lib.js');

function shiftCircle(circle, newFirstIndex) {
    circle = circle.slice();
    const addToTheEnd = [];

    for (let i = 0; i < newFirstIndex; i++) {
        addToTheEnd.push(circle.shift());
    }

    return [...circle, ...addToTheEnd];
}

function findMaxAndMin(circle) {
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;

    for (const cupLabel of circle) {
        if (cupLabel > max) {
            max = cupLabel;
        }
        if (cupLabel < min) {
            min = cupLabel;
        }
    }

    return {
        max,
        min,
    };
}

function initMap(circle) {
    const map = new Map();

    for (const cupLabel of circle) {
        const cup = {
            label: cupLabel,
        }
        map.set(cupLabel, cup);
    }

    const first = map.get(circle[0]);

    circle.forEach((cupLabel, i) => {
        const cup = map.get(cupLabel);
        const nextLabel = circle[i + 1];

        if (map.has(nextLabel)) {
            cup.next = map.get(nextLabel);
        } else {
            cup.next = first;
        }
    });

    return map;
}

function fillOneMillion(circle) {
    circle = circle.slice();
    const highest = Math.max(...circle);

    let el = highest + 1;
    while (circle.length < 1e6) {
        circle.push(el);
        el += 1;
    }

    return circle;
}

function grabPlays(currentCup, map, { max, min }, moves = 10) {

    for (let move = 1; move <= moves; move++) {
        // console.log(`\n-- move ${move} --`);
        const pick = [currentCup.next, currentCup.next.next, currentCup.next.next.next];

        // console.log(`pick up: ${pick.map(c => c.label).join(', ')}`);

        let destinationLabel = currentCup.label - 1;
        if (destinationLabel < min) {
            destinationLabel = max;
        }

        while (pick.some(c => c.label === destinationLabel)) {
            destinationLabel -= 1;
            if (destinationLabel < min) {
                destinationLabel = max;
            }
        }
        // console.log(`destination: ${destinationLabel}`);

        const destination = map.get(destinationLabel);
        const destinationNext = destination.next;
        destination.next = pick[0];
        currentCup.next = pick[2].next;
        pick[2].next = destinationNext;

        currentCup = currentCup.next;
    }


    return map;
}

function cupGame(input, moves = 10) {
    let circle = input.split('').map(n => parseInt(n, 10));
    circle = fillOneMillion(circle);
    const maxAndMin = findMaxAndMin(circle);
    const cupsMap = initMap(circle);
    const currentCup = cupsMap.get(circle[0]);

    return grabPlays(currentCup, cupsMap, maxAndMin, moves);
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const result = cupGame(input, 1e7);

        const first = result.get(1);
        const second = first.next;
        const third = second.next;

        console.log();

        // part 1
        // const firstResult = [];
        //
        // let current = second;
        // while (current.label !== 1) {
        //     firstResult.push(current.label);
        //     current = current.next;
        // }

        // console.log(firstResult.join(''));
        console.log(second.label * third.label);
    })();
}

module.exports = {};
