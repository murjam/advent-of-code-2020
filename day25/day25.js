const { readFileToString } = require('../lib/lib.js');

function transform(subjectNumber, loopSize, initialValue = 1) {
    const base = 20201227;
    let value = initialValue;

    for (let i = 0; i < loopSize; i++) {
        value *= subjectNumber;
        value %= base;
    }

    return value;
}

function findLoopSize(subjectNumber, publicKey) {
    let lastValue = 1;
    for (let loopSize = 1; loopSize < 1e9; loopSize++) {
        const result = transform(subjectNumber, 1, lastValue);

        if (publicKey === result) {
            return loopSize;
        }

        lastValue = result;
    }

    return -1;
}

function reverseEngineer(lines) {
    const [cardPublic, doorPublic] = lines.map(n => parseInt(n, 10));

    const cardLoopSize = findLoopSize(7, cardPublic);
    const doorLoopSize = findLoopSize(7, doorPublic);

    const encryptionDoor = transform(cardPublic, doorLoopSize);
    const encryptionCard = transform(doorPublic, cardLoopSize);

    return { cardLoopSize, doorLoopSize, encryptionDoor, encryptionCard};
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const result = reverseEngineer(input.split('\n'));

        console.log(result);
    })();
}

module.exports = {};
