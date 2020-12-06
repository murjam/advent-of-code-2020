const { readFileToString } = require('../lib/lib.js');

function questionCount(group) {
    const people = group.split('\n');
    const allYes = {};

    people[0].split('').forEach(char => {
        allYes[char] = true;
    });

    for (let i = 1; i < people.length; i++) {
        const person = people[i];
        for (const char in allYes) {
            if (person.indexOf(char) === -1) {
                delete allYes[char];
            }
        }
    }

    return Object.keys(allYes).length;
}

function countYes(groups) {
    return groups.map(group => questionCount(group))
        .reduce((sum, current) => sum + current, 0);
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const sum = countYes(input.split('\n\n'));

        console.log(sum);
    })();
}

module.exports = {};
