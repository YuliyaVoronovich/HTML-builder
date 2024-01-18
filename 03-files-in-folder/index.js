const fs = require('fs');
const path = require('path');

const pathFolder = path.resolve(__dirname, 'secret-folder');

const checkDirectory = (pathFolder) => {
  try {
    fs.readdir(pathFolder, { withFileTypes: true }, (err, files) => {
      if (err) console.log(err.message);
      files.forEach((file) => {
        if (file.isDirectory())
          checkDirectory(path.resolve(pathFolder, file.name));
        if (file.isFile()) {
          if (file.name != '.gitkeep') writeInfoFile(file);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};

const writeInfoFile = (file) => {
  try {
    const filePath = path.resolve(pathFolder, file.name);
    const fileExt = path.parse(filePath).ext.slice(1);
    const fileName = path.parse(filePath).name;
    fs.stat(filePath, (err, stats) => {
      if (err) console.log(err.message);
      console.log(
        `${fileName} - ${fileExt} - ${(stats.size / 1000).toFixed(3)} kb`,
      );
    });
  } catch (error) {
    console.error(error);
  }
};

checkDirectory(pathFolder);
