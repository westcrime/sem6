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
    if (where.subquery === undefined) {
        return `${where.column} ${where.operator} '${where.value}'`;
    } else if (where.subquery !== undefined) {
        const subquery = buildQuery(where.subquery); // Рекурсивный вызов для подзапроса
        const operator = where.operator || 'IN'; // Оператор по умолчанию
        return `${where.column} ${operator} (${subquery})`;
    } else {
        throw new Error('Unsupported WHERE clause');
    }
}
  
function buildSelectQuery(input) {
    let query = `SELECT ${input.columns.join(', ')} FROM ${input.table}`;
    
    if (input.join) {
        query += ` JOIN ${input.join.table} ON ${input.join.on}`;
    }
    
    if (input.where) {
        if (input.where.subquery === undefined) {
            query +=  ` WHERE ${input.where.column} ${input.where.operator} ${input.where.value}`;
        } else if (input.where.subquery !== undefined) {
            const subquery = buildQuery(input.where.subquery); // Рекурсивный вызов для подзапроса
            const operator = input.where.operator || 'IN'; // Оператор по умолчанию
            query +=  ` WHERE ${input.where.column} ${operator} (${subquery})`;
        }
    }
    
    if (input.groupBy) {
        query += ` GROUP BY ${input.groupBy.join(', ')}`;
    }
    
    if (input.having) {
        query += ` HAVING ${input.having}`;
    }
    
    if (input.orderBy) {
        query += ` ORDER BY ${input.orderBy.map(ob => `${ob.column} ${ob.direction}`).join(', ')}`;
    }
    
    if (input.limit) {
        query += ` LIMIT ${input.limit}`;
    }
    
    return query;
}

export default buildQuery;