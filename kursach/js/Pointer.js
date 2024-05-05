import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
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
        const pathToTable = join(__dirname, '.', 'data', `${tableName}.json`);
        if (await exists(pathToTable)) {
            const tableData = JSON.parse(await fs.readFile(pathToTable, 'utf-8')); 
            for (const key of Object.keys(tableData.fields)) {
                this[key] = tableData.fields[key];
            }
            this.isConnected = true;
            this.currentTable = tableName;
        } else {
            throw new Error(`Table ${tableName} not found`);
        }
    }

    async save(data) {
        if (this.isConnected) {
            this.validate(data);
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
                    throw new Error(`The length of the '${key}' field exceeds the maximum allowed length of ${fieldDescription.maxLength} characters.`);
                }
                if (value === null) {
                    if (fieldDescription.notNull) {
                        throw new Error(`'${key}' is null, but it cant be null.`);
                    }
                }
                if (value.trim() === '') {
                    if (fieldDescription.canBeEmpty) {
                        throw new Error(`'${key}' is empty? but it cant be empty.`);
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
                        throw new Error(`'${key}' is null, but it cant be null.`);
                    }
                }
                if (fieldDescription.primaryKey) {
                    const tableData = JSON.parse(await fs.readFile(join(__dirname, '.', 'data', `${this.currentTable}.json`), 'utf-8'));
                    if (tableData.data.map(item => item[key]).indexOf(value) >= 0) {
                        throw new Error(`The value of the '${key}' field is already in use.`);
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
                        throw new Error(`'${key}' is null, but it cant be null.`);
                    }
                }
                if (value === undefined) {
                    value = fieldDescription.defaultValue;
                }
            }
            else if (fieldDescription.type === 'ForeignKeyType') {
                const tablePath = join(__dirname, '.', 'data', `${fieldDescription.otherTable}.json`);
                if (!(await exists(tablePath))) {
                    throw new Error(`The table '${fieldDescription.otherTable}' does not exist.`);
                }
            }
            else {
                throw new Error(`'${key}' is unknown fieldtype.`);
            }
        }
    }
}

export default Pointer;