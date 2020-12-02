const { readFileToString } = require('../lib/lib.js');

function checkValidity1(line) {
    const [info, pass] = line.split(': ');
    const [numbers, char] = info.split(' ');
    const [from, to] = numbers.split('-').map(n => parseInt(n, 10));
    const count = pass.replace(new RegExp(`[^${char}]`, 'gi'), '').length;

    return count >= from && count <= to;
}

function checkValidity2(line) {
    const [info, pass] = line.split(': ');
    const [numbers, char] = info.split(' ');
    const [from, to] = numbers.split('-').map(n => parseInt(n, 10));

    const firstChar = pass.charAt(from - 1);
    const secondChar = pass.charAt(to - 1);

    return (firstChar === char) !== (secondChar === char);
}

function func1(passwords) {
    return passwords.map(p => checkValidity2(p)).filter(p => p).length
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('day02.txt');
        const numbers = func1(input.split('\n'));

        console.log(numbers);
    })();
}

module.exports = {};
