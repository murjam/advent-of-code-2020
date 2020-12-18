const { readFileToString } = require('../lib/lib.js');

function calculateSimple(expression) {
    let a;

    eval(`a = ${expression};`);

    return a;
}

function generateCalculate(regex, subCall) {
    return (expression) => {
        while (true) {
            const matches = regex.exec(expression);

            if (!matches) {
                return subCall(expression);
            }

            const [all, capturedExpression] = matches;
            const result = subCall(capturedExpression);
            const before = expression.substr(0, matches.index);
            const after = expression.substr(matches.index + all.length);

            expression = `${before}${result}${after}`;
        }
    };
}

const calculatePlusFirst = generateCalculate(/(\d+ \+ \d+)/, calculateSimple);
const calculateBracketsFirst = generateCalculate(/\(([^()]+)\)/, calculatePlusFirst);

function sumAll(expressions) {
    let sum = 0;

    for (const expression of expressions) {
        sum += calculateBracketsFirst(expression);
    }

    return sum;
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const result = sumAll(input.split('\n'));

        console.log(result);
    })();
}

module.exports = {};
