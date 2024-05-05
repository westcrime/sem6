class StringType {
    maxLength;
    defaultValue;
    canBeEmpty;
    notNull;
    constructor(maxLength, defaultValue, canBeEmpty, notNull) {
        this.maxLength = maxLength;
        this.defaultValue = defaultValue;
        this.type = 'StringType';
        this.canBeEmpty = canBeEmpty;
        this.notNull = notNull;
    }
}
export default StringType;
