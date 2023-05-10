const fs = require('fs');
const path = require('path');


const pathToFolder = path.join(__dirname, 'files');
const pathToNewFolder = path.join(__dirname, 'files-copy');

fs.mkdir(pathToNewFolder,  { recursive: true }, (err) => {
  if (err) throw err;
});

fs.readdir(pathToNewFolder, (err, files) => {
  if (err) throw err;
  if (files.length !== 0) {
    for (let file of files) {
      const filePath = path.join(pathToNewFolder, file);
      fs.unlink(filePath, () => {

      });
    }
  }
  copyFiles();
});

function copyFiles() {
  fs.readdir(pathToFolder, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      const pathToFile = path.join(pathToFolder, file);
      const pathToNewFile = path.join(pathToNewFolder, file);
  
      fs.copyFile(pathToFile, pathToNewFile, (err) => {
        if (err) throw err;
      });
    });
  });
}
