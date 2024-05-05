import NumberType from './basic_types/NumberType';
import StringType from './basic_types/StringType';
import BooleanType from './basic_types/BooleanType';
import ForeignKeyType from './basic_types/ForeignKeyType';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { constants } from 'fs';
import * as fs from 'fs/promises';

// Получаем директорию, в которой находится текущий модуль
const __dirname: string = dirname('./index.ts');


class Table {

    [key: string]: any;

    private isConnected: boolean = false;

    public async connect() {
        if (this.isConnected) {
            return;
        }

        const pathToFile: string = join(__dirname, '.', 'data', `${this.constructor.name}.json`);
        try {
            await fs.access(pathToFile, constants.F_OK);
            console.log(`file ${pathToFile} exists`);
            const fileData: {[key: string]: any} = JSON.parse(await fs.readFile(pathToFile, 'utf-8'));
            if (fileData.fields !== undefined) {
                for (const field of fileData.fields) {
                    if (this[field] !== undefined) {
                        if (fileData.fields[field] !== this[field]) {
                            throw new Error('Table data is corrupted');
                        }
                    } else {
                        throw new Error('Table data is corrupted');
                    }
                }

            } else {
                throw new Error('Table data is corrupted');
            }
        } catch {
            console.log(`file ${pathToFile} does not exists`);
            await fs.writeFile(pathToFile, JSON.stringify({fields: Object.keys(this), data: [], references: []}));
        }
        this.isConnected = true;
    }
    
    public async save(data: {[key: string]: any}): Promise<void> {
        if (!this.isConnected) {
            throw new Error('Table is not connected');
        }
        // Валидация данных перед сохранением
        this.validate(data);
    }

    // Метод для валидации данных перед сохранением
    private validate(data: {[key: string]: any}): void {
        // Перебираем ключи объекта data
        for (const key in data) {
            // Получаем описание поля из текущего экземпляра класса
            const fieldDescription = this[key];
            
            // Проверяем, является ли поле экземпляром StringType
            if (fieldDescription instanceof StringType) {
                let value: string = data[key];
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
                    } else {
                        value = fieldDescription.defaultValue;
                    }
                }
                
            } else if (fieldDescription instanceof NumberType) {
                let value: number = data[key];
                if (value === null) {
                    if (fieldDescription.notNull) {
                        throw new Error(`'${key}' is null, but it cant be null.`);
                    }
                }
                if (value === undefined) {
                    value = fieldDescription.defaultValue;
                }
            } else if (fieldDescription instanceof BooleanType) {
                let value: boolean = data[key];
                if (value === null) {
                    if (fieldDescription.notNull) {
                        throw new Error(`'${key}' is null, but it cant be null.`);
                    }
                }
                if (value === undefined) {
                    value = fieldDescription.defaultValue;
                }
            } else if (fieldDescription instanceof ForeignKeyType) {
                if (fieldDescription.otherTable === undefined) {
                    throw new Error(`'${fieldDescription.fieldName}' is unknown field of table ${fieldDescription.otherTable}.`);
                }
            } else {
                throw new Error(`'${key}' is unknown fieldtype.`);
            }
        }
    }
}

export default Table;