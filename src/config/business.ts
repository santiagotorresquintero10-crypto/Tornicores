/**
 * Business facts for TORNIRACORES 2.
 * Only confirmed data lives here. Anything set to `null` is unknown and the
 * interface shows it as "pendiente" instead of inventing it.
 */
export const BUSINESS = {
  name: "TORNIRACORES 2",
  tagline: "Calidad y Servicio",

  /** WhatsApp in international format, digits only (Colombia +57). */
  whatsapp: "573148496437",
  whatsappDisplay: "+57 314 849 6437",
  email: "contacto@torniracores2.com",

  /** Street address and city. Unknown: set it to enable "Cómo llegar". */
  address: null as string | null,
  /**
   * Optional exact map link (Google Maps share URL). When null and an address
   * exists, a search link is built from the address.
   */
  mapsUrl: null as string | null,
  /** Opening hours as display text. Unknown until the client provides them. */
  hours: null as string | null,

  /**
   * Optional custom Spline scene for the hero (a .splinecode URL the business
   * owns or has rights to). Null = the built-in WebGL mechanical assembly.
   * Can also be set with VITE_SPLINE_SCENE in a .env file.
   */
  splineScene: (import.meta.env.VITE_SPLINE_SCENE as string | undefined) || null,
} as const;

export function mapsLink(): string | null {
  if (BUSINESS.mapsUrl) return BUSINESS.mapsUrl;
  if (BUSINESS.address)
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${BUSINESS.name} ${BUSINESS.address}`,
    )}`;
  return null;
}
