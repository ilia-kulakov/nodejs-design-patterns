import { concatFiles } from "./concatFiles.js";

const dest = process.argv[2];
const filenames = process.argv.slice(3);

concatFiles(
  dest,
  (err) => {
    if (err) {
      console.error("An ERROR occured:");
      console.error(err);
      process.exit(1);
    }

    console.log(`Concatenation complete, dest file "${dest}"`);
  },
  ...filenames
);
