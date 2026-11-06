/** Local-only media review server with byte ranges for reliable video seeking. */
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";

const root = resolve("output/demo");
const types = { ".html":"text/html; charset=utf-8", ".mp4":"video/mp4", ".jpg":"image/jpeg", ".png":"image/png", ".srt":"application/x-subrip; charset=utf-8" };
createServer(async (req,res) => {
  try {
    if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
    const pathname = decodeURIComponent(new URL(req.url,"http://localhost").pathname);
    const file = resolve(root, "." + (pathname === "/" ? "/index.html" : pathname));
    if (!file.startsWith(root + sep) || !types[extname(file)]) { res.writeHead(403).end(); return; }
    const info = await stat(file);
    if (!info.isFile()) { res.writeHead(404).end(); return; }
    let start = 0, end = info.size - 1, partial = false;
    if (req.headers.range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (!match || (!match[1] && !match[2])) { res.writeHead(416, {"Content-Range":`bytes */${info.size}`}).end(); return; }
      if (!match[1]) start = Math.max(0, info.size - Number(match[2]));
      else { start = Number(match[1]); if (match[2]) end = Math.min(end, Number(match[2])); }
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= info.size) { res.writeHead(416, {"Content-Range":`bytes */${info.size}`}).end(); return; }
      partial = true;
    }
    res.writeHead(partial ? 206 : 200, {"Content-Type":types[extname(file)],"Accept-Ranges":"bytes","Content-Length":end-start+1,"Cache-Control":"no-store",...(partial ? {"Content-Range":`bytes ${start}-${end}/${info.size}`} : {})});
    if (req.method === 'HEAD') { res.end(); return; }
    const stream = createReadStream(file, {start,end});
    stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
  } catch { if (!res.headersSent) res.writeHead(404).end('Not found'); else res.destroy(); }
}).listen(Number(process.env.DEMO_PORT || 8770),"127.0.0.1",()=>console.log(`Demo review: http://127.0.0.1:${process.env.DEMO_PORT || 8770}/`));
