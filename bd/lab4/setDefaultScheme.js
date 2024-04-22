const setDefaultSchema = async (schemaName, pool) => {
    const client = await pool.connect();
    try {
        await client.query(`SET search_path TO ${schemaName}`);
        console.log(`Default schema set to ${schemaName}`);
    } catch (error) {
        console.error('Error setting default schema:', error);
    } finally {
        client.release();
    }
};

export default setDefaultSchema;