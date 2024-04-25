function performCalculations(node) {
    let leftSide = node.params[0].value;
    let rightSide = node.params[1].value;
    if (node.params[0].type === 'Operator') {
        leftSide = performCalculations(node.params[0]);
    }
    if (node.params[1].type === 'Operator') {
        rightSide = performCalculations(node.params[1]);
    }
    if (node.name === '+') {
        return leftSide + rightSide;
    } else if (node.name === '-') {
        return leftSide - rightSide;
    } else if (node.name === '*') {
        return leftSide * rightSide;
    } else if (node.name === '/') {
        return leftSide / rightSide;
    }
}

export default performCalculations;