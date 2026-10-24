import type { CategoryId } from "./categories";
import type { PhotoId } from "./photos";

/**
 * DEMONSTRATION CATALOGUE.
 *
 * The real inventory has not been loaded. Every entry below is a sample of a
 * generic part type so the search, the product sheets and the quote flow can
 * be seen working. References start with "DEMO-", brands are demo
 * placeholders, and there are deliberately no prices, stock levels or
 * vehicle-specific compatibilities. Replace this file (or feed `PRODUCTS`
 * from an API) with the store's real data.
 */
export type VehicleType = "Automóvil" | "Camión / bus" | "Maquinaria / industria";

export const VEHICLE_TYPES: VehicleType[] = ["Automóvil", "Camión / bus", "Maquinaria / industria"];

export type Product = {
  id: string;
  name: string;
  /** Store reference. DEMO- prefix marks sample data. */
  ref: string;
  brandId: string;
  category: CategoryId;
  /** What this type of part is generally used for (not a compatibility claim). */
  use: string;
  /** Vehicle families where this TYPE of part is used. Not a fitment list. */
  vehicles: VehicleType[];
  photo: PhotoId;
  /** Extra search terms (synonyms used at the counter). */
  terms: string[];
  /** Only set when the store supplies them. */
  price?: string;
  availability?: string;
  compatibility?: string;
  featured?: boolean;
};

export const DEMO_CATALOG = true;

