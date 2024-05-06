class StringType {
    maxLength: number;
    defaultValue: string;
    canBeEmpty: boolean;
    type: string;
    notNull: boolean;
    constructor(maxLength: number, defaultValue: string, canBeEmpty: boolean, notNull: boolean) {
        this.maxLength = maxLength;
        this.defaultValue = defaultValue;
        this.type = 'StringType';
        this.canBeEmpty = canBeEmpty;
        this.notNull = notNull;
    }
}
export default StringType;
