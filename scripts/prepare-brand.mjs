// Prepares the client's original brand files for the web without redrawing them.
// - Logo: trims the black square around it and turns the black ground into
//   transparency (alpha = brightest channel, colour un-premultiplied), so the
//   original lettering, colours and tagline sit on any dark surface unchanged.
// - Façade: resized WebP copies; the photograph itself is not altered.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = "src/assets/brand";
await mkdir(OUT, { recursive: true });

async function logo() {
  const trimmed = await sharp("_source/logo-original.png")
    .removeAlpha()
    .trim({ background: "#000000", threshold: 24 })
    .toBuffer({ resolveWithObject: true });
  const { data, info } = await sharp(trimmed.data)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += info.channels, j += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const m = Math.max(r, g, b);
    // Below a small floor the pixel is JPEG noise in the black ground.
    const a = m < 14 ? 0 : Math.min(255, Math.round(((m - 14) / (255 - 14)) * 255 * 1.08));
    const k = a ? 255 / Math.max(m, 1) : 0;
    out[j] = Math.min(255, Math.round(r * k));
    out[j + 1] = Math.min(255, Math.round(g * k));
    out[j + 2] = Math.min(255, Math.round(b * k));
    out[j + 3] = a;
  }
  const img = sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } });
  await img.clone().png({ compressionLevel: 9 }).toFile(`${OUT}/logo-torniracores.png`);
  await img.clone().resize({ width: 520 }).webp({ quality: 92, alphaQuality: 100 }).toFile(`${OUT}/logo-torniracores-520.webp`);
  console.log("logo", info.width, "x", info.height);
}

async function facade() {
  for (const w of [960, 1444]) {
    await sharp("_source/fachada-original.png")
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(`${OUT}/fachada-${w}.webp`);
  }
  const meta = await sharp("_source/fachada-original.png").metadata();
  console.log("facade", meta.width, "x", meta.height);
}

await logo();
await facade();
