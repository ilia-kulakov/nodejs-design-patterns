import path from "path";
import { URL } from "url";
import slug from "slug";
import cheerio from "cheerio";

export function urlToFilename(url) {
  const parsedUrl = new URL(url);
  const urlPath = parsedUrl.pathname
    .split("/")
    .filter(function (component) {
      return component !== "";
    })
    .map(function (component) {
      return slug(component, { remove: null });
    })
    .join("/");

  let filename = path.join(parsedUrl.hostname, urlPath);
  if (!path.extname(filename).match(/htm/)) {
    filename += ".html";
  }

  return filename;
}

export function getPageLinks(currentUrl, body) {
  return Array.from(cheerio.load(body)("a"))
    .map((el) => getLinkUrl(currentUrl, el))
    .filter(Boolean);
}

function getLinkUrl(currentUrl, el) {
  const parsedLink = new URL(el.attribs.href || "", currentUrl);
  const currentParsedUrl = new URL(currentUrl);
  if (
    parsedLink.hostname !== currentParsedUrl.hostname ||
    !parsedLink.pathname
  ) {
    return null;
  }
  return parsedLink.toString();
}
