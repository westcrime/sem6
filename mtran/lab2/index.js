const fs = require('fs');
const analyze = require('./analyzer');

fs.readFile('code.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    let [answer, normalAnswer] = analyze(data);
    console.table(answer);
    console.log(normalAnswer);
  });