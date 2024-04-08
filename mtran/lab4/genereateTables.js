const findFirstVariable = require('./services/findFirstVariable')
const findFirstLiteral = require('./services/findFirstLiteral')

function generateTables(node) {
    let stackOfTables = [];
    function main(node) {
        stackOfTables.push([]);
        if (node.type === 'Program') {
            main(node.body);
        }
        if (node.name !== 'define') {
            if (node.body !== undefined) {
                for (let expr of node.body) {
                    main(expr);
                }
            }
            if (node.params === undefined) {
                return;
            }
            if (Array.isArray(node.params)) {
                for (let param of node.params) {      
                    main(param);
                }
            } else {
                main(node.params);
            }
        } else {
            if (node.params.length !== 2) {
                throw new Error(`Line number: ${node.lineNumber}. Token Index: ${node.tokenIndex}. Wrong definition of variable or function!`)
            }
            if (node.params[0].type !== 'CallExpression' && node.params[0].type !== 'Variable') {
                throw new Error(`Semantic error. Line number: ${node.lineNumber}. Token Index: ${node.tokenIndex}. Can't define not variable or function: ${node.params[0].name}`)
            }
            let variable;
            variable = {name: node.params[0].name};
            if (node.params[0].type === 'CallExpression') {
                variable.type = 'Function';
                variable.numberOfArgs = node.params[0].params.length;
            } else if (node.params[1].type === 'Operator') {
                let variableOrNull = findFirstVariable(node.params[1]);
                if (variableOrNull !== null) {
                    let index = stackOfTables.length - 1;
                    let founded = false;
                    for (; index >= 0; index--) {
                        for (let j = 0; j < stackOfTables[index].length; j++) {
                            if (stackOfTables[index][j].name === variableOrNull) {
                                variable.type = stackOfTables[index].type;
                                founded = true;
                            }
                        }
                    }
                    if (!founded) {
                        throw new Error(`Line number: ${node.lineNumber}. Token Index: ${node.tokenIndex}. Undefined variable: ${variableOrNull}!`)
                    } 
                } else {
                    let literal = findFirstLiteral(node.params[1]);
                    if (!isNaN(Number(literal))) {
                        variable.type = 'Number';
                        variable.value = node.params[1].value;
                    } else if ((literal[0] === '\'' || literal[0] === '"') && (literal[literal.length - 1] === '\'' || literal[literal.length - 1] === '"')) {
                        variable.type = 'String';
                    } else {
                        variable.type = 'Boolean'; 
                    }
                }
            } else if (node.params[1].name === 'list') {
                variable.type = 'List';
            } else if (node.params[1].value === 't' || node.params[1].value === 'nil' || node.params[1].value === '#t' || node.params[1].value === '#f') {
                variable.type = 'Boolean';
                variable.value = node.params[1].value;
            } else if (!isNaN(Number(node.params[1].value))) {
                variable.type = 'Number';
                variable.value = node.params[1].value;
            } else if ((node.params[1].value[0] === '\'' || node.params[1].value[0] === '"') && (node.params[1].value[node.params[1].value.length - 1] === '\'' || node.params[1].value[node.params[1].value.length - 1] === '"')) {
                variable.type = 'String';
            }
            stackOfTables[stackOfTables.length - 2].push(variable);
        }
        if (stackOfTables.length !== 0) {
            if (stackOfTables[stackOfTables.length - 1].length !== 0) {
                node.tableOfVariables = stackOfTables.pop();
            }
            else {
                stackOfTables.pop();
            }
        }
        return;
    }
    main(node);
}

module.exports = generateTables;