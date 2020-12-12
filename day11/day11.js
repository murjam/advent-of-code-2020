const { readFileToString } = require('../lib/lib.js');

function func1(lines) {
    return lines;
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const numbers = func1(input.split('\n'));

        console.log(numbers);
    })();
}

module.exports = {};
