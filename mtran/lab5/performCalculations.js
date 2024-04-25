import findVariableInStack from "./findVariableInStack.js";
import executeFunction from "./executeFunction.js";
import getType from "./getType.js";
import interpret from "./interpret.js";

function performCalculations(node, stackOfTables) {
    let leftSide = {};
    let rightSide = {};
    if (node.params[0].type === 'Operator') {
        leftSide = performCalculations(node.params[0], stackOfTables);
    } else if (node.params[0].type.includes('Literal')) {
        leftSide.value = node.params[0].value;
        leftSide.type = getType(leftSide.value)
    } else if (node.params[0].type === 'CallExpression') {
        let args = node.params[0].params.map(param => {
            if (param.type.includes('Literal')) {
                return {name: param.name, value: param.value, type: param.type};
            }
            if (param.type === 'Operator' || param.type === 'CallExpression') {
                let result = interpret(param, stackOfTables);
                return {value: result, type: getType(result)};
            }
            let [arg, argIndex] = findVariableInStack(stackOfTables, param.name);
            return {name: arg.name, value: arg.value, type: arg.type};
        });
        let [funcVar, funcIndex] = findVariableInStack(stackOfTables, node.params[0].name);
        let argsNames = funcVar.argsNames;
        leftSide.value = executeFunction(funcVar.body, args, stackOfTables, argsNames);
        leftSide.type = getType(leftSide.value);
    } else {
        let [variable, index] = findVariableInStack(stackOfTables, node.params[0].name);
        leftSide.value = variable.value;
        leftSide.type = variable.type;
    }
    if (node.params[1].type === 'Operator') {
        rightSide = performCalculations(node.params[1], stackOfTables);
    } else if (node.params[1].type.includes('Literal')) {
        rightSide.value = node.params[1].value;
        rightSide.type = getType(rightSide.value);
    } else if (node.params[1].type === 'CallExpression') {
        let args = node.params[1].params.map(param => {
            if (param.type.includes('Literal')) {
                return {name: param.name, value: param.value, type: param.type};
            }
            if (param.type === 'Operator' || param.type === 'CallExpression') {
                let result = interpret(param, stackOfTables);
                return {value: result, type: getType(result)};
            }
            let [arg, argIndex] = findVariableInStack(stackOfTables, param.name);
            return {name: arg.name, value: arg.value, type: arg.type};
        });
        let [funcVar, funcIndex] = findVariableInStack(stackOfTables, node.params[1].name);
        let argsNames = funcVar.argsNames;
        rightSide.value = executeFunction(funcVar.body, args, stackOfTables, argsNames);
        rightSide.type = getType(rightSide.value);
    } else {
        let [variable, index] = findVariableInStack(stackOfTables, node.params[1].name);
        rightSide.value = variable.value;
        rightSide.type = variable.type;
    }
    if (!rightSide.type.toLowerCase().includes(leftSide.type.toLowerCase()) && !leftSide.type.toLowerCase().includes(rightSide.type.toLowerCase())) {
        throw new Error('Type mismatch');
    }
    if (node.name === '==') {
        if (leftSide.type.toLowerCase().includes('number')) {
            return {value: Number(leftSide.value) === Number(rightSide.value), type: 'Boolean'};
        }
        return {value: leftSide.value === rightSide.value, type: 'Boolean'};
    }
    if (node.name === '!=') {
        if (leftSide.type.toLowerCase().includes('number')) {
            return {value: Number(leftSide.value) !== Number(rightSide.value), type: 'Boolean'};
        }
        return {value: leftSide.value !== rightSide.value, type: 'Boolean'};
    }
    if (node.name === '<') {
        if (leftSide.type.toLowerCase().includes('number')) {
            return {value: Number(leftSide.value) < Number(rightSide.value), type: 'Boolean'};
        }
        return {value: leftSide.value < rightSide.value, type: 'Boolean'};
    }   
    if (node.name === '<=') {
        if (leftSide.type.toLowerCase().includes('number')) {
            return {value: Number(leftSide.value) <= Number(rightSide.value), type: 'Boolean'};
        }
        return {value: leftSide.value <= rightSide.value, type: 'Boolean'};
    }
    if (node.name === '>') {
        if (leftSide.type.toLowerCase().includes('number')) {
            return {value: Number(leftSide.value) > Number(rightSide.value), type: 'Boolean'};
        }
        return {value: leftSide.value > rightSide.value, type: 'Boolean'};
    }
    if (node.name === '>=') {
        if (leftSide.type.toLowerCase().includes('number')) {
            return {value: Number(leftSide.value) >= Number(rightSide.value), type: 'Boolean'};
        }
        return {value: leftSide.value >= rightSide.value, type: 'Boolean'};
    }
    if (node.name === '+') {
        if (leftSide.type.toLowerCase().includes('number')) {
            return {value: Number(leftSide.value) + Number(rightSide.value), type: leftSide.type};
        } else {
            return {value: leftSide.value + rightSide.value, type: leftSide.type};
        }
    } else if (node.name === '-' && leftSide.type.toLowerCase().includes('number')) {
        return {value: Number(leftSide.value) - Number(rightSide.value), type: leftSide.type};
    } else if (node.name === '*' && leftSide.type.toLowerCase().includes('number')) {
        return {value: Number(leftSide.value) * Number(rightSide.value), type: leftSide.type};
    } else if (node.name === '/' && leftSide.type.toLowerCase().includes('number')) {
        return {value: Number(leftSide.value) / Number(rightSide.value), type: leftSide.type};
    }
}

export default performCalculations;