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
            return false;
        }
    }

    // Идентификатор прошел все проверки
    return true;
}

module.exports = isValidIdentifier;