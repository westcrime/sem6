function executeFunction(body, args) {
    const localSymbolTable = [];
  
    // Заполняем таблицу символов аргументами функции
    for (let i = 0; i < args.length; i++) {
        localSymbolTable.push({name: args[i].name, value: args[i].value});
    }
  
    // Добавляем новую таблицу символов в стек таблиц
    stackOfTables.push(localSymbolTable);
  
    // Результат выполнения функции
    let result;
  
    // Выполняем каждый узел в теле функции
    for (let node of body) {
        result = interpret(node);
    
        // Если узел возвращает значение, сохраняем его как результат функции
        if (result !== undefined) {
            break;
        }
    }
  
    // Удаляем локальную таблицу символов из стека
    stackOfTables.pop();
  
    // Возвращаем результат выполнения функции
    return result;
}
  