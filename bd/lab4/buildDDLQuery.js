function buildDDLQuery(input) {
    const { action, tableName, fields } = input;

    if (action === 'create' && fields) {
        const fieldsDefinitions = fields.map(field =>
        `${field.name} ${field.type} ${field.constraints || ''}`
        ).join(', ');
        return `CREATE TABLE ${tableName} (${fieldsDefinitions});`;
    } else if (action === 'drop') {
        return `DROP TABLE ${tableName};`;
    } else {
        throw new Error('Invalid DDL definition');
    }
}
  
export default buildDDLQuery;