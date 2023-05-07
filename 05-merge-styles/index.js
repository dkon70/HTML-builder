const path = require('path');
const fs = require('fs');

const stylesFolder = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist');
const bundle = path.join(bundlePath, 'bundle.css');
const writeStream = fs.createWriteStream(bundle);

fs.readdir(stylesFolder, (err, files) => {
  files.forEach((file) => {
    const pathToFile = path.join(stylesFolder, file);
    if (path.extname(file) === '.css') {
      const readStream = fs.createReadStream(pathToFile);
      readStream.pipe(writeStream);
    }
  });
});
