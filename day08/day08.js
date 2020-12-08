const { readFileToString } = require('../lib/lib.js');

let acc = 0;
let iter = 0;
let visitedIndices = [];

function executeStep(command) {
    const [operation, value] = command.split(' ');
    switch (operation) {
        case 'acc':
            acc += parseInt(value);
            return;
        case 'jmp':
            iter += parseInt(value) - 1;
            return;
        case 'nop':
            return;
        default:
            throw new Error(`Unknown operation ${operation}`);
    }
}

function doesTerminate(program) {
    acc = 0;
    iter = 0;
    visitedIndices = [];
    const last = program.length - 1;

    for (; iter < program.length; iter++) {
        const command = program[iter];
        if (visitedIndices.includes(iter)) {
            // loop detected
            return false;
        }
        visitedIndices.push(iter);
        executeStep(command);

        if (iter === last) {
            return true;
        }
    }
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const initialProgram = input.split('\n');

        for (let i = 0; i < initialProgram.length; i++) {
            const [operation] = initialProgram[i].split(' ');

            if (['nop', 'jmp'].includes(operation)) {
                const clone = [...initialProgram];
                clone[i] = clone[i].replace(operation, operation === 'nop' ? 'jmp' : 'nop');

                if (doesTerminate(clone)) {
                    console.log('terminated', acc);
                    return;
                }
            }
        }
    })();
}

module.exports = {};
