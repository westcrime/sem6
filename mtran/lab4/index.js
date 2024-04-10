const tokenize = require('../lab2/analyzer');
const buildSyntaxTree = require('../lab3/syntaxAnalyzer');
const generateTables = require('./genereateTables');
const checkScopes = require('./checkScopes');
const fs = require('fs');

fs.readFile('code.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    let [answer, normalAnswer] = tokenize(data);
    let ast = buildSyntaxTree(normalAnswer);
    generateTables(ast);
    //checkScopes(ast);

    fs.writeFile('tree.txt', JSON.stringify(ast, null, '\t'), function(error){
        if(error){
          return console.log(error);
        }
        console.log("Файл успешно записан");
      });
});