const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const readline = require('readline');

const filePath = path.resolve(__dirname, 'text.txt');
const writeableStream = fs.createWriteStream(filePath);

stdout.write('Hello! Write something\n');

const readLine = readline.createInterface({ input: stdin });

readLine.on('line', (message) => {
  if (message.toLowerCase().trim() === 'exit') {
    process.exit();
  }
  writeableStream.write(`${message}\n`);
});

process.on('exit', () => stdout.write('Good luck!'));
process.on('SIGINT', () => process.exit());
