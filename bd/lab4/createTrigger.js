async function createTrigger(script, client, input) {
    try {
        if (script.fields.findIndex(field => field.name.toLowerCase().includes('id')) >= 0) {
            // Создаем функцию увеличения ID
            const incrementFunction = `
                CREATE OR REPLACE FUNCTION increment_id()
                RETURNS TRIGGER AS $$
                DECLARE
                max_id INTEGER;
                BEGIN
                -- Если id новой записи не предоставлен, вычисляем следующий id
                IF NEW.id IS NULL THEN
                    -- Находим максимальное значение id в таблице и увеличиваем его на 1
                    SELECT COALESCE(MAX(id), 0) + 1 INTO max_id FROM ${script.tableName};
                    NEW.id := max_id;
                END IF;
                -- Возвращаем новую запись для вставки в таблицу
                RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;
            `;
        
            // Создаем триггер увеличения ID
            const createTriggerQuery = `
                CREATE OR REPLACE TRIGGER increment_id_before_insert
                BEFORE INSERT ON ${script.tableName}
                FOR EACH ROW
                EXECUTE FUNCTION increment_id();
            `;
        
            // Выполняем запросы
            await client.query(incrementFunction);
            await client.query(createTriggerQuery);
        }
    } catch (error) {
        console.error('Ошибка при создании триггера:', error);
        throw error; // Перебрасываем ошибку дальше, если необходимо
    }
  }
  
  export default createTrigger;
  