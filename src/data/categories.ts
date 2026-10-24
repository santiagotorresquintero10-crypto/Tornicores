import type { PhotoId } from "./photos";

/**
 * Product families. Proposed classification from the brief: validate it
 * against the real inventory before launch.
 */
export type CategoryId =
  | "tornilleria"
  | "repuestos"
  | "suspension"
  | "frenos-aire"
  | "hidraulica"
  | "herramientas"
  | "mangueras"
  | "accesorios";

export type Category = {
  id: CategoryId;
  name: string;
  /** Shorter label for tight places (the façade pillars). */
  short?: string;
  /** One line, what the family covers. */
  summary: string;
  /** Typical items in the family (generic part types, not stock). */
  items: string[];
  /** Folder colours: the family's own identity inside the brand palette. */
  folder: { back: string; tab: string; front: string; ink: string };
  photos: { id: PhotoId; title: string }[];
};

const YELLOW = { back: "#e5a400", tab: "#c98f00", front: "#ffb900", ink: "#08090b" };
const BLACK = { back: "#22252a", tab: "#15171a", front: "#30343b", ink: "#ffffff" };
const STEEL = { back: "#7d838d", tab: "#646a73", front: "#a3a9b2", ink: "#08090b" };
const WHITE = { back: "#d9dde3", tab: "#b9bec6", front: "#f3f4f6", ink: "#08090b" };

export const CATEGORIES: Category[] = [
  {
    id: "tornilleria",
    name: "Tornillería",
    summary: "Tornillos, tuercas, arandelas, pernos y elementos de fijación.",
    items: ["Tornillos", "Tuercas", "Arandelas", "Pernos", "Pernos banjo"],
    folder: YELLOW,
    photos: [
      { id: "perno-m12", title: "Perno hexagonal con tuerca" },
      { id: "tornillos-tuercas", title: "Tornillos y tuercas" },
      { id: "pernos-banjo", title: "Pernos banjo" },
      { id: "tornillo-tuerca", title: "Tornillo con tuerca" },
    ],
  },
  {
    id: "repuestos",
    name: "Repuestos automotrices",
    short: "Repuestos",
    summary: "Componentes mecánicos, piezas de mantenimiento y repuestos generales.",
    items: ["Bujías", "Discos de freno", "Cuerpos de aceleración", "Piezas de mantenimiento"],
    folder: BLACK,
    photos: [
      { id: "disco-freno", title: "Disco de freno y mordaza" },
      { id: "bujia", title: "Bujía" },
      { id: "cuerpo-aceleracion", title: "Cuerpo de aceleración" },
    ],
  },
  {
    id: "suspension",
    name: "Suspensión",
    summary: "Amortiguadores, bujes, terminales y componentes de suspensión.",
    items: ["Amortiguadores", "Bujes", "Terminales", "Resortes"],
    folder: STEEL,
    photos: [
      { id: "suspension-delantera", title: "Suspensión delantera con resorte" },
      { id: "amortiguador-montado", title: "Amortiguador montado" },
      { id: "amortiguador-corte", title: "Amortiguador en corte" },
    ],
  },
  {
    id: "frenos-aire",
    name: "Frenos de aire",
    summary: "Válvulas, conexiones, cámaras y componentes neumáticos.",
    items: ["Cámaras de freno", "Válvulas relevadoras", "Válvulas de pedal", "Conexiones neumáticas"],
    folder: YELLOW,
    photos: [
      { id: "camara-freno-aire", title: "Cámara de freno de resorte" },
      { id: "valvula-relevadora", title: "Válvula relevadora" },
      { id: "valvula-pedal", title: "Válvula de pedal" },
      { id: "valvula-remolque", title: "Válvula de remolque" },
      { id: "freno-disco-aire", title: "Freno de disco neumático" },
    ],
  },
  {
    id: "hidraulica",
    name: "Hidráulica",
    summary: "Conexiones, racores, accesorios y componentes hidráulicos.",
    items: ["Racores", "Conexiones banjo", "Cilindros", "Adaptadores"],
    folder: BLACK,
    photos: [
      { id: "racores-hidraulicos", title: "Racores hidráulicos" },
      { id: "cilindro-hidraulico", title: "Cilindro hidráulico" },
      { id: "conexion-banjo", title: "Conexión banjo y arandelas" },
    ],
  },
  {
    id: "herramientas",
    name: "Herramientas",
    summary: "Herramientas manuales, llaves, dados y equipos de trabajo.",
    items: ["Llaves combinadas", "Dados", "Manerales", "Extensiones"],
    folder: WHITE,
    photos: [
      { id: "llaves-combinadas", title: "Llaves combinadas" },
      { id: "llave-copa", title: "Dados y extensión" },
      { id: "maneral-t", title: "Maneral en T" },
    ],
  },
  {
    id: "mangueras",
    name: "Mangueras",
    summary: "Mangueras industriales, hidráulicas, automotrices y conexiones.",
    items: ["Mangueras hidráulicas", "Mangueras industriales", "Codos", "Acoples"],
    folder: STEEL,
    photos: [
      { id: "mangueras-maquina", title: "Mangueras hidráulicas en máquina" },
      { id: "mangueras-codos", title: "Mangueras, codos y anillos" },
      { id: "abrazaderas", title: "Abrazaderas" },
    ],
  },
  {
    id: "accesorios",
    name: "Accesorios",
    summary: "Complementos y accesorios para vehículos y aplicaciones industriales.",
    items: ["Abrazaderas", "Iluminación", "Complementos de taller"],
    folder: BLACK,
    photos: [
      { id: "abrazaderas", title: "Abrazaderas de tornillo" },
      { id: "farol-grabado", title: "Farol (grabado de archivo)" },
    ],
  },
];

export const categoryById = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!;
