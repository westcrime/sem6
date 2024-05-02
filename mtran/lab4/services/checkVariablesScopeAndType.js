function checkVariablesScopeAndType(node, stackOfScopes) {
  if (node.type === 'Operator' || node.name === 'set!') {
    let expectedType = checkVariablesScopeAndType(node.params[0], stackOfScopes);
    if (node.params[0].name !== undefined && node.params[0].name.includes('[')) {
      expectedType = 'Any';
    }
    for (let param of node.params) {
      let result = checkVariablesScopeAndType(param, stackOfScopes);
      if (param.name !== undefined && param.name.includes('[')) {
        result = 'Any';
      }
      if (expectedType !== (result === 'Any'? expectedType : result) && result !== (expectedType === 'Any'? result : expectedType)) {
        throw new Error(`Line number: ${param.lineNumber}. Token Index: ${param.tokenIndex}. Different types of variables: ${node.params[0].type.startsWith('Literal')? node.params[0].value : node.params[0].name} and ${param.type.startsWith('Literal')? param.value : param.name}.`);
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
    let variableName = node.name;
    if (node.name.includes('[')) {
      variableName = node.name.split('[')[0];
    }
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
  if (node.type === "CallExpression") {
    return 'Any';
  }
}


module.exports = checkVariablesScopeAndType;