import fs from "fs";

export function concatFiles(dest, cb, ...src) {
  
  concatNext();

  function concatNext(err) {
    if(err) {
      return cb(err);
    }

    if(!src || !src.length) {
      return cb();
    }

    const filename = src.shift();
    fs.readFile(filename, "utf8", (err, fileContent) => {
      if(err) {
        return concatNext(err);
      }
      console.log(`File "${filename}" content "${fileContent}"`)
      fs.appendFile(dest, fileContent, concatNext);
    })
  }
}