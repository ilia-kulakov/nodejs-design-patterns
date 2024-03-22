import { listNestedFiles } from "./listNestedFiles.js";

const dir = process.argv[2];

listNestedFiles(
  dir,
  (err, files) => {
    if (err) {
      console.error("An ERROR occured:");
      console.error(err);
      process.exit(1);
    }

    console.log(`File list: "${files}"`);
  }
);
