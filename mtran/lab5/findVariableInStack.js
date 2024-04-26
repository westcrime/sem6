function findVariableInStack(stackOfTables, name) {
    if (name.includes('[')) {
        let [variable, index] = findVariableInStack(stackOfTables, name.split('[')[0]);
        return [variable.value[name.split('[')[1].split(']')[0]], index];
    }
    for (let index = stackOfTables.length - 1; index >= 0; index--) {
        for (let j = 0; j < stackOfTables[index].length; j++) {
            if (stackOfTables[index][j].name === name) {
                return [stackOfTables[index][j], index];
            }
        }
    }
}

export default findVariableInStack;