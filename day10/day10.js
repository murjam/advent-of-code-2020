const {readFileToString} = require('../lib/lib.js');

function getDifferences(jolts) {
    const removable = [];
    const differences = {};
    const groups = [];
    let last = 0;

    let group = [];

    for (let i = 0; i < jolts.length; i++) {
        const num = jolts[i];
        const diff = num - last;
        const key = `${diff}`;

        if (typeof differences[key] === 'number') {
            differences[key]++;
        } else {
            differences[key] = 1;
        }

        if (diff === 1 && i !== jolts.length - 1 && i !== 0) {
            removable.push(num);
        } else if (diff === 3) {
            groups.push(group);
            group = [];
        }
        group.push(num);

        last = num;
    }
    groups.push(group);

    return {differences, removable, groups};
}

function willPass(jolts) {
    let last = jolts[0];

    for (let i = 1; i < jolts.length; i++) {
        const num = jolts[i];
        const diff = num - last;

        if (![1, 2, 3].includes(diff)) {
            return false;
        }

        last = num;
    }

    return true;
}

function combinations(sorted, allRemovable) {
    if (sorted.length < 3) {
        return 1;
    }
    let count = 1;
    const traverse = function (removed, removable) {
        const pass = willPass(sorted.filter(n => !removed.includes(n)));

        if (!removed.length && !removable.length) {
            return;
        }
        if (!removable.length) {
            if (pass) {
                count++;
            }
        } else {
            if (!pass) {
                return;
            }

            const [first, ...rest] = removable;
            traverse([...removed, removable[0]], rest);
            traverse(removed, rest);
        }
    }
    traverse([], allRemovable);
    return count;
}

const passes = {};

function findAllPasses(sorted, removable, removed = []) {
    let count = 0;

    for (let i = 0; i < removable.length; i++) {
        const removeThis = removable[i];
        const allRemoved = [...removed, removeThis];
        const sortedWithRemoved = sorted.filter((n) => !allRemoved.includes(n));
        const passId = `${sorted.join(',')}:${removed.join(',')}`;

        if (passId in passes) {
            continue;
        }

        const pass = willPass(sortedWithRemoved);
        passes[passId] = pass;

        if (pass) {
            count++;
            count += findAllPasses(sortedWithRemoved, removable.filter(n => !allRemoved.includes(n)), allRemoved);
        }
    }

    return count;
}

function generateCombinationsMap(sorted) {
    const jolts = [0, ...sorted];

    const combinationsMap = {};
    for (let i = 0; i < jolts.length; i++) {
        const number = jolts[i];

        combinationsMap[number] = i === 0 ? 1 : 0;
        if (`${number - 1}` in combinationsMap) {
            combinationsMap[number] += combinationsMap[number - 1];
        }
        if (`${number - 2}` in combinationsMap) {
            combinationsMap[number] += combinationsMap[number - 2];
        }
        if (`${number - 3}` in combinationsMap) {
            combinationsMap[number] += combinationsMap[number - 3];
        }
    }
    return combinationsMap;
}


if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const sorted = input.split('\n').map(n => parseInt(n, 10)).sort((a, b) => a - b);
        let highest = sorted[sorted.length - 1];
        sorted.push(highest + 3);

        const combinations = generateCombinationsMap(sorted);
        const last = combinations[highest];
        console.log(last);

        // console.log(Object.values(map)[Object.keys(map).length - 1]);

        // const { differences, removable, groups } = getDifferences(sorted);
        // const allPasses = findAllPasses(sorted, removable);
        //
        // const groupCounts = groups.map(group => {
        //     const { removable: r2 } = getDifferences(group);
        //     console.log('group', group, r2)
        //     return combinations(group, r2);
        // });
        // const testGroup = groups[1];
        // const { removable: groupRemovables } = getDifferences(testGroup);
        // const testPasses = combinations(testGroup, groupRemovables);
        //
        // console.log({ groups, testGroup, testPasses, allPasses, groupCounts, result: groupCounts.reduce((acc, n) => acc * n, 1) });
    })();
}

module.exports = {};
