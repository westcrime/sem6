class ForeignKeyType {
    onDelete;
    otherTable;
    fieldName;
    constructor(table, fieldName, onDelete) {
        this.fieldName = fieldName;
        this.onDelete = onDelete;
        this.type = 'ForeignKeyType';
        this.otherTable = table;
    }
}
export default ForeignKeyType;
