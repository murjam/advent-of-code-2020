const { readFileToString } = require('../lib/lib.js');

function shiftCircle(circle, newFirstIndex) {
    circle = circle.slice();
    const addToTheEnd = [];

    for (let i = 0; i < newFirstIndex; i++) {
        addToTheEnd.push(circle.shift());
    }

    return [...circle, ...addToTheEnd];
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

function grabPlays(circle, moves = 10) {
    let minValue = Number.MAX_VALUE;
    let maxValue = Number.MIN_VALUE;

    for (const cupLabel of circle) {
        if (cupLabel > maxValue) {
            maxValue = cupLabel;
        }
        if (cupLabel < minValue) {
            minValue = cupLabel;
        }
    }

    // console.log(minValue, maxValue)
    for (let move = 1; move <= moves; move++) {
        console.time('time');
        console.log(`\n-- move ${move} --`);
        // console.log(`cups: ${circle.join(', ')}`);

        const currentCup = circle[0];
        const pick = circle.slice(1, 4);
        // console.log(`pick up: ${pick.join(', ')}`);
        circle = [currentCup].concat(circle.slice(4));

        let destination = currentCup - 1;
        if (destination < minValue) {
            destination = maxValue;
        }

        while (pick.includes(destination)) {
            destination -= 1;
            if (destination < minValue) {
                destination = maxValue;
            }
        }
        // console.log(`destination: ${destination}`);

        const destinationIndex = circle.indexOf(destination);
        // console.log(`destindex: ${destinationIndex}`, circle, typeof destination);
        circle = [].concat(circle.slice(1, destinationIndex + 1)).concat(pick).concat(circle.slice(destinationIndex + 1))
        circle.push = circle[0];

        console.timeEnd('time');
    }

    return circle;
}

function cupGame(input, moves = 10) {
    let circle = input.split('').map(n => parseInt(n, 10));

    circle = fillOneMillion(circle);

    return grabPlays(circle, moves);
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const result = cupGame(input, 1e7);

        const index = result.indexOf(1);

        console.log();
        // 67384529
        // console.log(
        //     shiftCircle(result, index)
        //         .filter((el, i) => i !== 0)
        //         .join('')
        // );
        console.log(result[index + 1] * result[index + 2]);
    })();
}

module.exports = {};
