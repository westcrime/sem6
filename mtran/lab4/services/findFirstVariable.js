function findFirstVariable(obj) {
    if (obj.type === "Variable") {
        return obj.name;
    } else if (obj.params && obj.params.length > 0) {
        for (let i = 0; i < obj.params.length; i++) {
            const result = findFirstVariable(obj.params[i]);
            if (result) {
                return result;
            }
        }
    }
    return null;
}

module.exports = findFirstVariable;