const { readFileToString } = require('../lib/lib.js');

const requiredFields = [
    'byr', // (Birth Year)
    'iyr', // (Issue Year)
    'eyr', // (Expiration Year)
    'hgt', // (Height)
    'hcl', // (Hair Color)
    'ecl', // (Eye Color)
    'pid', // (Passport ID)
    // 'cid', // (Country ID)
];

function isValid(pass) {
    const fields = pass.split('\n').flatMap(r => r.split(' '));

    for (let i = 0; i < requiredFields.length; i++) {
        if (pass.indexOf(`${requiredFields[i]}:`) === -1) {
            return false;
        }
    }
    for (const field of fields) {
        const [fieldName, value] = field.split(':');
        let valid = false;
        switch (fieldName) {
            case 'byr':
                valid = '1920' <= value && value <= '2002';
                break;
            case 'iyr':
                valid = '2010' <= value && value <= '2020';
                break;
            case 'eyr':
                valid = '2010' <= value && value <= '2030';
                break;
            case 'hgt':
                const res = value.match(/^([0-9]+)(in|cm)$/);
                if (!res) {
                    break;
                }

                const height = res[1];
                const unit = res[2];

                valid = unit === 'cm' ? ('150' <= height && height <= '193') : ('59' <= height && height <= '76')

                break;

            case 'hcl':
                valid = /^#[0-9a-f]{6}$/.test(value);
                break;
            case 'ecl':
                valid = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(value);
                break;
            case 'pid':
                valid = /^[0-9]{9}$/.test(value);
                break;
            case 'cid':
                valid = true;
                break;
        }

        if (!valid) {
            console.log(`Invalid ${field}`);
            return false;
        }
    }

    return true;
}

function func1(rows) {
    const passports = rows.split('\n\n');

    return passports.map(p => isValid(p));
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('day04.txt');
        const validities = func1(input);

        console.log(validities.filter(v => v).length);
    })();
}

module.exports = {};
