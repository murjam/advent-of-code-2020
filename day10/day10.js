const { readFileToString } = require('../lib/lib.js');


function doSomething(line) {

}

function getDifferences(jolts) {
    const removable = [];
    const differences = {};
    let last = 0;

    for (let i = 0; i < jolts.length; i++) {
        const num = jolts[i];
        const diff = num - last;
        const key = `${diff}`;

        if (typeof differences[key] === 'number') {
            differences[key]++;
        } else {
            differences[key] = 1;
        }

        if (diff === 1) {
            removable.push(num);
        }

        last = num;
    }

    return { differences, removable };
}

function willPass(jolts) {
    let last = 0;

    for (let i = 0; i < jolts.length; i++) {
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
    let count = 0;
    const traverse = function(removed, removable) {
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

function findAllPasses(sorted, removable) {
    let count = 0;

    for (let i = 0; i < removable.length ; i++) {
         const removeThis = removable[i];
         const sortedWithRemoved = sorted.filter((n) => n !== removeThis && !allRemoved.includes(n));
         const pass = willPass(sortedWithRemoved);

         if (pass) {
             count++;
             count += findAllPasses(sorted, removable.filter(n => !allRemoved.includes(n)), allRemoved);
         }
     }

    return count;
}


if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const sorted = input.split('\n').map(n => parseInt(n, 10)).sort((a, b) => a - b);
        let highest = sorted[sorted.length - 1];
        sorted.push(highest + 3);

        const { differences, removable } = getDifferences(sorted);

        console.log(combinations(sorted, removable));
        // const allPasses = findAllPasses(sorted, removable);

        console.log({ differences, removable });
    })();
}

module.exports = {};
