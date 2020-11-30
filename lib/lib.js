import { readFile } from 'fs';

export async function readFileToString(fileName) {
    return new Promise((resolve, reject) => {
        readFile(fileName, (err, data) => {
            if (err) {
                reject(err);
            }

            if (!data) {
                return data;
            }

            resolve(data.toString());
        });
    });
}
