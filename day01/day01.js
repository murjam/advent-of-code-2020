const { readFileToString } = require('../lib/lib.js');

function numbersSum(numbers, sum = 2020) {
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
            for (let k = 0; k < numbers.length; k++) {
                if (i === j || j === k || i === k) {
                    continue;
                }
                const value1 = numbers[i];
                const value2 = numbers[j];
                const value3 = numbers[k];

                if (value1 + value2 + value3 === sum) {
                    return [value1, value2, value3];
                }
            }
        }
    }
    return [];
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('day01.txt');
        const numbers = numbersSum(input.split('\n').map(n => parseInt(n, 10)));
        const product = numbers.reduce((product, number) => product * number, 1);

        console.log(numbers, product);
    })();
}

module.exports = {};
