import { fileURLToPath } from 'url';
import path, { dirname, join } from 'path';
import fs from 'fs/promises';
import { exists, getFilesInDirectory } from './services.js';

// Получаем полный путь к текущему модулю
const __filename = fileURLToPath(import.meta.url);

// Получаем директорию, в которой находится текущий модуль
const __dirname = dirname(__filename);

class Table {

    async checkForCyclicForeignKey(tableName, visitedTables = []) {
        // Если таблица уже была посещена, значит есть цикл
        if (visitedTables.includes(tableName)) {
            throw new Error(`Cyclic foreign key detected in table ${tableName}`);
        }
      
        // Добавить текущую таблицу в посещенные
        visitedTables.push(tableName);
      
        // Получаем путь к файлу таблицы
        const pathToTable = join(__dirname, '.', 'data', `${tableName}.json`);
        if (tableName === this.constructor.name) {
            throw new Error(`Cyclic foreign key detected in table ${tableName}`);
        }
      
        // Проверяем существование файла таблицы
        if (!(await exists(pathToTable))) {
            throw new Error(`Table ${tableName} does not exist`);
        }
      
        // Читаем данные таблицы
        const tableData = JSON.parse(await fs.readFile(pathToTable, 'utf-8'));
      
        // Перебираем поля таблицы и ищем foreign keys
        for (const fieldName in tableData.fields) {
            const field = tableData.fields[fieldName];
            if (field.type === 'ForeignKeyType') {
                // Рекурсивно проверяем связанную таблицу
                await this.checkForCyclicForeignKey(field.otherTable, [...visitedTables]);
            }
        }
    }

    async checkForeignKey(tableWithForeignKey, fieldNameOfForeignKey) {
        const pathToTableWithForeignKey = join(__dirname, '.', 'data', `${tableWithForeignKey}.json`)
        if (await exists(pathToTableWithForeignKey)) {
            const tableWithForeignKeyData = await fs.readFile(pathToTableWithForeignKey, 'utf-8');
            const tableWithForeignKeyDataJson = JSON.parse(tableWithForeignKeyData);
            if (Object.keys(tableWithForeignKeyDataJson.fields).indexOf(fieldNameOfForeignKey) === -1) {
                throw new Error(`Field ${fieldNameOfForeignKey} in table ${tableWithForeignKey} does not exist`);
            } else {
                if (!tableWithForeignKeyDataJson.fields[fieldNameOfForeignKey].primaryKey) {
                    throw new Error(`Field ${fieldNameOfForeignKey} in table ${tableWithForeignKey} is not primary key`);
                }
            }
        } else {
            throw new Error(`Table ${tableWithForeignKey} does not exist`);
        }
    }

    async createTable() {
        const pathToFile = join(__dirname, '.', 'data', `${this.constructor.name}.json`);
        if (await exists(pathToFile)) {
            throw new Error(`Table ${this.constructor.name} already exists`);
        } else {
            let fields = {};
            let isPrimaryKeyChecked = false;
            for (const field of Object.keys(this)) {
                if (this[field].type === 'ForeignKeyType') {
                    await this.checkForeignKey(this[field].otherTable, this[field].fieldName);
                    await this.checkForCyclicForeignKey(this[field].otherTable);
                    // Читаем данные таблицы
                    const tableData = JSON.parse(await fs.readFile(join(__dirname, '.', 'data', `${this[field].otherTable}.json`), 'utf-8'));
                
                    tableData.references.push(this.constructor.name);
                    await fs.writeFile(join(__dirname, '.', 'data', `${this[field].otherTable}.json`), JSON.stringify(tableData, null, '\t'));
                }
                if (this[field].primaryKey === true) {
                    if (isPrimaryKeyChecked === false) {
                        isPrimaryKeyChecked = true;
                        if (this[field].type !== 'NumberType') {
                            throw new Error(`Primary key must be a number`);
                        }
                    }
                    else {
                        throw new Error(`There is already primary key in table ${this.constructor.name}`);
                    }
                }
                fields[field] = this[field];
                fields[field].type = this[field].type;
            }
            await fs.writeFile(pathToFile, JSON.stringify({ fields: fields, data: [], references: []}, null, '\t'));
        }
    }

    async deleteTable() {
        const pathToFile = join(__dirname, '.', 'data', `${this.constructor.name}.json`);
        if (await exists(pathToFile)) {
            const tableData = JSON.parse(await fs.readFile(pathToFile, 'utf-8'));
            if (tableData.references.length === 0) {
                await fs.unlink(pathToFile);
                await this.deleteTableReferences(this.constructor.name);
            } else {
                throw new Error(`Table ${this.constructor.name} is referenced`);
            }
        } else {
            throw new Error(`Table ${this.constructor.name} does not exist`);
        }
    }

    async deleteTableReferences(tableName) {
        for (const file of (await getFilesInDirectory(path.join(__dirname, 'data')))) {
            const tableData = JSON.parse(await fs.readFile(path.join(__dirname, 'data', `${file}`), 'utf-8'));
            if (tableData.references.includes(tableName)) {
                tableData.references = tableData.references.filter(reference => reference!== tableName);
                await fs.writeFile(path.join(__dirname, 'data', `${file}`), JSON.stringify(tableData, null, '\t'));
            }
        }
    }
}
export default Table;
