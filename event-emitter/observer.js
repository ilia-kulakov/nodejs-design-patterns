import { EventEmitter } from "events";
import { readFile } from "fs";

class FindRegex extends EventEmitter {
  constructor(regex) {
    super();
    this.regex = regex;
    this.files = [];
  }

  addFile(file) {
    this.files.push(file);
    return this;
  }

  find() {
    const emitter = this;
    setImmediate(() => { emitter.emit("start", emitter.files) })
    for (const file of this.files) {
      readFile(file, "utf8", (err, content) => {
        if (err) {
          return this.emit("error", err);
        }

        this.emit("fileread", file);
        const match = content.match(this.regex);
        if (match) {
          match.forEach((elem) => this.emit("found", file, elem));
        }
      });
    }
    return this;
  }
}

const findRegex = new FindRegex(/hello \w+/);
findRegex
  .addFile("fileA.txt")
  .addFile("unexist.txt")
  .addFile("fileB.txt")
  .find()
  .on("start", (files) => console.log(`The find process is starting ${files}`))
  .on("fileread", (file) => console.log(`${file} was read`))
  .on("found", (file, match) => console.log(`Matched "${match}" in  ${file}`))
  .on("error", (err) => console.error(`Error emitted ${err.message}`));
