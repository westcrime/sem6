function analyze(tokens) {
    let current = 0;

    function walk() {
        let token = tokens[current];

        if (token.type === 'LEFT_BRACKET') {
            // Переходим к следующему токену, который должен быть функцией или оператором
            token = tokens[++current];

            const node = {
                type: 'CallExpression',
                name: token.element,
                params: []
            };

            // Переходим к следующему токену после имени функции
            token = tokens[++current];

            // Пока не встретим RIGHT_BRACKET, собираем параметры функции
            while (token.type !== 'RIGHT_BRACKET') {
                node.params.push(walk());
                token = tokens[current];
            }

            // Пропускаем закрывающую скобку
            current++;
            return node;
        }

        if (token.type === 'SYS_FUNC' || token.type === 'OPERATOR' || token.type === 'KEYWORD') {
            current++;
            return {
                type: 'Identifier',
                name: token.element
            };
        }

        if (token.type === 'IDENTIFICATOR') {
            current++;
            return {
                type: 'Variable',
                name: token.element
            };
        }

        if (token.type === 'LITERAL_NUMBER' || token.type === 'LITERAL_STRING' || token.type === 'CONSTANT') {
            current++;
            return {
                type: 'Literal',
                value: token.element
            };
        }

        throw new Error(`Unknown token type: ${token.type}`);
    }

    const ast = {
        type: 'Program',
        body: []
    };

    while (current < tokens.length) {
        ast.body.push(walk());
    }

    return ast;
  }
  
  module.exports = analyze;
  