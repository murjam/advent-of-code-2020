import { readFileToString } from '../lib/lib.js';

export async function day1() {
    const input = await readFileToString('day1.txt');

    console.log(input);
}

day1();