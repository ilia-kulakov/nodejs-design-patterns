import fs from "fs";
import path from "path";

let running = 0;

export function listNestedFiles(dir, cb) {
  let resultFiles = [];

  listNestedFilesRecursively(dir, (err, files) => {
    if (err) {
      console.log(`Can not read a directory: ${err}`);
    }

    resultFiles = resultFiles.concat(files);
    running--;
    if (running === 0) {
      cb(null, resultFiles);
    }
  });
}

function listNestedFilesRecursively(dir, cb) {
  running++;
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      return cb(err);
    }

    files
      .filter((directory) => directory.isDirectory())
      .forEach((directory) => listNestedFilesRecursively(path.join(dir, directory.name), cb));

    cb(
      null,
      files.filter((file) => file.isFile()).map((file) => file.name)
    );
  });
}
