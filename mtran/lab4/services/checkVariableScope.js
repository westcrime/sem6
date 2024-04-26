const checkNumberOfArgs = require('./checkNumberOfArgs');

function checkVariableScope(node, stackOfScopes, name=node.name) {
    if (Array.isArray(node.params)) {
        for (let param of node.params) {
            if (node.type === 'CallExpression') {
                checkNumberOfArgs(node, stackOfScopes);
            }
            checkVariableScope(param, stackOfScopes);
        }
    }
    else {
        if (node.type.startsWith('Literal')) {
            return;
        }
        const variableName = name;
        let variableFound = false;
        let variableType = null;
        for (let scopeIndex = stackOfScopes.length - 1; scopeIndex >= 0; scopeIndex--) {
            const scope = stackOfScopes[scopeIndex];
            for (const variable of scope) {
                if (variable.name === variableName) {
                    variableFound = true;
                    variableType = variable.type;
                    break;
                }
            }
            if (variableFound) {
                return variableType;
            }
        }
        if (!variableFound) {
            throw new Error(`Line number: ${node.lineNumber}. Token Index: ${node.tokenIndex}. Undefined variable: ${node.name}!`);
        }
    }
}

module.exports = checkVariableScope;