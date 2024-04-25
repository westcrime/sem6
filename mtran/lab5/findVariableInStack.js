function findVariableInStack(stackOfTables, name) {
    for (let index = stackOfTables.length - 1; index >= 0; index--) {
        for (let j = 0; j < stackOfTables[index].length; j++) {
            if (stackOfTables[index][j].name === name) {
                return [stackOfTables[index][j], index];
            }
        }
    }
}

export default findVariableInStack;