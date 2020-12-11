const {readFileToString} = require('../lib/lib.js');

<<<<<<< HEAD
function buildRules(lines) {
    const rules = {};

    for (const line of lines) {
        const [bag, containsWhat] = line.split(' bags contain ');

        if (containsWhat === 'no other bags.') {
            rules[bag] = {};
        } else {
=======
function buildRules(rules) {
    const result = {};

    for (const rule of rules) {
        const [bag, containsWhat] = rule.split(' bags contain ');

        if (containsWhat === 'no other bags.') {
            result[bag] = {};
        } else  {
>>>>>>> 0e0702b (Day7 complete)
            const res = {};

            const options = containsWhat.split(', ');
            for (const option of options) {
<<<<<<< HEAD
                const nums = option.match(/^([0-9]+) ([a-z ]+) bag[s.]*$/);
                res[nums[2]] = parseInt(nums[1]);
            }
            rules[bag] = res;
        }
    }

    return rules;
=======
              const nums = option.match(/^([0-9]+) ([a-z ]+) bag[s.]*$/);
              res[nums[2]] = parseInt(nums[1]);
            }
            result[bag] = res;
        }
    }

    return result;
>>>>>>> 0e0702b (Day7 complete)
}

function canContain(bagType, rules, what = 'shiny gold') {
    let contain = false;

    for (const inside of Object.keys(rules[bagType])) {
        if (inside === what) {
            return true;
        }

        if (canContain(inside, rules)) {
            return true;
        }
    }

    return contain;
}

function getChildrenCount(bagType, rules, multiplier = 1) {
    let count = 0;
    for (const inside of Object.keys(rules[bagType])) {
        const amount = rules[bagType][inside];
        count += amount * multiplier;
        count += getChildrenCount(inside, rules, amount * multiplier);
    }
    return count;
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const lines = input.split('\n');
        const rules = buildRules(lines);

<<<<<<< HEAD
        let count = 0;
        for (const bagType in rules) {
            const can = canContain(bagType, rules);
            if (can) {
                count++;
            }
        }

=======

        let count = 0;
        for (const bagType in rules) {
            const can = canContain(bagType, rules);
            if (can) {
                count++;
            }
        }
>>>>>>> 0e0702b (Day7 complete)
        console.log(`can contain gold count: ${count}`);
        console.log(`shiny gold children count: ${getChildrenCount('shiny gold', rules)}`);
    })();
}

module.exports = {};
