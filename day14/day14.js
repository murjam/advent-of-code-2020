const { readFileToString } = require('../lib/lib.js');

function applyMask(binary, mask) {
    const result = [];

    binary = binary.padStart(mask.length, '0')

    for (let i = mask.length - 1; i >= 0; i--) {
        let value = mask[i];
        if (value === 'X') {
            value = binary[i];
        }
        result.unshift(value);
    }

    return parseInt(result.join(''), 2);
}

function applyAddressMask(binary, mask) {
    const result = [];

    binary = binary.padStart(mask.length, '0')

    for (let i = mask.length - 1; i >= 0; i--) {
        let value = mask[i];

        if (value === '0') {
            value = binary[i];
        } else if (value === '1') {
            value = '1';
        }
        result.unshift(value);
    }

    return result.join('');
}

function getMemoryAddresses(mask) {
    const addresses = [[]];
    const addToEachAddress = (addrs, value) => addrs.forEach(address => address.push(value));

    for (let i = 0; i <= mask.length; i++) {
        let value = mask[i];
        if (value === '0' || value === '1') {
            addToEachAddress(addresses, value);
        } else if (value === 'X') {
            const newAddresses = addresses.map(address => address.slice());
            addToEachAddress(addresses, '1');
            addToEachAddress(newAddresses, '0');
            addresses.push(...newAddresses);
        }
    }

    return addresses.map(address => parseInt(address.join(''), 2));
}

function produceMemory(lines) {
    const memory = {};
    const maskLine = lines[0];
    let mask = maskLine.split(' = ')[1];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('mask')) {
            mask = line.split(' = ')[1];
            continue;
        }
        const [mem, value] = line.split(' = ');
        const matches = mem.match(/mem\[(\d+)]/);
        const memoryAddress = parseInt(matches[1]);
        const decimalValue = parseInt(value, 10);
        // const binaryValue = Number(value).toString(2);
        // memory[memoryAddress] = decimalValue;

        const memoryAddressMask = applyAddressMask(memoryAddress.toString(2), mask);
        const memoryAddresses = getMemoryAddresses(memoryAddressMask);
        for (const address of memoryAddresses) {
            memory[address] = decimalValue;
        }

    }
    return memory;
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const memory = produceMemory(input.split('\n'));

        console.log(memory, Object.values(memory).reduce((acc, el) => acc + el, 0));
    })();
}

module.exports = {};
