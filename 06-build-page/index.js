const path = require('path');
const fs = require('fs');

const pathToDistFolder = path.join(__dirname, 'project-dist');
const assetsFolder = path.join(__dirname, 'assets');
const newAssetsFolder = path.join(pathToDistFolder, 'assets');

const stylesFolder = path.join(__dirname, 'styles');

fs.mkdir(pathToDistFolder,  { recursive: true }, (err) => {
  if (err) throw err;
});

function copyAssetsFolder(source, target) {
  fs.mkdir(target, { recursive: true }, (err) => {
    if (err) throw err;
    fs.readdir(source, { withFileTypes: true }, (err, files) => {
      if (err) throw err;
      files.forEach((file) => {
        const sourcePath = path.join(source, file.name);
        const targetPath = path.join(target, file.name);
        if (file.isDirectory()) {
          copyAssetsFolder(sourcePath, targetPath);
        } else {
          fs.copyFile(sourcePath, targetPath, (err) => {
            if (err) throw err;
          });
        }
      });
    });
  });
}

copyAssetsFolder(assetsFolder, newAssetsFolder);

const bundle = path.join(pathToDistFolder, 'style.css');
const writeStream = fs.createWriteStream(bundle);

fs.readdir(stylesFolder, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    const pathToFile = path.join(stylesFolder, file);
    if (path.extname(file) === '.css') {
      const readStream = fs.createReadStream(pathToFile);
      readStream.pipe(writeStream);
    }
  });
});

const componentsFolder = path.join(__dirname, 'components');
const regexp = new RegExp('{{\\s*(\\w+)\\s*}}');
const template = path.join(__dirname, 'template.html');
const index = path.join(pathToDistFolder, 'index.html');

async function replaceTags() {
  const indexWrite = fs.createWriteStream(index);
  const tmp = fs.createReadStream(template);
  let dt = '';

  tmp.on('data', async (chunk) => {
    dt += chunk.toString();
    const lines = dt.split('\n');
    for (let line of lines) {
      if (regexp.test(line)) {
        let tag = line.match(regexp)[1];
        const files = await fs.promises.readdir(componentsFolder, { withFileTypes: true });
        const file = files.find((file) => file.name.split('.')[0] === tag);
        if (file) {
          const filePath = path.join(componentsFolder, file.name);
          const fileReadStream = fs.createReadStream(filePath);
          await new Promise((resolve) => {
            fileReadStream.on('data', (data) => {
              indexWrite.write(data);
            });
            fileReadStream.on('end', () => {
              resolve();
            });
          });
        }
      } else {
        indexWrite.write(line);
      }
    }
  });
}

replaceTags();