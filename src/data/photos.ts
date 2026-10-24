/**
 * Reference photographs of each product family, from open collections
 * (Wikimedia Commons, Flickr, rawpixel) under licences that allow commercial
 * use. They show the kind of part, never TORNIRACORES 2's own stock; replace
 * them with the store's photographs when available. Credits: ./credits.ts
 */
const full = import.meta.glob("../assets/photos/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function pick(name: string, square = false): string {
  const key = `../assets/photos/${name}${square ? "-sq" : ""}.webp`;
  const url = full[key];
  if (!url) throw new Error(`Missing photo: ${key}`);
  return url;
}

export type PhotoId =
  | "perno-m12"
  | "tornillos-tuercas"
  | "tornillo-tuerca"
  | "pernos-banjo"
  | "bujia"
  | "disco-freno"
  | "cuerpo-aceleracion"
  | "suspension-delantera"
  | "amortiguador-montado"
  | "amortiguador-corte"
  | "camara-freno-aire"
  | "valvula-relevadora"
  | "valvula-remolque"
  | "valvula-pedal"
  | "freno-disco-aire"
  | "racores-hidraulicos"
  | "conexion-banjo"
  | "cilindro-hidraulico"
  | "llave-copa"
  | "maneral-t"
  | "llaves-combinadas"
  | "mangueras-maquina"
  | "mangueras-codos"
  | "abrazaderas"
  | "farol-grabado";

export const photo = (id: PhotoId) => pick(id);
export const photoSquare = (id: PhotoId) => pick(id, true);
