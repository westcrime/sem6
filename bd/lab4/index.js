import pkg from 'pg';
import buildQuery from './buildQuery.js';
import { readFile } from 'fs/promises';
import setDefaultSchema from './setDefaultScheme.js';
import Cursor from 'pg-cursor';
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

// Создаём таблицу
let createQuery = buildQuery(createTableScript);
await executeQuery(createQuery, pool);

// Удаляем таблицу
let dropQuery = buildQuery(dropTableScript);
await executeQuery(dropQuery, pool);


// Функция для выполнения запроса
async function executeQuery(query, pool) {
    const client = await pool.connect();
    try {
        await client.query(query);
    } catch (error) {
        console.error('Query execution error:', error);
    } finally {
        client.release();
    }
}

// Функция для выполнения запроса и получения курсора
async function executeQueryAndReturnCursor(query) {
    // Получаем клиента из пула соединений
    const client = await pool.connect();
  
    try {
        // Выполняем запрос и получаем курсор
        const cursor = await client.query(new Cursor(query));
    
        // Возвращаем курсор и клиента для последующего закрытия
        return { cursor, client };
    } catch (error) {
        console.error('Query execution error:', error);
        // Освобождаем клиента обратно в пул
        client.release();
        throw error;
    }
}