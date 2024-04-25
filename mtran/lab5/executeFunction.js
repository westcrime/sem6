import interpret from "./interpret.js"; 

function executeFunction(body, args, stackOfTables, argsNames) {
    const localSymbolTable = [];
  
    // Заполняем таблицу символов аргументами функции
    for (let i = 0; i < args.length; i++) {
        localSymbolTable.push({name: argsNames[i].name, value: args[i].value, type: args[i].type});
    }
  
    // Добавляем новую таблицу символов в стек таблиц
    stackOfTables.push(localSymbolTable);
  
    // Результат выполнения функции
    let result;
  
    if (body.length === undefined) {
        result = interpret(body, stackOfTables);
    } else {
            // Выполняем каждый узел в теле функции
        for (let node of body) {
            result = interpret(node, stackOfTables);
        
            // Если узел возвращает значение, сохраняем его как результат функции
            if (result !== undefined) {
                break;
            }
        }
    }
  
    // Удаляем локальную таблицу символов из стека
    stackOfTables.pop();
  
    // Возвращаем результат выполнения функции
    return result;
}
  
export default executeFunction;