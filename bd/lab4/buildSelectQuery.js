function buildSelectQuery(input) {
    let query = `SELECT ${input.columns.join(', ')} FROM ${input.table}`;
    
    if (input.join) {
      query += ` JOIN ${input.join.table} ON ${input.join.on}`;
    }
    
    if (input.where) {
        if (typeof input.where === 'string') {
            query += ` WHERE ${input.where}`;
        } else if (typeof input.where === 'object' && input.where.subquery) {
            const subquery = buildSelectQuery(input.where.subquery);
            const operator = input.where.operator || 'IN'; // Default operator is IN
            query += ` WHERE ${input.where.column} ${operator} (${subquery})`;
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
  
export default buildSelectQuery;
  