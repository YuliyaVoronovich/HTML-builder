const fsPromises = require('fs').promises;
const path = require('path');

const pathFolder = path.resolve(__dirname, 'files');
const pathFolderCopy = path.resolve(__dirname, 'files-copy');

async function changeDirectory() {
  try {
    await deleteFolder();
    await madeDirectory();
    await copyFiles();
  } catch (error) {
    console.log(error.message);
  }
}

async function copyFiles() {
  try {
    const files = await fsPromises.readdir(pathFolder);
    for (const file of files) {
      await fsPromises.copyFile(
        path.resolve(pathFolder, file),
        path.resolve(pathFolderCopy, file),
      );
      console.log(`Скопирован: ${file}`);
    }
  } catch (error) {
    console.error(error);
  }
}

async function madeDirectory() {
  try {
    await fsPromises.mkdir(pathFolderCopy, { recursive: true });
  } catch (error) {
    console.error(error);
  }
}

async function deleteFolder() {
  try {
    await fsPromises.rm(pathFolderCopy, { force: true, recursive: true });
  } catch (error) {
    console.error(error);
  }
}

changeDirectory();
