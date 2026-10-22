import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { gzipSync } from "node:zlib";
const root = resolve("apps/web/out");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
};
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    let file = resolve(root, "." + path);
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    const raw = await readFile(file);
    const gzip = /gzip/.test(req.headers["accept-encoding"] || "");
    res.writeHead(200, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      Vary: "Accept-Encoding",
      ...(gzip ? { "Content-Encoding": "gzip" } : {}),
      "Cache-Control": file.includes("_next")
        ? "public,max-age=31536000,immutable"
        : "no-cache",
    });
    res.end(gzip ? gzipSync(raw) : raw);
  } catch {
    res.writeHead(404).end("Not found");
  }
});
server.listen(Number(process.env.PORT || 8767), "127.0.0.1", () =>
  console.log(
    "Compressed static preview: http://127.0.0.1:" + (process.env.PORT || 8767),
  ),
);
