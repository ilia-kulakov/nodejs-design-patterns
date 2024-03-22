import fs from "fs";
import path from "path";

export function search(dir, keyword, searchQueue) {
  searchQueue.pushTask((cb) => {
    searchTask(dir, keyword, searchQueue, cb);
  });
}

function searchTask(dir, keyword, queue, cb) {
  fs.readdir(dir, { withFileTypes: true }, (err, dirents) => {
    if (err) {
      return cb(err, []); // message about error and stop task
    }

    dirents
      .filter((directory) => directory.isDirectory())
      .forEach((directory) =>
        search(path.join(dir, directory.name), keyword, queue)
      );

    const filenames = dirents
      .filter((file) => file.isFile())
      .map((file) => path.join(dir, file.name));
    searchInFiles(filenames, keyword, cb)
  });
}

function searchInFiles(filenames, keyword, cb) {
  let findFiles = [];
  let completed = 0;
  filenames.forEach((filename) => {
    fs.readFile(filename, "utf8", (err, fileContent) => {
      if (err) {
        cb(err);  // just message about error and continue task
      } else if (fileContent.includes(keyword)) {
        findFiles.push(filename);
      }

      completed++;
      if (completed == filenames.length) {
        cb(null, findFiles); // task complete successfuly
      }
    });
  });
}
