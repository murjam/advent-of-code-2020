const { readFile } = require('fs');

async function readFileToString(fileName) {
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

module.exports = {
    readFileToString,
};
