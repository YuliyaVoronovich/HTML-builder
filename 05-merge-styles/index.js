const fsPromises = require('fs').promises;
const path = require('path');
const fs = require('fs');

const pathFolder = path.resolve(__dirname, 'styles');
const pathFolderCopy = path.resolve(__dirname, 'project-dist', 'bundle.css');

const writeableStream = fs.createWriteStream(pathFolderCopy);

async function createBundle() {
  try {
    await readFilesFromFolder();
  } catch (error) {
    console.log(error.message);
  }
}

async function readFilesFromFolder() {
  try {
    const files = await fsPromises.readdir(pathFolder, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile() && path.parse(file.name).ext.slice(1) === 'css') {
        await writeFileToBundle(file);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function writeFileToBundle(file) {
  try {
    const text = await fsPromises.readFile(
      path.resolve(pathFolder, file.name),
      'utf-8',
    );
    writeableStream.write(`${text}\n`);
  } catch (error) {
    console.error(error);
  }
}

createBundle();
