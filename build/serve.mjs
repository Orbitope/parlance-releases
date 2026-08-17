// Local preview server. Serves _site/ under the same base path production uses
// (site.config.mjs `basePath`) — so while the site lives at a project path, any
// accidental root-absolute URL 404s here instead of working locally and
// breaking in production. With a custom domain configured the base path is "/",
// matching that deployment too.

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import config from "../site.config.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "_site");
const PREFIX = config.basePath;
const PORT = process.env.PORT || 8080;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".json": "application/json",
};

http
  .createServer((req, res) => {
    let url = decodeURIComponent(new URL(req.url, "http://x").pathname);
    // Nudge bare "/" to the project prefix — but not when the prefix IS "/",
    // which would redirect to itself forever.
    if (PREFIX !== "/" && (url === "/" || url === PREFIX.slice(0, -1))) {
      res.writeHead(302, { location: PREFIX });
      return res.end();
    }
    if (!url.startsWith(PREFIX)) {
      res.writeHead(404);
      return res.end("Not under " + PREFIX);
    }
    let rel = url.slice(PREFIX.length);
    if (rel === "" || rel.endsWith("/")) rel += "index.html";
    const file = path.normalize(path.join(ROOT, rel));
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      const notFound = path.join(ROOT, "404.html");
      res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      return res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : "404");
    }
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(fs.readFileSync(file));
  })
  .listen(PORT, () => {
    console.log(`Serving _site at http://localhost:${PORT}${PREFIX}`);
  });
