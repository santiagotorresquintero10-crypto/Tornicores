// Converts the chosen open-licence reference photos into web sizes.
// Sources and licences live in src/data/credits.ts (shown in the footer).
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = "src/assets/photos";
await mkdir(OUT, { recursive: true });

/** [source file, output name] */
const PICKS = [
  ["_source/found/late-1900s-zinc-plated-m12-8-g.jpg", "perno-m12"],
  ["_source/found/silver-hex-nuts-bolt-2.webp", "tornillos-tuercas"],
  ["_source/found/silver-hex-nuts-bolt.webp", "tornillo-tuerca"],
  ["_source/found/banjo-bolts.jpg", "pernos-banjo"],
  ["_source/found/mid-20th-century-beru-spark-plug-175.jpg", "bujia"],
  ["_source/found/porsche-boxster-986-ph-2-brake-disc.jpg", "disco-freno"],
  ["_source/found/car-engine-part-shows-details-of-throttle.jpg", "cuerpo-aceleracion"],
  ["_source/found/deuce-front-suspension-detail.jpg", "suspension-delantera"],
  ["_source/found/13-italy-fiat-panda-2003-suspension-shock.jpg", "amortiguador-montado"],
  ["_source/found/shock-absorber-demonstration-example-sdvn-12-50.jpg", "amortiguador-corte"],
  ["_source/found/spring-brake-air-cylinder.jpg", "camara-freno-aire"],
  ["_source/found/air-brakes-relay-valve.jpg", "valvula-relevadora"],
  ["_source/found/trailer-brake-relay-valve.jpg", "valvula-remolque"],
  ["_source/found/air-foot-valve.jpg", "valvula-pedal"],
  ["_source/found/air-disc-brake.jpg", "freno-disco-aire"],
  ["_source/found/hydraulic-hose-fittings.jpg", "racores-hidraulicos"],
  ["_source/found/banjo-fitting-example.jpg", "conexion-banjo"],
  ["_source/found2/hydraulic-cylinder.jpg", "cilindro-hidraulico"],
  ["_source/found/socket-wrenches-002.jpg", "llave-copa"],
  ["_source/found/socket-wrenches-003.jpg", "maneral-t"],
  ["_source/found/gedore-no-7-combination-wrenches-6-19.jpg", "llaves-combinadas"],
  ["_source/found/close-up-view-of-various-hydraulic-hoses.jpg", "mangueras-maquina"],
  ["_source/found/hoses-clamps-rings-elbows-8425900172.jpg", "mangueras-codos"],
  ["_source/found/hoseclamps-screw-agr.jpg", "abrazaderas"],
  ["_source/found2/fire-truck-headlight.jpg", "farol-grabado"],
];

for (const [src, name] of PICKS) {
  await sharp(src).rotate().resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 }).toFile(`${OUT}/${name}.webp`);
  await sharp(src).rotate().resize({ width: 720, height: 720, fit: "cover" }).webp({ quality: 72 }).toFile(`${OUT}/${name}-sq.webp`);
}
console.log(`${PICKS.length} photos written to ${OUT}`);
