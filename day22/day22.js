const { readFileToString } = require('../lib/lib.js');

const stringToNumber = n => parseInt(n, 10);
const numbersOnly = n => typeof n === 'number';
const calculateRoundId = (deck1, deck2) => {
    return `${deck1.join()}|${deck2.join()}`;
}

function playGame(deck1, deck2, depth = 0) {
    const gameRoundIds = {};
    let round = 1;

    for (round; round < 1e6; round++) {
        const roundId = calculateRoundId(deck1, deck2);

        if (roundId in gameRoundIds) {
            // console.log('Infinite loop detected, player 1 wins');
            return { winner: 1, winnerDeck: deck1, round };
        }

        // console.log(`-- Round ${round} --`);
        // console.log(`Player 1's deck: ${deck1.join(', ')}`);
        // console.log(`Player 2's deck: ${deck2.join(', ')}`);

        // need to remove the 'undefined'-s, also copies the deck
        deck1 = deck1.filter(numbersOnly);
        deck2 = deck2.filter(numbersOnly);

        const player1Card = deck1.shift();
        const player2Card = deck2.shift();

        // console.log(`Player 1 plays: ${player1Card}`);
        // console.log(`Player 2 plays: ${player2Card}`);

        let player1Wins;

        if (deck1.length >= player1Card && deck2.length >= player2Card) {
            const subResult = playGame(deck1.slice(0, player1Card), deck2.slice(0, player2Card), depth + 1);
            player1Wins = subResult.winner === 1;
        } else {
            player1Wins = player1Card > player2Card;
        }

        if (player1Wins) {
            // console.log(`Player 1 wins the round!\n`);
            deck1.push(player1Card, player2Card);
            if (deck2.length === 0) {
                return { winner: 1, winnerDeck: deck1, round };
            }
        } else {
            // console.log(`Player 2 wins the round!\n`);
            deck2.push(player2Card, player1Card);
            if (deck1.length === 0) {
                return { winner: 2, winnerDeck: deck2, round };
            }
        }

        gameRoundIds[roundId] = 1;
    }

    console.log({ deck1, deck2, rounds: round - 1});

    throw new Error('Rounds limit exceeded');
}

function start(lines) {
    const [data1, data2] = lines.split('\n\n').map(data => data.split('\n'));
    // remove header
    data1.shift();
    data2.shift();

    let player1 = data1.map(stringToNumber);
    let player2 = data2.map(stringToNumber);

    return playGame(player1, player2);
}

if (require.main === module) {
    (async () => {
        const input = await readFileToString('input.txt');
        const result = start(input);

        if (!result.winner) {
            console.log('no winner', result);
            return;
        }

        console.log('result');
        console.log(result.winnerDeck.reverse().reduce((acc, el, i) => {
            return acc + el * (i + 1);
        }))
    })();
}

module.exports = {};
