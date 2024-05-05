import { fileURLToPath } from 'url';
import path, { dirname, join } from 'path';
import fs from 'fs/promises';
import { exists, getFilesInDirectory } from './services.js';

// Получаем полный путь к текущему модулю
const __filename = fileURLToPath(import.meta.url);

// Получаем директорию, в которой находится текущий модуль
const __dirname = dirname(__filename);

class Pointer {
    currentTable;
    isConnected = false;

    async connect(tableName) {
        if (this.isConnected) {
            const pathToTable = join(__dirname, '.', 'data', `${this.currentTable}.json`);
            const tableData = JSON.parse(await fs.readFile(pathToTable, 'utf-8')); 
            for (const key of Object.keys(tableData.fields)) {
                delete this[key];
            }
        }
        const pathToTable = join(__dirname, '.', 'data', `${tableName}.json`);
        if (await exists(pathToTable)) {
            const tableData = JSON.parse(await fs.readFile(pathToTable, 'utf-8')); 
            for (const key of Object.keys(tableData.fields)) {
                this[key] = tableData.fields[key];
            }
            this.isConnected = true;
            this.currentTable = tableName;
        } else {
            throw new Error(`${this.currentTable}: Table ${tableName} not found`);
        }
    }

    async save(data) {
        if (this.isConnected) {
            await this.validate(data);
            const tableData = JSON.parse(await fs.readFile(join(__dirname, '.', 'data', `${this.currentTable}.json`), 'utf-8'));
            tableData.data.push(data);
            await fs.writeFile(join(__dirname, '.', 'data', `${this.currentTable}.json`), JSON.stringify(tableData, null, '\t'));
        } else {
            throw new Error('Pointer is not connected to any table.')
        }
    }

    async validate(data) {
        if (Object.keys(data).length !== Object.keys(this).length - 2) {
            throw new Error('Wrong args length');
        }
        // Перебираем ключи объекта data
        for (const key of Object.keys(data)) {
            // Получаем описание поля из текущего экземпляра класса
            const fieldDescription = this[key];
            // Проверяем, является ли поле экземпляром StringType
            if (fieldDescription.type === 'StringType') {
                let value = data[key];
                // Проверяем максимальную длину строки
                if (value.length > fieldDescription.maxLength) {
                    throw new Error(`${this.currentTable}: The length of the '${key}' field exceeds the maximum allowed length of ${fieldDescription.maxLength} characters.`);
                }
                if (value === null) {
                    if (fieldDescription.notNull) {
                        throw new Error(`${this.currentTable}: '${key}' is null, but it cant be null.`);
                    }
                }
                if (value.trim() === '') {
                    if (fieldDescription.canBeEmpty) {
                        throw new Error(`${this.currentTable}: '${key}' is empty? but it cant be empty.`);
                    }
                    else {
                        value = fieldDescription.defaultValue;
                    }
                }
            }
            else if (fieldDescription.type === 'NumberType') {
                let value = data[key];
                if (value === null) {
                    if (fieldDescription.notNull) {
                        throw new Error(`${this.currentTable}: '${key}' is null, but it cant be null.`);
                    }
                }
                if (fieldDescription.primaryKey) {
                    const tableData = JSON.parse(await fs.readFile(join(__dirname, '.', 'data', `${this.currentTable}.json`), 'utf-8'));
                    if (tableData.data.map(item => item[key]).indexOf(value) >= 0) {
                        throw new Error(`${this.currentTable}: The value of the '${key}' field is already in use.`);
                    }
                }
                if (value === undefined) {
                    value = fieldDescription.defaultValue;
                }
            }
            else if (fieldDescription.type === 'BooleanType') {
                let value = data[key];
                if (value === null) {
                    if (fieldDescription.notNull) {
                        throw new Error(`${this.currentTable}: '${key}' is null, but it cant be null.`);
                    }
                }
                if (value === undefined) {
                    value = fieldDescription.defaultValue;
                }
            }
            else if (fieldDescription.type === 'ForeignKeyType') {
                let value = data[key];
                const tablePath = join(__dirname, '.', 'data', `${fieldDescription.otherTable}.json`);
                if (!(await exists(tablePath))) {
                    throw new Error(`${this.currentTable}: The table '${fieldDescription.otherTable}' does not exist.`);
                } else {
                    await this.checkForeignKey(fieldDescription.otherTable, value, fieldDescription.fieldName);
                }
            }
            else {
                throw new Error(`${this.currentTable}: '${key}' is unknown fieldtype.`);
            }
        }
    }

