class ForeignKeyType {
    onDelete: string;
    otherTable: string;
    fieldName: string;
    type: string;
    constructor(table: string, fieldName: string, onDelete: string) {
        this.fieldName = fieldName;
        this.onDelete = onDelete;
        this.type = 'ForeignKeyType';
        this.otherTable = table;
    }
}
export default ForeignKeyType;
