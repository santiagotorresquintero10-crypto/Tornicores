import { BUSINESS } from "@/config/business";

export type QuoteDraft = {
  name: string;
  phone: string;
  product: string;
  vehicle: string;
  quantity: string;
  notes: string;
  hasImage: boolean;
};

export const EMPTY_QUOTE: QuoteDraft = {
  name: "",
  phone: "",
  product: "",
  vehicle: "",
  quantity: "1",
  notes: "",
  hasImage: false,
};

/** The exact text the visitor will see in WhatsApp before sending it. */
export function quoteMessage(q: QuoteDraft): string {
  const lines = [
    `Hola ${BUSINESS.name}, quiero solicitar una cotización.`,
    "",
    `• Nombre: ${q.name.trim() || "—"}`,
    `• Teléfono: ${q.phone.trim() || "—"}`,
    `• Producto o referencia: ${q.product.trim() || "—"}`,
  ];
  if (q.vehicle) lines.push(`• Tipo de vehículo: ${q.vehicle}`);
  lines.push(`• Cantidad: ${q.quantity.trim() || "1"}`);
  if (q.notes.trim()) lines.push(`• Observaciones: ${q.notes.trim()}`);
  if (q.hasImage) lines.push("", "Adjunto una foto de la pieza.");
  return lines.join("\n");
}

export function whatsappUrl(text: string): string {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** A short one-line enquiry used by "Cotizar producto" buttons. */
export function productEnquiry(name: string, ref?: string) {
  return ref ? `${name} (ref. ${ref})` : name;
}
