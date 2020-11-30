const { readFileToString } = require('../lib/lib.js');

function func1(input) {
    return input;
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('day01.txt');

        console.log(func1(input));
    })();
}

module.exports = {};
