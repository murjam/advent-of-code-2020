const { readFileToString } = require('../lib/lib.js');

function func1(numbers) {
    return numbers;
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('day03.txt');
        const numbers = func1(input.split('\n').map(n => parseInt(n, 10)));

        console.log(numbers);
    })();
}

module.exports = {};
