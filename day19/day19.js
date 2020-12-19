const { readFileToString } = require('../lib/lib.js');

const rules = {};

const isSimpleMatch = (rule) => {
    return typeof rule === 'string' && rule.match(/^[a-z]+$/);
}

function buildRule(index, callStack = []) {
    if (callStack.includes(index) && callStack.length > 5) {
        return '.*';
    }

    if (isSimpleMatch(rules[index])) {
        return rules[index];
    }

    if (rules[index].match(/^[a-z()|.*]+$/)) {
        return rules[index];
    }

    callStack = callStack.slice();
    callStack.push(index);

    if (rules[index].match(/^[0-9]+$/)) {
        const result = buildRule(rules[index], callStack);

        rules[index] = result;

        return result;
    }

    const ors = rules[index].split(' | ');

    let totalRegex = '(';
    const andRegexps = [];
    for (const or of ors) {
        const ands = or.split(' ');
        let andRegex = '';
        for (const and of ands) {
            const rule = buildRule(and, callStack);
            andRegex += rule;
        }
        andRegexps.push(`(${andRegex})`);
    }
    totalRegex += `${andRegexps.join('|')})`;

    rules[index] = totalRegex;

    return totalRegex;
}

function initializeRules(lines) {
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const [index, ruleString] = line.split(': ');

        const directMatch = ruleString.match(/"([a-z]+)"/);
        if (directMatch) {
            rules[index] = directMatch[1];
        }
        else {
            rules[index] = ruleString;
        }
    }

    for (const index in rules) {
        buildRule(index);
    }
}

function matchesRules(message) {
    const rule = rules[0];
    const regex = new RegExp(`^${rule}$`);

    return !!regex.exec(message);
}

function func1(all) {
    const [rulesText, data] = all.split('\n\n');
    const rulesArray = rulesText.split('\n');
    const messages = data.split('\n');
    initializeRules(rulesArray);
    
    // console.log(rules[0]);

    let count = 0;

    for (const message of messages) {
        const res = matchesRules(message);
        if (res) {
            count++;
        }
    }

    return count;
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const result = func1(input);

        console.log(result);
    })();
}

module.exports = {};
