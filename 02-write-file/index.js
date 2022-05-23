const fs = require('fs');
const path = require('path');
const readline = require('readline');
let file = path.join(__dirname,'./text.txt');
let writeableStream = fs.createWriteStream(file);
console.log('Hello. Input text:');
let rl = readline.createInterface({
  input: process.stdin,
  output: writeableStream,
  prompt: ''
});
rl.on('line', (input) => {
  if (input == 'exit') rl.close();
  rl.output.write(input+'\n');
}).on('close', () => {
  console.log('Bay!');
  process.exit(0);
});

process.on('SIGINT',() => {
  rl.close();
} ) ;