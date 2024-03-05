function spaceText(text) {
    const brackets = ['(', ')', '[', ']', '{', '}', '\n'];
    
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

module.exports = spaceText;