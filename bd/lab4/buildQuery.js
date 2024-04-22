import buildSelectQuery from "./buildSelectQuery.js";
import buildDDLQuery from "./buildDDLQuery.js";

function buildQuery(input) {
    let query = '';
    if (input.action !== undefined) {
        return buildDDLQuery(input);
    }
    switch (input.type) {
        case 'SELECT':
            // Обработка запроса SELECT (аналогично ранее рассмотренному)
            query = buildSelectQuery(input); // Используем уже существующую функцию
            break;
        case 'INSERT':
            query = `INSERT INTO ${input.table} (${input.columns.join(', ')}) VALUES `;
            query += input.values.map(valueSet => `(${valueSet.map(value => `'${value}'`).join(', ')})`).join(', ');
            break;
        case 'UPDATE':
            query = `UPDATE ${input.table} SET `;
            query += Object.entries(input.set).map(([column, value]) => `${column} = '${value}'`).join(', ');
            if (input.where) {
                query += ` WHERE ${buildWhereClause(input.where)}`; // Функция для обработки WHERE, включая подзапросы
            }
            break;
        case 'DELETE':
            query = `DELETE FROM ${input.table}`;
            if (input.where) {
                query += ` WHERE ${buildWhereClause(input.where)}`; // Аналогично UPDATE
            }
            break;
        default:
            throw new Error(`Unsupported query type: ${input.type}`);
    }
    return query;
}
  
function buildWhereClause(where) {
    if (typeof where === 'string') {
        return where;
    } else if (typeof where === 'object' && where.subquery) {
        const subquery = buildQuery(where.subquery); // Рекурсивный вызов для подзапроса
        const operator = where.operator || 'IN'; // Оператор по умолчанию
        return `${where.column} ${operator} (${subquery})`;
    } else {
        throw new Error('Unsupported WHERE clause');
    }
}
  
export default buildQuery;