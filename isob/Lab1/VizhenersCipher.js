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

        const key = args[0];
        const choice = args[1];

        // Инициализация английского алфавита (строчные буквы)
        const alphabet = Array.from({ length: 26 }, (_, index) => String.fromCharCode('a'.charCodeAt(0) + index));
        let answer = '';

        if (choice == 0) {
            for (let i = 0; i < originText.length; i++) {
                if (originText[i] === ' ' || isDigit(originText[i]) || isPunctuation(originText[i])) {
                    answer += originText[i];
                } else {
                    const keyIndex = alphabet.indexOf(key[i % key.length]);
                    answer += alphabet[(alphabet.indexOf(originText[i]) + keyIndex) % alphabet.length];
                }
            }
        } else {
            for (let i = 0; i < originText.length; i++) {
                if (originText[i] === ' ' || isDigit(originText[i]) || isPunctuation(originText[i])) {
                    answer += originText[i];
                } else {
                    const keyIndex = alphabet.indexOf(key[i % key.length]);
                    answer += alphabet[(alphabet.indexOf(originText[i]) - keyIndex + alphabet.length) % alphabet.length];
                }
            }
        }

        console.log(answer);
    } catch (error) {
        console.error(`Error reading the file: ${error.message}`);
    }
}

processData();
