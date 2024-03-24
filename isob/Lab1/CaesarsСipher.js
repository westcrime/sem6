const fs = require('fs').promises;

function isPunctuation(char) {
    const punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/;
    return punctuationRegex.test(char);
}

function isDigit(char) {
    return !isNaN(parseInt(char));
}

async function processData() {
    const filePath = 'input.txt';

    try {
        const originText = await fs.readFile(filePath, 'utf-8');

        const args = process.argv.slice(2);

        const key = parseInt(args[0]);
        const choice = args[1];

        // Инициализация английского алфавита (строчные буквы)
        const alphabet = Array.from({ length: 26 }, (_, index) => String.fromCharCode('a'.charCodeAt(0) + index));
        let answer = '';

        if (choice == 0) {
            for (const symbol of originText) {
                if (symbol === ' ' || isDigit(symbol) || isPunctuation(symbol)) {
                    answer += symbol;
                } else {
                    answer += alphabet[(alphabet.indexOf(symbol) + key) % alphabet.length];
                }
            }
        } else {
            for (const symbol of originText) {
                if (symbol === ' ' || isDigit(symbol) || isPunctuation(symbol)) {
                    answer += symbol;
                } else {
                    answer += alphabet[(alphabet.indexOf(symbol) - key % alphabet.length + alphabet.length) % alphabet.length];
                }
            }
        }

        console.log(answer);
    } catch (error) {
        console.error(`Error reading the file: ${error.message}`);
    }
}

processData();