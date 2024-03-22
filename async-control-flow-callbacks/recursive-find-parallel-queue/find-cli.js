import { recursiveFind } from "./recursiveFind.js";

const dir = process.argv[2];
const keyword = process.argv[3];

recursiveFind(dir, keyword, console.log);
