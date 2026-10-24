// Dev helper: tiles every image in a folder into one labelled sheet for review.
// usage: node scripts/contact-sheet.mjs <dir> <out.jpg>
import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

const [dir, out] = process.argv.slice(2);
const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
const W = 300, H = 220, COLS = 6;
const rows = Math.ceil(files.length / COLS);
const tiles = await Promise.all(
  files.map(async (f, i) => {
    const img = await sharp(path.join(dir, f)).resize(W, H - 24, { fit: "cover" }).toBuffer();
    const label = Buffer.from(
      `<svg width="${W}" height="24"><rect width="100%" height="100%" fill="#111"/><text x="6" y="17" font-size="13" font-family="Arial" fill="#ffb900">${i}: ${f.slice(0, 34).replace(/&/g, "")}</text></svg>`,
    );
    return [
      { input: img, left: (i % COLS) * W, top: Math.floor(i / COLS) * H },
      { input: label, left: (i % COLS) * W, top: Math.floor(i / COLS) * H + H - 24 },
    ];
  }),
);
await sharp({ create: { width: COLS * W, height: rows * H, channels: 3, background: "#000" } })
  .composite(tiles.flat())
  .jpeg({ quality: 80 })
  .toFile(out);
console.log(files.map((f, i) => `${i}: ${f}`).join("\n"));
