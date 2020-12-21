const { readFileToString } = require('../lib/lib.js');

function extractFood(food) {
    const matches = food.match(/^([a-z ]+) \(contains ([a-z, ]+)\)$/);
    if (!matches) {
        throw new Error(`Could not parse food: ${food}`);
    }

    const [, ingredientsString, allergensString] = matches;
    const ingredients = ingredientsString.split(' ');
    const allergens = allergensString.split(', ');

    return { ingredients, allergens };
}

const findCommon = (allFoodIngredients) => {
    if (allFoodIngredients.length === 0) {
        return [];
    }
    if (allFoodIngredients.length === 1) {
        return allFoodIngredients[0];
    }

    return allFoodIngredients.reduce((containedEverywhere, oneFoodIngredients) => {
        const common = [];

        for (const food of containedEverywhere) {
            if (oneFoodIngredients.includes(food) && !common.includes(food)) {
                common.push(food);
            }
        }

        return common;
    }, allFoodIngredients[0]);
}

const filterAllergens = (foods) => {
    const result = JSON.parse(JSON.stringify(foods)); // deep copy
    const allAllergens = result.map(({ allergens }) => allergens).flat();
    const uniqueAllergens = new Set(allAllergens);
    const size = uniqueAllergens.size;

    const parsed = [];
    const unsafeAllergens = {};

    while (parsed.length < size) {
        uniqueAllergens.forEach((allergen) => {
            const withAllergen = result.filter(food => food.allergens.includes(allergen));
            const common = findCommon(withAllergen.map(({ ingredients }) => ingredients));

            if (common.length === 1) {
                const onlyCommon = common[0];

                unsafeAllergens[allergen] = onlyCommon;
                parsed.push(allergen);
                uniqueAllergens.delete(allergen);

                result.forEach((food) => {
                    food.ingredients = food.ingredients.filter(elem => elem !== onlyCommon);
                })
            }
        })
    }

    return { allergensFiltered: result, unsafeAllergens };
}

function allergens(input) {
    const foods = [];

    for (const food of input) {
        foods.push(extractFood(food));
    }

    const { allergensFiltered, unsafeAllergens } = filterAllergens(foods);

    const safeCount = allergensFiltered
        .map(({ ingredients }) => ingredients.length)
        .reduce((sum, b) => sum + b, 0);

    const unsafeList = Object.entries(unsafeAllergens)
        .sort(([key1], [key2]) => key1.localeCompare(key2))
        .map(([, value]) => value)
        .join(',');

    return { unsafeAllergens, safeCount, unsafeList };
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const result = allergens(input.split('\n'));

        console.log(result);
    })();
}

module.exports = {};
