function checkVariablesScopeAndType(node, stackOfScopes) {
  if (node.type === 'Operator') {
    let expectedType = checkVariablesScopeAndType(node.params[0], stackOfScopes);
    for (let param of node.params) {
      if (checkVariablesScopeAndType(param, stackOfScopes) !== expectedType) {
        throw new Error(`Line number: ${param.lineNumber}. Token Index: ${param.tokenIndex}. Different types of literals!`);
      }
    }
    return expectedType;
  }
  if (node.type.startsWith('Literal')) {
    let expectedType = node.type.split(' ')[1];
    expectedType = expectedType[0].toUpperCase() + expectedType.slice(1);
    return expectedType;
  }
  if (node.type === 'Variable') {
    const variableName = node.name;
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


module.exports = checkVariablesScopeAndType;