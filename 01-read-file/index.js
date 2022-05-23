const fs = require('fs');
const path = require('path');
let file = path.join(__dirname,'./text.txt');
let readableStream = fs.createReadStream(file,'utf8');

readableStream.pipe(process.stdout);
