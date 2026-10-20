// Runs after `next build` (the "postbuild" npm script).
//
// Next.js 16.4's static export writes each page's prefetch data into nested
// folders, e.g. out/areas/ai/__next.areas/$d$id/__PAGE__.txt, but the browser
// asks for the same path joined with dots: out/areas/ai/__next.areas.$d$id.__PAGE__.txt.
// On a plain static host (GitHub Pages, Cloudflare) those requests 404, so links
// cannot be prefetched and navigation is slower. This writes a flat copy beside
// each nested file. The nested originals stay in place, so it does no harm if a
// later Next.js release fixes the mismatch.
import { copyFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../out/", import.meta.url));

async function filesUnder(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await filesUnder(path)));
    else files.push(path);
  }
  return files;
}

async function walk(dir) {
  let copied = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(dir, entry.name);
    if (entry.name.startsWith("__next.")) {
      for (const file of await filesUnder(path)) {
        const rest = file.slice(path.length + 1).split(/[\\/]/);
        await copyFile(file, join(dir, [entry.name, ...rest].join(".")));
        copied++;
      }
    } else {
      copied += await walk(path);
    }
  }
  return copied;
}

const copied = await walk(OUT);
console.log(`flatten-prefetch: wrote ${copied} prefetch file(s)`);
