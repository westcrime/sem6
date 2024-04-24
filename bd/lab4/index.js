import pkg from 'pg';
import buildQuery from './buildQuery.js';
import { readFile } from 'fs/promises';
import setDefaultSchema from './setDefaultScheme.js';
import Cursor from 'pg-cursor';
import createTrigger from './createTrigger.js';
const createFruitsTable = JSON.parse(
    await readFile(
        new URL('./scripts/fruits/createFruitsTable.json', import.meta.url)
    )
);
const dropFruitsTable = JSON.parse(
    await readFile(
        new URL('./scripts/fruits/dropFruitsTable.json', import.meta.url)
    )
);
const insertFruits = JSON.parse(
    await readFile(
        new URL('./scripts/fruits/insertFruits.json', import.meta.url)
    )
);
const updateFruits = JSON.parse(
    await readFile(
        new URL('./scripts/fruits/updateFruits.json', import.meta.url)
    )
);
const selectFruits = JSON.parse(
    await readFile(
        new URL('./scripts/fruits/selectFruits.json', import.meta.url)
    )
);
const selectScript = JSON.parse(
    await readFile(
        new URL('./scripts/selectScript.json', import.meta.url)
    )
);
const createTableScript = JSON.parse(
    await readFile(
        new URL('./scripts/createTableScript.json', import.meta.url)
    )
);
const dropTableScript = JSON.parse(
    await readFile(
        new URL('./scripts/dropTableScript.json', import.meta.url)
    )
);
const insertScript = JSON.parse(
    await readFile(
        new URL('./scripts/insertScript.json', import.meta.url)
    )
);
const updateScript = JSON.parse(
    await readFile(
        new URL('./scripts/updateScript.json', import.meta.url)
    )
);
const deleteScript = JSON.parse(
    await readFile(
        new URL('./scripts/deleteScript.json', import.meta.url)
    )
);

// Создайте конфигурацию подключения к вашей базе данных
const pool = new pkg.Pool({
  user: 'lab5_user',      // ваше имя пользователя для базы данных
  host: 'localhost',      // адрес сервера базы данных
  database: 'lab5_db',    // имя вашей базы данных
  password: '123456qw',   // ваш пароль для базы данных
  port: 5432,             // порт, на котором работает сервер базы данных
});

await setDefaultSchema('lab5_scheme', pool);

const client = await pool.connect();

// Создаём таблицу
let createQuery = buildQuery(createFruitsTable);
await executeQuery(createFruitsTable, client, createQuery, pool);

let insertQuery = buildQuery(insertFruits);
await executeQuery(insertFruits, client, insertQuery, pool);

let selectQuery = buildQuery(selectFruits);
await executeQuery(selectFruits, client, selectQuery, pool);

let updateQuery = buildQuery(updateFruits);
await executeQuery(insertFruits, client, updateQuery, pool);

await executeQuery(selectFruits, client, selectQuery, pool);

let dropQuery = buildQuery(dropFruitsTable);
await executeQuery(selectFruits, client, dropQuery, pool);

// Функция для выполнения запроса
async function executeQuery(script, client, query, pool) {
    try {
        const result = await client.query(query);

        if (query.toLowerCase().includes('create table')) {
            await createTrigger(script, client, query);
        }

        if (result && result.rows) {
            console.log(result.rows);
        }

        // Возвращаем результат для дальнейшей обработки, если необходимо
        return result;
    } catch (error) {
        console.error('Query execution error:', error);
    }
}

client.release();