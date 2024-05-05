class NumberType {
    defaultValue;
    notNull;
    primaryKey;
    constructor(defaultValue, notNull, primaryKey) {
        this.defaultValue = defaultValue;
        this.type = 'NumberType';
        this.notNull = notNull;
        this.primaryKey = primaryKey;
    }
}
export default NumberType;
