function analyze(tokens) {
    let current = 0;

    function walk(topLevelExpression = false) {
        let token = tokens[current];

        if (topLevelExpression) {
            if (token.type !== 'LEFT_BRACKET') {
                throw new Error(`Syntax Error. Line number: ${token.lineNumber}. Token Index: ${token.tokenIndex}. Expected (`);
            }
        }

        if (token.type === 'LEFT_BRACKET') {
            token = tokens[++current];

            const node = {
                type: 'CallExpression',
                name: token.element,
                params: []
            };

            token = tokens[++current];

            while (token.type !== 'RIGHT_BRACKET') {
                node.params.push(walk());
                token = tokens[current];
            }

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

        throw new Error(`Syntax Error. Line number: ${token.lineNumber}. Token Index: ${token.tokenIndex}. Unknown token type: ${token.type}`);
    }

    const ast = {
        type: 'Program',
        body: []
    };

    while (current < tokens.length) {
        ast.body.push(walk(true));
    }

    return ast;
  }
  
  module.exports = analyze;
  