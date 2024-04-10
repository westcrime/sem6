function findFirstLiteral(obj) {
    if (obj.type === "Literal") {
        return obj.value;
    } else if (obj.params && obj.params.length > 0) {
        for (let i = 0; i < obj.params.length; i++) {
            const result = findFirstLiteral(obj.params[i]);
            if (result) {
                return result;
            }
        }
    }
    return null;
}

module.exports = findFirstLiteral;