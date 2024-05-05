class StringType {
    public maxLength: number;
    public defaultValue: string;
    public canBeEmpty: boolean;
    public notNull: boolean;
    public constructor(maxLength: number, defaultValue: string, canBeEmpty: boolean, notNull: boolean) {
        this.maxLength = maxLength;
        this.defaultValue = defaultValue;
        this.canBeEmpty = canBeEmpty;
        this.notNull = notNull;
    }
}

export default StringType;