import fs from "fs";
import path from "path";
import superagent from "superagent";
import mkdirp from "mkdirp";
import { urlToFilename, getPageLinks } from "./utils.js";

const spidering = new Set();
const scheduledDownloads = [];
const concurrency = 2;
let running = 0;

export function spider(url, nesting, cb) {
  if (spidering.has(url)) {
    return process.nextTick(cb);
  }
  spidering.add(url);

  const filename = urlToFilename(url);
  fs.readFile(filename, "utf8", (err, fileContent) => {
    if (err) {
      if (err.code !== "ENOENT") {
        return cb(err);
      }

      scheduleDownload(url, filename, nesting, cb);
      return launchDownload();
    }

    spiderLinks(url, fileContent, nesting, cb);
  });
}

function spiderLinks(currentUrl, body, nesting, cb) {
  if (nesting === 0) {
    return process.nextTick(cb);
  }

  const links = getPageLinks(currentUrl, body);
  if (links.length === 0) {
    return process.nextTick(cb);
  }

  let completed = 0;
  let hasErrors = false;

  function done(err) {
    if (err) {
      hasErrors = true;
      return cb(err);
    }

    if (++completed === links.length && !hasErrors) {
      return cb();
    }
  }

  links.forEach((link) => spider(link, nesting - 1, done));
}

function scheduleDownload(url, filename, nesting, cb) {
  scheduledDownloads.push({ url, filename, nesting, cb });
}

function launchDownload() {
  while (scheduledDownloads.length && running < concurrency) {
    const { url, filename, nesting, cb } = scheduledDownloads.shift();
    download(url, filename, (err, requestContent) => {
      if (err) {
        return cb(err);
      }

      running--;
      spiderLinks(url, requestContent, nesting, cb);
      launchDownload();
    });
    running++;
  }
}

function download(url, filename, cb) {
  console.log(`Downloading ${url} into ${filename}`);
  superagent.get(url).end((err, res) => {
    let content = "";
    if (!err) {
      content = res.text ? res.text : "";
    } else if (err.status !== 404) {
      return cb(err);
    }

    saveFile(filename, content, (err) => {
      if (err) {
        return cb(err);
      }
      console.log(`Downloaded and saved: ${url}`);
      cb(null, content);
    });
  });
}

function saveFile(filename, contents, cb) {
  mkdirp(path.dirname(filename), (err) => {
    if (err) {
      return cb(err);
    }
    fs.writeFile(filename, contents, cb);
  });
}
