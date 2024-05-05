class NumberType {
    public defaultValue: number;
    public notNull: boolean;
    public constructor(defaultValue: number, notNull: boolean) {
        this.defaultValue = defaultValue;
        this.notNull = notNull;
    }
}

export default NumberType;