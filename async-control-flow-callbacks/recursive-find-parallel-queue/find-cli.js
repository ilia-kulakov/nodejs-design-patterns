import { search } from "./search.js";
import { TaskQueue } from "./taskQueue.js";

const dir = process.argv[2];
const keyword = process.argv[3];
const concurrency = Number.parseInt(process.argv[4], 10) || 2;

const searchQueue = new TaskQueue(concurrency);
searchQueue.on("error", console.error);
searchQueue.on("empty", console.log);


search(dir, keyword, searchQueue);
