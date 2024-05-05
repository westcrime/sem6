import Table from '../Table';

// Определяем тип конструктора для класса Table
type TableConstructor = new (...args: any[]) => Table;

class ForeignKeyType<T extends TableConstructor> {
    [key: string]: any;
    public onDelete: string;
    public otherTable: T;
    public fieldName: string;
    public constructor(table: T, fieldName: string,  onDelete: string) {
        this.fieldName = fieldName;
        this.onDelete = onDelete;
        this.otherTable = table;
    }
}

export default ForeignKeyType;