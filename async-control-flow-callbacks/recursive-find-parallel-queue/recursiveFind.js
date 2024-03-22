import fs from "fs";
import path from "path";

let running = 0;

export function recursiveFind(dir, keyword, cb) {
  let resultFiles = [];

  recursiveFindText(dir, keyword, (files) => {
    resultFiles = resultFiles.concat(files);
    running--;
    if (running === 0) {
      cb(resultFiles);
    }
  });
}

function recursiveFindText(dir, keyword, cb) {
  running++;
  fs.readdir(dir, { withFileTypes: true }, (err, dirents) => {
    if (err) {
      console.log(`Can not read a directory: ${dir}`);
      return cb([]);
    }

    dirents
      .filter((directory) => directory.isDirectory())
      .forEach((directory) =>
      recursiveFindText(path.join(dir, directory.name), keyword, cb)
      );
    
    let findFiles = [];
    let completed = 0;
    const files = dirents
      .filter((file) => file.isFile())
      .map((file) => path.join(dir, file.name));
      
    files.forEach((filename) => fileIncludes(filename, keyword, (find) => {
      if(find) {
        findFiles.push(filename);
      }
      completed++;
      if(completed == files.length) {
        cb(findFiles)
      }
    }));
  });
}

function fileIncludes(filename, keyword, cb) {
  fs.readFile(filename, "utf8", (err, fileContent) => {
    if (err) {
      console.log(`Can not read a file: ${filename}`);
      return cb(false);
    }

    cb(fileContent.includes(keyword));
  });
}
