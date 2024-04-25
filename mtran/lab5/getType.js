function getType(variable) {
    if (variable === 't' || variable === 'nil' || variable === '#t' || variable === '#f') {
        return 'Boolean';
    } else if (!isNaN(Number(variable))) {
        return 'Number';
    } else if ((variable[0] === '\'' || variable[0] === '"') && (variable[variable.length - 1] === '\'' || variable[variable.length - 1] === '"')) {
        return 'String';
    }
}

export default getType;