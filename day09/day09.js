const { readFileToString } = require('../lib/lib.js');

function isSumOfTwo(value, numbers, window) {
    const initial = numbers.length - 1 - window;
    if (initial < 1) {
        return true;
    }
    let i = initial;
    for (; i < numbers.length; i++) {
        for (let j = initial; j < numbers.length; j++) {
            if (i === j) {
                continue;
            }
            if (numbers[i] === numbers[j]) {
                continue;
            }
            if (numbers[i] + numbers[j] === value) {
                return true;
            }
        }
    }
    return false;
}

function findInvalid(numbers, window = 25) {
    const traversed = [];

    for (const number of numbers) {
        const isSum = isSumOfTwo(number, traversed, window);

        if (!isSum) {
            return number;
        }

        traversed.push(number);
    }
    return false;
}

function findSumInRow(sum, numbers) {
    const usedNumbers = [];
    let currentSum = 0;

    for (let i = 0; i < numbers.length; i++) {
        const number = numbers[i];
        usedNumbers.push(number);
        currentSum += number;

        while (currentSum > sum) {
            const removed = usedNumbers.shift();
            currentSum -= removed;
        }

        if (currentSum === sum) {
            return usedNumbers;
        }
    }
    return 'did not find row';
}


if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const numbers = input.split('\n').map(n => parseInt(n, 10));
        const invalidNumber = findInvalid(numbers);
        const result = findSumInRow(invalidNumber, numbers);
        const sorted = result.sort((a, b) => b - a);

        console.log(sorted, sorted[0] + sorted[sorted.length - 1]);
    })();
}

module.exports = {};
