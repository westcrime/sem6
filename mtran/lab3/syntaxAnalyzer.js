function buildSyntaxTree(tokens) {
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
            
            let type = 'CallExpression';
            if (token.type === 'SYS_FUNC') {
                type = 'Sys_func';
            } else if (token.type === 'OPERATOR') {
                type = 'Operator';
            } else if (token.type === 'KEYWORD') {
                type = 'Keyword';
            }

            const node = {
                lineNumber: token.lineNumber,
                tokenIndex: token.tokenIndex,
                type: type,
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
            let type = 'Sys_func';
            if (token.type === 'OPERATOR') {
                type = 'Operator';
            } else if (token.type === 'KEYWORD') {
                type = 'Keyword';
            }
            return {
                lineNumber: token.lineNumber,
                tokenIndex: token.tokenIndex,
                type: type,
                name: token.element
            };
        }

        if (token.type === 'IDENTIFICATOR') {
            current++;
            return {
                lineNumber: token.lineNumber,
                tokenIndex: token.tokenIndex,
                type: 'Variable',
                name: token.element
            };
        }

        if (token.type === 'LITERAL_NUMBER' || token.type === 'LITERAL_STRING' || token.type === 'CONSTANT') {
            current++;
            let type = 'Literal number';
            if (token.type === 'LITERAL_STRING') {
                type = 'Literal string';
            } else if (token.type === 'LITERAL_NUMBER') {
                type = 'Literal number';
            } else if (token.type === 'CONSTANT') {
                type = 'Literal boolean';
            }
            return {
                lineNumber: token.lineNumber,
                tokenIndex: token.tokenIndex,
                type: type,
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
  
  module.exports = buildSyntaxTree;
  