export const PRODUCTS: Product[] = [
  {
    id: "p01", name: "Perno hexagonal con tuerca", ref: "DEMO-TOR-001", brandId: "demo-a",
    category: "tornilleria", use: "Fijación general de piezas mecánicas", vehicles: ["Automóvil", "Camión / bus", "Maquinaria / industria"],
    photo: "perno-m12", terms: ["perno", "tornillo", "hexagonal", "tuerca", "m12", "fijacion"], featured: true,
  },
  {
    id: "p02", name: "Tornillo con tuerca hexagonal", ref: "DEMO-TOR-002", brandId: "demo-a",
    category: "tornilleria", use: "Uniones atornilladas de uso general", vehicles: ["Automóvil", "Maquinaria / industria"],
    photo: "tornillo-tuerca", terms: ["tornillo", "tuerca", "rosca"],
  },
  {
    id: "p03", name: "Juego de tornillos y tuercas", ref: "DEMO-TOR-003", brandId: "demo-b",
    category: "tornilleria", use: "Reposición de fijaciones en taller", vehicles: ["Automóvil", "Camión / bus", "Maquinaria / industria"],
    photo: "tornillos-tuercas", terms: ["tornillos", "tuercas", "kit", "surtido"],
  },
  {
    id: "p04", name: "Perno banjo", ref: "DEMO-TOR-004", brandId: "demo-c",
    category: "tornilleria", use: "Unión de líneas de fluido a componentes", vehicles: ["Automóvil", "Camión / bus", "Maquinaria / industria"],
    photo: "pernos-banjo", terms: ["banjo", "perno hueco", "freno", "combustible"], featured: true,
  },
  {
    id: "p05", name: "Disco de freno", ref: "DEMO-REP-001", brandId: "demo-d",
    category: "repuestos", use: "Sistema de freno de disco", vehicles: ["Automóvil"],
    photo: "disco-freno", terms: ["disco", "freno", "rotor", "mordaza", "caliper"], featured: true,
  },
  {
    id: "p06", name: "Bujía de encendido", ref: "DEMO-REP-002", brandId: "demo-e",
    category: "repuestos", use: "Encendido en motores a gasolina", vehicles: ["Automóvil"],
    photo: "bujia", terms: ["bujia", "encendido", "chispa", "motor"],
  },
  {
    id: "p07", name: "Cuerpo de aceleración", ref: "DEMO-REP-003", brandId: "demo-e",
    category: "repuestos", use: "Admisión de aire del motor", vehicles: ["Automóvil"],
    photo: "cuerpo-aceleracion", terms: ["cuerpo de aceleracion", "mariposa", "admision", "throttle"],
  },
  {
    id: "p08", name: "Amortiguador", ref: "DEMO-SUS-001", brandId: "demo-b",
    category: "suspension", use: "Control del rebote de la suspensión", vehicles: ["Automóvil", "Camión / bus"],
    photo: "amortiguador-montado", terms: ["amortiguador", "shock", "suspension"], featured: true,
  },
  {
    id: "p09", name: "Conjunto de suspensión delantera", ref: "DEMO-SUS-002", brandId: "demo-b",
    category: "suspension", use: "Suspensión delantera con resorte helicoidal", vehicles: ["Automóvil"],
    photo: "suspension-delantera", terms: ["resorte", "espiral", "suspension delantera", "brazo"],
  },
  {
    id: "p10", name: "Amortiguador industrial", ref: "DEMO-SUS-003", brandId: "demo-f",
    category: "suspension", use: "Absorción de impactos en maquinaria", vehicles: ["Maquinaria / industria"],
    photo: "amortiguador-corte", terms: ["amortiguador", "industrial", "impacto"],
  },
  {
    id: "p11", name: "Cámara de freno de resorte", ref: "DEMO-FAI-001", brandId: "demo-c",
    category: "frenos-aire", use: "Freno de servicio y de parqueo en frenos de aire", vehicles: ["Camión / bus"],
    photo: "camara-freno-aire", terms: ["camara", "pulmon", "freno de aire", "spring brake", "parqueo"], featured: true,
  },
  {
    id: "p12", name: "Válvula relevadora", ref: "DEMO-FAI-002", brandId: "demo-c",
    category: "frenos-aire", use: "Envía aire del tanque a las cámaras de freno", vehicles: ["Camión / bus"],
    photo: "valvula-relevadora", terms: ["valvula", "relevadora", "rele", "relay", "freno de aire"], featured: true,
  },
  {
    id: "p13", name: "Válvula de pedal", ref: "DEMO-FAI-003", brandId: "demo-d",
    category: "frenos-aire", use: "Mando del conductor en frenos de aire", vehicles: ["Camión / bus"],
    photo: "valvula-pedal", terms: ["valvula de pedal", "pedal", "foot valve", "freno de aire"],
  },
  {
    id: "p14", name: "Válvula de control de remolque", ref: "DEMO-FAI-004", brandId: "demo-d",
    category: "frenos-aire", use: "Frenado del remolque", vehicles: ["Camión / bus"],
    photo: "valvula-remolque", terms: ["valvula", "remolque", "trailer", "freno de aire"],
  },
  {
    id: "p15", name: "Freno de disco neumático", ref: "DEMO-FAI-005", brandId: "demo-c",
    category: "frenos-aire", use: "Frenado de ejes en vehículos pesados", vehicles: ["Camión / bus"],
    photo: "freno-disco-aire", terms: ["freno de disco", "neumatico", "eje", "pesado"],
  },
  {
    id: "p16", name: "Racor hidráulico", ref: "DEMO-HID-001", brandId: "demo-a",
    category: "hidraulica", use: "Unión de mangueras hidráulicas", vehicles: ["Camión / bus", "Maquinaria / industria"],
    photo: "racores-hidraulicos", terms: ["racor", "conexion", "acople", "terminal", "hidraulico"], featured: true,
  },
  {
    id: "p17", name: "Cilindro hidráulico", ref: "DEMO-HID-002", brandId: "demo-f",
    category: "hidraulica", use: "Movimiento lineal en equipos hidráulicos", vehicles: ["Maquinaria / industria"],
    photo: "cilindro-hidraulico", terms: ["cilindro", "piston", "gato", "hidraulico"],
  },
  {
    id: "p18", name: "Conexión banjo con arandelas", ref: "DEMO-HID-003", brandId: "demo-a",
    category: "hidraulica", use: "Conexión de líneas de fluido", vehicles: ["Automóvil", "Camión / bus", "Maquinaria / industria"],
    photo: "conexion-banjo", terms: ["banjo", "arandela de cobre", "conexion"],
  },
  {
    id: "p19", name: "Juego de llaves combinadas", ref: "DEMO-HER-001", brandId: "demo-e",
    category: "herramientas", use: "Ajuste de tornillería en taller", vehicles: ["Automóvil", "Camión / bus", "Maquinaria / industria"],
    photo: "llaves-combinadas", terms: ["llaves", "combinadas", "boca", "estrella", "mixtas"], featured: true,
  },
  {
    id: "p20", name: "Dados con extensión", ref: "DEMO-HER-002", brandId: "demo-e",
    category: "herramientas", use: "Ajuste con maneral o rache", vehicles: ["Automóvil", "Camión / bus", "Maquinaria / industria"],
    photo: "llave-copa", terms: ["dados", "copa", "extension", "rache", "ratchet"],
  },
  {
    id: "p21", name: "Maneral en T", ref: "DEMO-HER-003", brandId: "demo-f",
    category: "herramientas", use: "Aplicación de torque con dados", vehicles: ["Automóvil", "Camión / bus", "Maquinaria / industria"],
    photo: "maneral-t", terms: ["maneral", "palanca", "t"],
  },
  {
    id: "p22", name: "Manguera hidráulica", ref: "DEMO-MAN-001", brandId: "demo-b",
    category: "mangueras", use: "Conducción de aceite a presión", vehicles: ["Camión / bus", "Maquinaria / industria"],
    photo: "mangueras-maquina", terms: ["manguera", "hidraulica", "alta presion"], featured: true,
  },
  {
    id: "p23", name: "Manguera con codo", ref: "DEMO-MAN-002", brandId: "demo-b",
    category: "mangueras", use: "Conducción de fluidos con cambio de dirección", vehicles: ["Automóvil", "Maquinaria / industria"],
    photo: "mangueras-codos", terms: ["manguera", "codo", "radiador", "agua"],
  },
  {
    id: "p24", name: "Abrazadera de tornillo", ref: "DEMO-ACC-001", brandId: "demo-a",
    category: "accesorios", use: "Sujeción de mangueras", vehicles: ["Automóvil", "Camión / bus", "Maquinaria / industria"],
    photo: "abrazaderas", terms: ["abrazadera", "sinfin", "clamp", "manguera"],
  },
];

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);
