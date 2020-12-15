const { readFileToString } = require('../lib/lib.js');

function memoryGame(numbers, iterations) {
    const spoken = new Array(iterations);
    for (let i = 0; i < numbers.length; i++) {
        spoken[numbers[i]] = i + 1;
    }

    let lastSpoken = numbers[numbers.length - 1];

    for (let turn = numbers.length; turn < iterations; turn++) {
        const spokenNumber = spoken[lastSpoken] ? turn - spoken[lastSpoken] : 0;
        spoken[lastSpoken] = turn;
        lastSpoken = spokenNumber;
    }

    return lastSpoken;
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const lastSpoken = memoryGame(input.split(',').map(n => parseInt(n, 10)), 30000000);

        console.log({ lastSpoken });
    })();
}

module.exports = {};
