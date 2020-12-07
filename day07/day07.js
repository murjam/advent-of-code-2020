const {readFileToString} = require('../lib/lib.js');

function buildRules(rules) {
    const result = {};

    for (const line of lines) {
        const [bag, containsWhat] = line.split(' bags contain ');

        if (containsWhat === 'no other bags.') {
            result[bag] = {};
        } else  {
            const res = {};

            const options = containsWhat.split(', ');
            for (const option of options) {
              const nums = option.match(/^([0-9]+) ([a-z ]+) bag[s.]*$/);
              res[nums[2]] = parseInt(nums[1]);
            }
            rules[bag] = res;
        }
    }

    return result;
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


        let count = 0;
        for (const bagType in rules) {
            const can = canContain(bagType, rules);
            if (can) {
                count++;
            }
        }
        console.log(`can contain gold count: ${count}`);
        console.log(`shiny gold children count: ${getChildrenCount('shiny gold', rules)}`);
    })();
}

module.exports = {};
