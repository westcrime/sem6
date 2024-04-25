function interpret(node, stack=[]) {
    let stackOfTables = stack;
    function main(node) {
        switch (node.type) {
            case 'begin':
                let beginResult;
                // Выполняем каждое выражение внутри 'begin'
                for (let exp of node.params) {
                    beginResult = interpret(exp, stackOfTables);
                }
                // Возвращаем результат последнего выражения
                return beginResult;

            case 'Sys_func':
                if (node.name === 'set!') {
                    let {variable, index} = findVariableInStack(stackOfTables, node.params[0].name);
                    if (node.params[1].type === 'Operator') {
                        stackOfTables[stackOfTables.length - 2][index].value = performCalculations(node.params[1].type);
                    } else if (node.params[1].type === 'Variable') {
                        let {newVariable, newIndex} = findVariableInStack(stackOfTables, node.params[1].name);
                        stackOfTables[stackOfTables.length - 2][index].value = newVariable.value;
                        stackOfTables[stackOfTables.length - 2][index].type = newVariable.type;
                    } else if (node.params[1].type === 'CallExpression') {
                        let args = node.params[1].params.map(param => {
                            let {arg, argIndex} = findVariableInStack(stackOfTables, param);
                            return {name: arg.name, value: arg.value};
                        });
                        let [funcVar, funcIndex] = findVariableInStack(stackOfTables, node.params[1].name);
                        stackOfTables[stackOfTables.length - 2][index].value = executeFunction(funcVar.body, args);
                    }
                } else if (node.name === 'define') {
                    let variable = {name: node.params[0].name};
                    if (node.params[0].type === 'CallExpression') {
                        variable.type = 'Function';
                        variable.body = node.params[1];
                        variable.numberOfArgs = node.params[0].params.length;
                        for (let param of node.params[0].params) {
                            stackOfTables[stackOfTables.length - 1].push({name: param.name, type: 'Any'});
                        }
                    } else if (node.params[1].type === 'Operator') {
                        variable.value = performCalculations(node.params[1]);
                        let variableOrNull = findFirstVariable(node.params[1]);
                        if (variableOrNull !== null) {
                            variable.type = findVariableInStack(stackOfTables, variableOrNull).type;
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
                break;
            case 'Program':
                main(node.body);
                break;
            default:
                if (node.body !== undefined) {
                    for (let expr of node.body) {
                        main(expr);
                    }
                }
                if (node.params === undefined) {
                    return;
                } else if (Array.isArray(node.params)) {
                    for (let param of node.params) {      
                        main(param);
                    }
                } else {
                    main(node.params);
                }
                break;
        }
    }
    return main(node);
}