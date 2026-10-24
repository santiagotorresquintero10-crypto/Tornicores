// Writes each shipped image's origin into the file (impeccable provenance).
// Run after scripts/prepare-brand.mjs or scripts/prepare-photos.mjs.
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const CLI = path.join(homedir(), ".claude/skills/impeccable/scripts", process.platform === "win32" ? "impeccable.cmd" : "impeccable");

const ORIGIN = {
  "perno-m12": '"Late 1900s zinc plated M12 8 G hex head machine bolt and nut" by R. Henrik Nilsson, CC BY 4.0, Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=197596331',
  "tornillos-tuercas": '"Silver hex nuts bolt", CC0, rawpixel, https://www.rawpixel.com/image/6018763',
  "tornillo-tuerca": '"Silver hex nuts bolt", CC0, rawpixel, https://www.rawpixel.com/image/6018761',
  "pernos-banjo": '"Banjo bolts" by Alison Cassidy, CC BY-SA 3.0, Wikimedia Commons, https://commons.wikimedia.org/wiki/File:Banjo_bolts.jpg',
  bujia: '"Mid 20th century Beru spark plug 175 18 U2" by R. Henrik Nilsson, CC BY 4.0, Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=195503086',
  "disco-freno": '"Porsche Boxster 986 Ph. 2 brake disc" by Friday83260, CC BY-SA 4.0, Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=36116030',
  "cuerpo-aceleracion": '"Car engine part shows details of throttle body" by Shixart1985, CC BY 2.0, Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=186975290',
  "suspension-delantera": '"Deuce front suspension detail" by Trekphiler, CC BY 3.0, Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=4525127',
  "amortiguador-montado": '"Fiat Panda 2003 suspension shock absorbers" by Pava, CC BY-SA 3.0, Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=25621210',
  "amortiguador-corte": '"Shock absorber demonstration example SDVN 12 50" by R. Henrik Nilsson, CC BY 4.0, Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=176435730',
  "camara-freno-aire": '"Spring brake air cylinder" by Panoha, CC BY-SA 3.0, Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=3663688',
  "valvula-relevadora": '"Air brakes relay valve" by Panoha, CC BY-SA 3.0, Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=3663594',
  "valvula-remolque": '"Trailer brake relay valve" by Panoha, CC BY-SA 3.0, Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=3663396',
  "valvula-pedal": '"Air foot valve" by Panoha, CC BY-SA 3.0, Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=3663619',
  "freno-disco-aire": '"Air disc brake" by Panoha, CC BY-SA 3.0, Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=3639003',
  "racores-hidraulicos": '"Hydraulic hose fittings" by Jstapko, CC BY-SA 3.0, Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=22893146',
  "conexion-banjo": '"Banjo Fitting Example" by Gregzsidisin, CC BY-SA 4.0, Wikimedia Commons, https://commons.wikimedia.org/wiki/File:Banjo_Fitting_Example.jpg',
  "cilindro-hidraulico": '"Hydraulic cylinder" by S.J. de Waard, CC BY 2.5, Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=10186219',
  "llave-copa": '"Socket wrenches 002" by Ocdp, CC0, Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=177204747',
  "maneral-t": '"Socket wrenches 003" by Ocdp, CC0, Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=177204774',
  "llaves-combinadas": '"Gedore No. 7 combination wrenches 6-19 mm" by Lucasbosch, CC BY-SA 3.0, Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=55038798',
  "mangueras-maquina": '"Close-up view of various hydraulic hoses" by nenadstojkovicart, CC BY 2.0, Flickr, https://www.flickr.com/photos/202846129@N03/54553064876',
  "mangueras-codos": '"Hoses, Clamps, Rings, Elbows" by cogdogblog, CC BY 2.0, Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=56977068',
  abrazaderas: '"Hoseclamps.screw.agr" by ArnoldReinhold, CC BY-SA 3.0, Wikimedia Commons, https://commons.wikimedia.org/wiki/File:Hoseclamps.screw.agr.jpg',
  "farol-grabado": '"Fire Truck Headlight" by Florence Huston, CC0, Wikimedia Commons, https://commons.wikimedia.org/w/index.php?curid=82166369',
};

const embed = (file, text) => execFileSync(CLI, ["embed-prompt", file, "--prompt", text], { stdio: "ignore", shell: process.platform === "win32" });

for (const f of readdirSync("src/assets/photos")) {
  const key = f.replace(/(-sq)?\.webp$/, "");
  if (!ORIGIN[key]) throw new Error(`No origin recorded for ${f}`);
  embed(`src/assets/photos/${f}`, `Sourced photograph (open licence, resized to WebP): ${ORIGIN[key]}`);
}
for (const f of readdirSync("src/assets/brand")) {
  const text = f.startsWith("logo")
    ? "Pre-existing: original TORNIRACORES 2 logo supplied by the client (_source/logo-original.png), trimmed and black made transparent by scripts/prepare-brand.mjs; artwork unaltered."
    : "Pre-existing: photograph of the TORNIRACORES 2 storefront supplied by the client (_source/fachada-original.png), resized to WebP; image unaltered.";
  embed(`src/assets/brand/${f}`, text);
}
console.log("provenance embedded");
