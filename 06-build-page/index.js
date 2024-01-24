const fsPromises = require('fs').promises;
const path = require('path');
const fs = require('fs');
const constants = require('fs').constants;

const projectPathTo = path.join(__dirname, 'project-dist');
const assetsPathTo = path.join(__dirname, 'project-dist', 'assets');
const assetsPathFrom = path.join(__dirname, 'assets');

const pathFolder = path.resolve(__dirname, 'styles');
const pathFolderCopy = path.resolve(__dirname, 'project-dist', 'style.css');

const componentsFolder = path.resolve(__dirname, 'components');
const templateHtml = path.resolve(__dirname, 'template.html');

async function createDistPath() {
  try {
    await checkDirectory();
    await copyFiles();
    await createStyles();
    await createHtml();
  } catch (error) {
    console.log(error.message);
  }
}

async function copyFiles(patnFrom = assetsPathFrom, pathTo = assetsPathTo) {
  try {
    const files = await fsPromises.readdir(patnFrom, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        await fsPromises.copyFile(
          path.resolve(patnFrom, file.name),
          path.resolve(pathTo, file.name),
        );
      }
      if (file.isDirectory()) {
        await madeDirectory(path.resolve(assetsPathTo, file.name));
        await cleanFolder(path.resolve(assetsPathTo, file.name));
        copyFiles(
          path.resolve(assetsPathFrom, file.name),
          path.resolve(assetsPathTo, file.name),
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function checkDirectory(pathTo = projectPathTo) {
  try {
    fs.access(pathTo, constants.F_OK);
    await cleanFolder(pathTo);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await madeDirectory((pathTo = assetsPathTo));
      return true;
    }
  }
}

async function madeDirectory(pathTo = assetsPathTo) {
  try {
    await fsPromises.mkdir(pathTo, { recursive: true });
  } catch (error) {
    console.error(error);
  }
}

async function cleanFolder(patn) {
  try {
    const files = await fsPromises.readdir(patn, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        await fsPromises.unlink(path.resolve(patn, file.name));
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function createStyles() {
  const writeableStream = fs.createWriteStream(pathFolderCopy);
  try {
    const files = await fsPromises.readdir(pathFolder, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile() && path.parse(file.name).ext.slice(1) === 'css') {
        const text = await fsPromises.readFile(
          path.resolve(pathFolder, file.name),
          'utf-8',
        );
        writeableStream.write(`${text}\n`);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function createHtml() {
  try {
    const files = await fsPromises.readdir(componentsFolder, {
      withFileTypes: true,
    });

    await fsPromises.readFile(templateHtml, 'utf-8').then(async (text) => {
      for (let file of files) {
        const fileExt = path.parse(file.name).ext.slice(1);
        if (fileExt === 'html') {
          const name = path.parse(file.name).name;
          const componentsFile = path.join(componentsFolder, file.name);
          const component = await fsPromises.readFile(componentsFile, 'utf-8');
          text = text.replaceAll(`{{${name}}}`, component);
          await writeHtml(text);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function writeHtml(text) {
  try {
    const pathHtml = path.resolve(__dirname, 'project-dist', 'index.html');
    const writeableStream = fs.createWriteStream(pathHtml);
    writeableStream.write(text);
  } catch (error) {
    console.error(error);
  }
}

createDistPath();
