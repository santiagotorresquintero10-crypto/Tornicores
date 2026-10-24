/**
 * Brands carried by TORNIRACORES 2.
 *
 * DEMO DATA. The real list of brands has not been provided, so these are
 * placeholders, not manufacturers, partners or authorised distributions.
 * Replace each entry with a real brand: set `name`, add its logo file to
 * src/assets/brands/ and import it as `logo`, and link products to it via
 * `brandId` in products.ts. Set `catalogUrl` only if a real catalogue exists.
 */
export type Brand = {
  id: string;
  name: string;
  /** URL of the brand's logo image. Null = a neutral demo plate is drawn. */
  logo: string | null;
  /** Link to an official catalogue, when one exists. */
  catalogUrl: string | null;
  demo: boolean;
};

export const BRANDS: Brand[] = ["A", "B", "C", "D", "E", "F"].map((letter) => ({
  id: `demo-${letter.toLowerCase()}`,
  name: `Marca demo ${letter}`,
  logo: null,
  catalogUrl: null,
  demo: true,
}));

export const brandById = (id: string) => BRANDS.find((b) => b.id === id);

/**
 * Draws a neutral logo plate for a demo brand, as an SVG data URI, so the
 * curved carousel has something honest to show until real logos arrive.
 */
export function demoBrandPlate(brand: Brand, index: number): string {
  const grounds = ["#1c1f23", "#ffb900", "#262a30", "#f3f4f6", "#15171a", "#9ca3af"];
  const inks = ["#ffffff", "#08090b", "#ffb900", "#08090b", "#ffffff", "#08090b"];
  const g = grounds[index % grounds.length];
  const i = inks[index % inks.length];
  const letter = brand.name.slice(-1);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
<rect width="640" height="360" fill="${g}"/>
<g fill="none" stroke="${i}" stroke-width="10" opacity=".9">
<path d="M150 120 l40 -23 l40 23 v46 l-40 23 l-40 -23 z"/>
<circle cx="190" cy="143" r="14"/>
</g>
<text x="260" y="168" font-family="Archivo, Arial, sans-serif" font-weight="800" font-size="74" font-style="italic" fill="${i}">MARCA ${letter}</text>
<text x="150" y="250" font-family="Archivo, Arial, sans-serif" font-weight="600" font-size="26" letter-spacing="2" fill="${i}" opacity=".8">LOGO DE DEMOSTRACIÓN</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
