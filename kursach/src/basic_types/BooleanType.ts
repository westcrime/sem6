class BooleanType {
    defaultValue: boolean;
    notNull: boolean;
    type: string;
    constructor(defaultValue: boolean, notNull: boolean) {
        this.defaultValue = defaultValue;
        this.type = 'BooleanType';
        this.notNull = notNull;
    }
}
export default BooleanType;
