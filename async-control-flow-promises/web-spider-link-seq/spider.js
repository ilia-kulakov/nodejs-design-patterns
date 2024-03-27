import { promises as fsPromises } from "fs";
import { dirname } from "path";
import superagent from "superagent";
import mkdirp from "mkdirp";
import { urlToFilename, getPageLinks } from "./utils.js";
import { promisify } from "util";

const mkdirpPromises = promisify(mkdirp);

export function spider(url, nesting) {
  const filename = urlToFilename(url);
  return fsPromises
    .readFile(filename, "utf8")
    .catch((err) => {
      if (err.code !== "ENOENT") {
        throw err;
      }

      return download(url, filename);
    })
    .then((content) => spiderLinks(url, content, nesting));
}

function spiderLinks(currentUrl, content, nesting) {
  let promise = Promise.resolve();
  if (nesting === 0) {
    return promise;
  }

  const links = getPageLinks(currentUrl, content);
  for (const link of links) {
    promise = promise.then(() => spider(link, nesting - 1));
  }

  return promise;
}

function download(url, filename, cb) {
  console.log(`Downloading ${url} into ${filename}`);
  let content;
  superagent
    .get(url)
    .then((res) => {
      content = res.text;
      return mkdirpPromises(dirname(filename));
    })
    .then(() => fsPromises.writeFile(filename, content))
    .then(() => {
      console.log(`Downloaded and saved: ${url}`);
      return content;
    });
}
