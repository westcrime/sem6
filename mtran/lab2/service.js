function isValidIdentifier(identifier) {
    // Проверяем, что идентификатор не пустой
    if (identifier.length === 0) {
        return false;
    }

    // Проверяем, что первый символ является буквой
    const firstChar = identifier[0];
    if (!((firstChar >= 'a' && firstChar <= 'z') || (firstChar >= 'A' && firstChar <= 'Z'))) {
        return false;
    }

    // Проверяем каждый символ идентификатора
    for (let i = 1; i < identifier.length; i++) {
        const char = identifier[i];
        // Разрешаем буквы, цифры, дефисы и знаки подчеркивания
        if (!((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || (char >= '0' && char <= '9') || char === '-' || char === '_')) {
            if (char !== '[' && char !== ']')
            {
                return false;
            }
        }
    }

    // Идентификатор прошел все проверки
    return true;
}

function spaceText(text) {
    const brackets = ['(', ')', '{', '}', '\n'];
    
    // Преобразуем строку в массив символов
    const characters = text.split('');

    // Проходим по каждому символу
    for (let i = 0; i < characters.length; i++) {
        const char = characters[i];
        // Если текущий символ является скобкой
        if (brackets.includes(char)) {
            // Проверяем, есть ли пробел перед текущей скобкой
            if (i > 0 && characters[i - 1] !== ' ') {
                // Вставляем пробел перед скобкой
                characters.splice(i, 0, ' ');
                i++; // Увеличиваем индекс, чтобы пропустить вставленный пробел
            }
            // Проверяем, есть ли пробел после текущей скобки
            if (i < characters.length - 1 && characters[i + 1] !== ' ') {
                // Вставляем пробел после скобки
                characters.splice(i + 1, 0, ' ');
                i++; // Увеличиваем индекс, чтобы пропустить вставленный пробел
            }
        }
    }

    // Преобразуем массив обратно в строку
    return characters.join('');
}

function splitIgnoringQuotes(str, delimiter) {
    let elements = [];
    let currentElement = '';
    let insideQuotes = false;
    let lineNumber = 1;
    let tokenIndex = 1;

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === '"' || char === '\'') {
            insideQuotes = !insideQuotes;
        }

        if (char === '\n' && !insideQuotes) {
            elements.push({'element': currentElement, 'lineNumber': lineNumber, 'tokenIndex': tokenIndex});
            currentElement = '';
            lineNumber++;
            tokenIndex = 1;
        } else if (char === delimiter && !insideQuotes) {
            elements.push({'element': currentElement, 'lineNumber': lineNumber, 'tokenIndex': tokenIndex});
            currentElement = '';
            tokenIndex++;
        } else {
            currentElement += char;
        }
    }

    elements.push({'element': currentElement, 'lineNumber': lineNumber, 'tokenIndex': tokenIndex});
    return elements;
}

module.exports = {isValidIdentifier, spaceText, splitIgnoringQuotes};