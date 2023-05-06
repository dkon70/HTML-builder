const { stdout } = process;
const path = require('path');
const fs = require('fs');

const pathToFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFolder, {withFileTypes: true}, (err, files) => {
  files.forEach((file) => {
    const pathToFile = path.join(pathToFolder, file.name);

    fs.stat(pathToFile, (err, stats) => {
      if (file.isFile()) {
        stdout.write(`${file.name.split('.')[0]} - ${path.extname(file.name).slice(1)} - ${(stats.size / 1024).toFixed(3)}kb\n`);
      }
    });
  });
});