    async checkForeignKey(otherTable, fieldValue, fieldName) {
        const pathToOtherTableName = join(__dirname, '.', 'data', `${otherTable}.json`)
        if (await exists(pathToOtherTableName)) {
            const otherTableFileData = await fs.readFile(pathToOtherTableName, 'utf-8');
            const otherTableFileDataJson = JSON.parse(otherTableFileData);
            if (Object.keys(otherTableFileDataJson.fields).indexOf(fieldName) === -1) {
                throw new Error(`${otherTable}: Field ${fieldName} in table ${otherTable} does not exist`);
            } else {
                if (otherTableFileDataJson.data.map(item => item[fieldName]).indexOf(fieldValue) <= -1) {
                    throw new Error(`${otherTable}: No such value for foreign key ${fieldName}`);
                }
            }
        } else {
            throw new Error(`${otherTable}: Table ${otherTable} does not exist`);
        }
    }


    async delete(id, tableName = this.currentTable) {
        if (this.isConnected !== true) {
            throw new Error('You must connect to the table first.');
        }
        const tableData = JSON.parse(await fs.readFile(join(__dirname, '.', 'data', `${tableName}.json`), 'utf-8'));
        if (tableData.references.length !== 0)
        {
            for (const reference of tableData.references) {
                const pathToOtherTable = path.join(__dirname, '.', 'data', `${reference}.json`);
                const otherTableData = JSON.parse(await fs.readFile(pathToOtherTable, 'utf-8'));
                let fieldName;
                let fkName;
                for (const field in otherTableData.fields) {
                    if (otherTableData.fields[field].type === 'ForeignKeyType') {
                        if (otherTableData.fields[field].otherTable === tableName) {
                            fieldName = otherTableData.fields[field].fieldName;
                            fkName = field;
                        }
                    }
                }
                switch (otherTableData.fields[fkName].onDelete) {
                    case 'Cascade':
                        for (const item of otherTableData.data) {
                            if (item[fkName] === id) {
                                // Удаляем запись из основной таблицы
                                const dataIndex = tableData.data.findIndex(item => item.id === id);
                                if (dataIndex !== -1) {
                                    tableData.data.splice(dataIndex, 1);
                                    await fs.writeFile(join(__dirname, '.', 'data', `${tableName}.json`), JSON.stringify(tableData, null, '\t'));
                                } else {
                                    throw new Error(`${tableName}: Record with id ${id} not found in table ${tableName}`);
                                }
                                for (const itemInTableWithForeignKey of otherTableData.data) {
                                    if (itemInTableWithForeignKey[fkName] === id) {
                                        // Удаляем запись из таблицы, к которой привязана основная
                                        await this.delete(itemInTableWithForeignKey[fkName], reference);
                                    }        
                                }
                            }
                        }
                        break;
                    case 'SetNull':
                        for (const item of otherTableData.data) {
                            if (item[fkName] === id) {
                                // Удаляем запись из основной таблицы
                                const dataIndex = tableData.data.findIndex(item => item.id === id);
                                if (dataIndex !== -1) {
                                    tableData.data.splice(dataIndex, 1);
                                    await fs.writeFile(join(__dirname, '.', 'data', `${tableName}.json`), JSON.stringify(tableData, null, '\t'));
                                } else {
                                    throw new Error(`${tableName}: Record with id ${id} not found in table ${tableName}`);
                                }
                                item[foreignKeyFieldName] = null;
                            }
                        }
                        break;
                    case 'Restrict':
                        const relatedRecords = otherTableData.data.filter(item => item[foreignKeyFieldName] === id);
                        if (relatedRecords.length > 0) {
                            throw new Error(`${tableName}: Cannot delete record with id=${id} from table ${tableName} because there are related records in table ${reference}`);
                        }
                        break;
                    default:
                        throw new Error(`${tableName}: Unsupported onDelete action: ${onDeleteAction}`);
                }
            }
        } else {
            // Удаляем запись из основной таблицы
            const dataIndex = tableData.data.findIndex(item => item.id === id);
            if (dataIndex !== -1) {
                tableData.data.splice(dataIndex, 1);
                await fs.writeFile(join(__dirname, '.', 'data', `${tableName}.json`), JSON.stringify(tableData, null, '\t'));
            } else {
                throw new Error(`${tableName}: Record with id ${id} not found in table ${tableName}`);
            }
        }
    }
}

export default Pointer;