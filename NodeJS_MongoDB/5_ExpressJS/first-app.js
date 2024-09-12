// console.log('Hey');

const fs = require('fs'); // fs is file system module which allows you to work upon the file system of the device

// fs.writeFileSync(path of file, content of file) creates new file. if we write only file instead of whole path, it creates the file in this folder only
fs.writeFileSync('hello.txt', 'hello from the file created using NodeJS');