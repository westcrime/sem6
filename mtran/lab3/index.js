const tokenize = require('../lab2/analyzer');
const analyze = require('./syntaxAnalyzer');
const fs = require('fs');

fs.readFile('code.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let [answer, normalAnswer] = tokenize(data);
  const ast = analyze(normalAnswer);
  const formattedAst = printAst(ast);

  fs.writeFile('tree.txt', formattedAst, function(error){
    if(error){
      return console.log(error);
    }
    console.log("Файл успешно записан");
  });
});

function printAst(node, prefix = '', childrenPrefix = '') {
    let result = '';
  
    result += `${prefix}${node.type}`;
  
    if (node.name) {
      result += ` (name: ${node.name})`;
    }
    if (node.value) {
      result += ` (value: ${node.value})`;
    }
    result += '\n';
  
    const children = node.params || node.body || [];
    children.forEach((child, index) => {
      const isLastChild = index === children.length - 1;
      const connector = isLastChild ? '└─' : '├─';
      const childPrefix = childrenPrefix + (isLastChild ? '    ' : '│   ');
      const nextPrefix = childrenPrefix + connector;
      result += printAst(child, nextPrefix, childPrefix);
    });
  
    return result;
}
  