class NumberType {
    defaultValue: number;
    notNull: boolean;
    type: string;
    primaryKey: boolean;
    constructor(defaultValue: number, notNull: boolean, primaryKey: boolean) {
        this.defaultValue = defaultValue;
        this.type = 'NumberType';
        this.notNull = notNull;
        this.primaryKey = primaryKey;
    }
}
export default NumberType;
