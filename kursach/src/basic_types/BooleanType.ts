class BooleanType {
    public defaultValue: boolean;
    public notNull: boolean;
    public constructor(defaultValue: boolean, notNull: boolean) {
        this.defaultValue = defaultValue;
        this.notNull = notNull;
    }
}

export default BooleanType;