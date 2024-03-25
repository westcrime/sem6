const tokenize = require('../lab2/analyzer');
const analyze = require('./syntaxAnalyzer');
const fs = require('fs');

fs.readFile('code.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    let [answer, normalAnswer] = tokenize(data);
    fs.writeFile('tree.txt', JSON.stringify(analyze(normalAnswer), null, 2), function(error){
        if(error){
            return console.log(error);
        }
        console.log("Файл успешно записан");
    });
});