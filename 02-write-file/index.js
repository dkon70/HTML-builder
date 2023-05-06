const { stdin, stdout } = process;
const path = require('path');
const fs = require('fs');

const pathToFile = path.join(__dirname, 'text.txt');
let stream = fs.createWriteStream(pathToFile);

stdout.write('Enter some text: ');
stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    stdout.write('Program terminates');
    process.exit();
  }
  stdout.write('Enter some text: ');
  stream.write(data);
});

process.on('SIGINT', () => {
  stdout.write('\nProgram terminates\n');
  process.exit();
});