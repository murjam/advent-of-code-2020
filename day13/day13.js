const { readFileToString } = require('../lib/lib.js');

function earliestLeave(leaveTime, buses, minStep = 1, startTime = 0) {
    const step = minStep;
    let time = startTime;

    while (true) {
        time += step;

        if (leaveTime < time) {
            for (const bus of buses) {
                if (time % bus === 0) {
                    return [time, bus];
                }
            }
        }
    }
}

function busCheck(bus, step = 1, startTime = 0, check = 0) {
    let time = startTime;

    while (true) {
        time += step;
        if (time % bus === check) {
            return time;
        }
    }
}

function leave(buses) {
    let earliest = 1;
    const busTuples = [];

    for (let i = 0; i < buses.length; i++) {
        const bus = buses[i];

        if (bus === 'x') {
            continue;
        }

        busTuples.push([i, parseInt(bus, 10)]);
    }

    const sorted = busTuples.sort((t1, t2) => t2[1] - t1[1]);

    let time = 0;
    let step = 1;
    for (let i = 0; i < sorted.length; i++) {
        const [index, bus] = sorted[i];

        let check = bus - index;

        while (check < 0) {
            check += bus;
        }

        if (check === bus) {
            check = 0;
        }

        time = busCheck(bus, step, time, check);
        step *= bus;
    }

    return time;
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const [leaveTime, busString] = input.split('\n');
        const buses = busString.split(',');

        // part1
        // const buses = busString.split(',').filter(n => n !== 'x').map(n => parseInt(n, 10));
        // const [earliest, bus] = earliestLeave(leaveTime, buses);
        // const wait = earliest - leaveTime;
        // console.log(earliest, leaveTime, bus, wait * bus);

        const res = leave(buses);

        console.log(res);
    })();
}

module.exports = {};
