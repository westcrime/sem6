function checkNumberOfArgs(node, stackOfTables) {
    let argsNumber = 0;
    let variableFound = null;
    for (let scopeIndex = stackOfTables.length - 1; scopeIndex >= 0; scopeIndex--) {
        const scope = stackOfTables[scopeIndex];
        for (const variable of scope) {
            if (variable.name === node.name) {
                variableFound = true;
                argsNumber = variable.numberOfArgs;
                break;
            }
        }
        if (variableFound) {
            if (node.params.length !== argsNumber) {
                throw new Error(`Line number: ${node.lineNumber}. Token Index: ${node.tokenIndex}. Wrong args number: ${node.name}!`);
            }
        }
    }
    if (!variableFound) {
        throw new Error(`Line number: ${node.lineNumber}. Token Index: ${node.tokenIndex}. Undefined function: ${node.name}!`);
    }
}

module.exports = checkNumberOfArgs;