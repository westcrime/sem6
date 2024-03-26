const test = require('./service');
const {isValidIdentifier, spaceText, splitIgnoringQuotes} = require('./service')

function analyze(data) {
    const spacedText = spaceText(data);
    let listOfElements = splitIgnoringQuotes(spacedText, ' ');

    const answer = [];
    normal_answer = [];
    const categoryMappings = {
        '(': 'LEFT_BRACKET',
        ')': 'RIGHT_BRACKET',
        'nil': 'CONSTANT',
        't': 'CONSTANT',
        '#t': 'CONSTANT',
        '#f': 'CONSTANT',
        'defun': 'SYS_FUNC',
        'define': 'SYS_FUNC',
        'null?': 'SYS_FUNC',
        'list?': 'SYS_FUNC',
        'display': 'SYS_FUNC',
        'eval': 'SYS_FUNC',
        'cond': 'SYS_FUNC',
        'if': 'SYS_FUNC',
        'newline': 'SYS_FUNC',
        'quote': 'SYS_FUNC',
        'list': 'SYS_FUNC',
        'cons': 'SYS_FUNC',
        'cdr': 'SYS_FUNC',
        'car': 'SYS_FUNC',
        'typep': 'SYS_FUNC',
        'else': 'KEYWORD',
        'number': 'KEYWORD',
        'rational': 'KEYWORD',
        'float': 'KEYWORD',
        'complex': 'KEYWORD',
        'integer': 'KEYWORD',
        'sym': 'KEYWORD',
        'ratio': 'KEYWORD',
        'fixnum': 'KEYWORD',
        'bignum': 'KEYWORD',
        'short-float': 'KEYWORD',
        'single-float': 'KEYWORD',
        'double-float': 'KEYWORD',
        'long-float': 'KEYWORD',
        'lambda': 'KEYWORD',
        '+': 'OPERATOR',
        '-': 'OPERATOR',
        '/': 'OPERATOR',
        '*': 'OPERATOR',
        '=': 'OPERATOR',
        '<=': 'OPERATOR',
        '>=': 'OPERATOR',
        '<': 'OPERATOR',
        '>': 'OPERATOR',
    };
    for (element of listOfElements) {
        elementLineNumber = element.lineNumber;
        elementTokenIndex = element.tokenIndex;
        element = element.element.replace(/[\r\n]/g, '');
        if (element === '') continue;
        if (categoryMappings[element]) {
            answer.push({'element': element, 'type': categoryMappings[element]});
            normal_answer.push({element: element, type: categoryMappings[element], 'lineNumber': elementLineNumber, 'tokenIndex': elementTokenIndex});
        } else if (!isNaN(Number(element))) {
            answer.push({'element': element, 'type': 'LITERAL_NUMBER'});
            normal_answer.push({element: element, type: 'LITERAL_NUMBER', 'lineNumber': elementLineNumber, 'tokenIndex': elementTokenIndex});
        } else if ((element[0] === '\'' || element[0] === '"') && (element[element.length - 1] === '\'' || element[element.length - 1] === '"')) {
            answer.push({'element': element, 'type': 'LITERAL_STRING'});
            normal_answer.push({element: element, type: 'LITERAL_STRING', 'lineNumber': elementLineNumber, 'tokenIndex': elementTokenIndex});
        } else if (element[0] === ':') {
            answer.push({'element': element, 'type': 'CONSTANT'}); // Символы, начинающиеся с двоеточия
            normal_answer.push({element: element, type: 'CONSTANT', 'lineNumber': elementLineNumber, 'tokenIndex': elementTokenIndex});
        } else if (element.startsWith('macro')) {
            answer.push({'element': element, 'type': 'MACRO'}); // Макросы
            normal_answer.push({element: element, type: 'MACRO', 'lineNumber': elementLineNumber, 'tokenIndex': elementTokenIndex});
        } else if (element.startsWith(';')) {
            answer.push({'element': element, 'type': 'COMMENT'}); // Комментарии
            normal_answer.push({element: element, type: 'COMMENT', 'lineNumber': elementLineNumber, 'tokenIndex': elementTokenIndex});
        } else if (isValidIdentifier(element) && answer[element] === undefined) {
            answer.push({'element': element, 'type': 'IDENTIFICATOR'});
            normal_answer.push({element: element, type: 'IDENTIFICATOR', 'lineNumber': elementLineNumber, 'tokenIndex': elementTokenIndex});
        } else if (answer[element] === undefined) {
            if (element.includes('\'') || element.includes("\"")) {
                throw Error("Syntax Error: Wrong Literal String Format. Line number: " + elementLineNumber + ". Token index: " + elementTokenIndex + "\n " + element);   
            }
            if (element.includes('#')) {
                throw Error("Syntax Error: Wrong Boolean Format. Line number: " + elementLineNumber + ". Token index: " + elementTokenIndex + "\n " + element);   
            }
            if (element.includes('\\') || element.includes('/')) {
                throw Error("Syntax Error: Wrong Variable Name Format. Line number: " + elementLineNumber + ". Token index: " + elementTokenIndex + "\n " + element);   
            }
            if (!((element[0] >= 'a' && element[0] <= 'z') || (element[0] >= 'A' && element[0] <= 'Z'))) {
                throw Error("Syntax Error: Wrong Number Format. Line number: " + elementLineNumber + ". Token index: " + elementTokenIndex + "\n " + element);  
            }
            throw Error("Syntax Error. Line number: " + elementLineNumber + ". Token index: " + elementTokenIndex + "\n " + element);
        }
    }

    return [answer, normal_answer];
}

module.exports = analyze;

