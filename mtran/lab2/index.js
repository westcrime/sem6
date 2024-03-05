const spaceText = require('./spacing');
const fs = require('fs');
const analyze = require('./analyzer');

fs.readFile('code.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    
    const spacedText = spaceText(data);
    listOfElements = splitIgnoringQuotes(spacedText, ' ');
    console.table(analyze(listOfElements));
  });

  function splitIgnoringQuotes(str, delimiter) {
    let elements = [];
    let currentElement = '';
    let insideQuotes = false;

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === '"') {
            insideQuotes = !insideQuotes;
        }

        if ((char === delimiter || char === '\n') && !insideQuotes) {
            elements.push(currentElement);
            currentElement = '';
        } else {
            currentElement += char;
        }
    }

    elements.push(currentElement); // Добавляем последний элемент
    return elements;
}