function checkLiteralTypes(node, expectedType = null) {
    // Если узел является литералом, проверяем его тип
    if (node.type.startsWith("Literal")) {
        const literalType = node.type.split(" ")[1]; // Получаем тип литерала (например, "number")
        if (expectedType === null) {
            expectedType = literalType; // Если ожидаемый тип еще не установлен, устанавливаем его
        } else if (expectedType !== literalType) {
            // Если тип литерала отличается от ожидаемого, возвращаем false
            return false;
        }
    }

        // Если у узла есть параметры, рекурсивно проверяем их
    if (Array.isArray(node.params)) {
        for (const param of node.params) {
            if (!checkLiteralTypes(param, expectedType)) {
            // Если один из параметров не соответствует ожидаемому типу, возвращаем false
            return false;
            }
        }
    }

    // Если все литералы одного типа, возвращаем true
    return true;
}

module.exports = checkLiteralTypes;