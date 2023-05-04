const { stdout } = process;
const fs = require('fs');
const path = require('path');

const pathToFile = path.join(__dirname, 'text.txt');
const file = fs.createReadStream(pathToFile);
file.on('data', data => {
  stdout.write(data);
});