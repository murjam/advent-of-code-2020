const { readFileToString } = require('../lib/lib.js');

function processTickets([rules, yourTicket, nearByTickets]) {
    const rulesArray = rules.split('\n');
    const allowedByAnyRule = [];
    const allowedByRules = {};
    rulesArray.forEach((rule) => {
        const [head, rangesText] = rule.split(': ');
        const allowedByThisRule = [];
        const ranges = rangesText.split(' or ');
        ranges.forEach((range) => {
            const [low, high] = range.split('-').map(value => parseInt(value, 10));
            for (let allowed = low; allowed <= high; allowed++) {
                allowedByThisRule.push(allowed);
                allowedByAnyRule.push(allowed);
            }
        });
        allowedByRules[head] = allowedByThisRule;
    });

    const [, ...nearBys] = nearByTickets.split('\n');

    const invalidValues = [];
    const validTickets = [];

    validateTickets:
    for (const nearBy of nearBys) {
        const values = nearBy.split(',').map(n => parseInt(n, 10));
        for (let i = 0; i < values.length; i++) {
            const value = values[i];

            if (!allowedByAnyRule.includes(value)) {
                invalidValues.push(value);
                continue validateTickets;
            }
        }
        validTickets.push(values);
    }

    const ruleNames = Object.keys(allowedByRules);
    const validFor = [];
    for (let i = 0; i < ruleNames.length; i++) {
        validFor.push(ruleNames.slice());
    }

    for (const validTicket of validTickets) {
        for (let i = 0; i < validTicket.length; i++) {
            const value = validTicket[i];

            for (const validRule of validFor[i]) {
                if (!allowedByRules[validRule].includes(value)) {
                    validFor[i] = validFor[i].filter(r => r !== validRule);
                }
            }
        }
    }

    const usedFields = [];
    let atLeastOneProblem = false;

    do {
        atLeastOneProblem = false;
        for (let i = 0; i < validFor.length; i++) {
            if (typeof validFor[i] === 'string') {
                continue;
            }
            const fields = validFor[i].filter(f => !usedFields.includes(f));

            if (fields.length === 1) {
                validFor[i] = fields[0];
                usedFields.push(fields[0]);
            } else {
                atLeastOneProblem = true;
            }
        }
    } while (atLeastOneProblem);

    const [, yourTicketText] = yourTicket.split('\n');
    const yourTicketValues = yourTicketText.split(',').map(t => parseInt(t, 10));
    const yourTicketFields = {};
    const departureValues = [];
    for (let i = 0; i < yourTicketValues.length; i++) {
        const field = validFor[i];
        yourTicketFields[field] = yourTicketValues[i];

        if (field && field.startsWith('departure')) {
            departureValues.push(yourTicketValues[i]);
        }
    }

    return { invalidValues, validFor, yourTicketFields, departureValues };
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const result = processTickets(input.split('\n\n'));

        console.log(result, result.departureValues.reduce((acc, v) => v * acc, 1));
    })();
}

module.exports = {};
