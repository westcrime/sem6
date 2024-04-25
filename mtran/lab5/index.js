import tokenize from '../lab2/analyzer.js';
import buildSyntaxTree from '../lab3/syntaxAnalyzer.js';
import generateTables from '../lab4/generateTables.js';
import interpret from './interpret.js';
import fs from 'fs';

fs.readFile('code.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    let [answer, normalAnswer] = tokenize(data);
    let ast = buildSyntaxTree(normalAnswer);
    generateTables(ast);
    interpret(ast);
    fs.writeFile('tree.txt', JSON.stringify(ast, null, '\t'), function(error){
        if(error){
          return console.log(error);
        }
        console.log("Файл успешно записан");
    });
});