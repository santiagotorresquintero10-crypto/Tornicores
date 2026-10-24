import type { CategoryId } from "./categories";

/**
 * Vehicle systems for the interactive schematic (a two-axle truck seen from
 * the side, cab to the right). Positions are in the SVG's 1000 × 440 space and
 * mark where each component sits on a typical truck; they are a teaching
 * diagram, not a service drawing for any specific model.
 */
export type SystemId = "frenos" | "suspension" | "direccion" | "tornilleria" | "transmision";

export type SystemPart = {
  id: string;
  name: string;
  /** Points on the drawing; a part fitted at both axles has two. */
  at: { x: number; y: number }[];
  text: string;
  category: CategoryId;
  /** Search query sent to the part finder. */
  query: string;
};

export type VehicleSystem = {
  id: SystemId;
  name: string;
  lead: string;
  /** Path ids on the drawing that light up with this system. */
  paths: string[];
  parts: SystemPart[];
};

export type VehicleKind = "camion" | "auto";

/**
 * A typical front-engine car seen from the side, nose to the right
 * (front wheel x 760, rear wheel x 250). Hydraulic brakes, MacPherson-style
 * front suspension, rack-and-pinion steering. Teaching diagram, not a
 * service drawing for any specific model.
 */
export const CAR_SYSTEMS: VehicleSystem[] = [
  {
    id: "frenos",
    name: "Frenos hidráulicos",
    lead: "El pedal empuja líquido de frenos desde la bomba; la presión llega por las líneas a cada rueda y aprieta las pastillas contra el disco.",
    paths: ["brake-line"],
    parts: [
      {
        id: "bomba-freno", name: "Bomba de freno y servofreno", at: [{ x: 668, y: 212 }], category: "repuestos", query: "freno",
        text: "Detrás del motor, en el lado del conductor. El servofreno multiplica la fuerza del pie y la bomba (cilindro maestro) la convierte en presión hidráulica.",
      },
      {
        id: "lineas-freno", name: "Líneas y mangueras de freno", at: [{ x: 470, y: 318 }], category: "mangueras", query: "manguera",
        text: "Tubos rígidos bajo la carrocería y mangueras flexibles en cada rueda llevan el líquido sin dejar que se expanda.",
      },
      {
        id: "mordazas", name: "Mordazas y pastillas", at: [{ x: 790, y: 322 }, { x: 280, y: 322 }], category: "repuestos", query: "disco de freno",
        text: "La presión mueve el pistón de la mordaza y las pastillas aprietan el disco. Atrás algunos autos usan tambores en lugar de discos.",
      },
      {
        id: "discos", name: "Discos de freno", at: [{ x: 760, y: 352 }, { x: 250, y: 352 }], category: "repuestos", query: "disco de freno",
        text: "Giran con la rueda y convierten el movimiento en calor al ser frenados. Se revisan por espesor mínimo y alabeo.",
      },
    ],
  },
  {
    id: "suspension",
    name: "Suspensión",
    lead: "Cada rueda sube y baja por su cuenta: el resorte sostiene el peso y el amortiguador controla el rebote.",
    paths: ["springs"],
    parts: [
      {
        id: "amortiguadores", name: "Amortiguadores", at: [{ x: 768, y: 252 }, { x: 258, y: 262 }], category: "suspension", query: "amortiguador",
        text: "Adelante suelen ir dentro de la columna MacPherson junto con el resorte. Frenan el rebote para que la llanta no pierda contacto con la vía.",
      },
      {
        id: "espirales", name: "Resortes (espirales)", at: [{ x: 742, y: 286 }, { x: 232, y: 294 }], category: "suspension", query: "suspension",
        text: "Sostienen el peso del vehículo y absorben los golpes del camino.",
      },
      {
        id: "bujes-rotulas", name: "Bujes y rótulas", at: [{ x: 712, y: 352 }], category: "suspension", query: "suspension",
        text: "Unen las tijeras al chasis y a la rueda. Los bujes aíslan la vibración y las rótulas permiten que la rueda gire y suba al mismo tiempo.",
      },
    ],
  },
  {
    id: "direccion",
    name: "Dirección hidráulica",
    lead: "En autos con dirección hidráulica, una bomba presuriza aceite que ayuda a mover la cremallera.",
    paths: ["hydraulic-line"],
    parts: [
      {
        id: "bomba-direccion", name: "Bomba de dirección", at: [{ x: 842, y: 236 }], category: "hidraulica", query: "hidraulico",
        text: "La mueve la correa del motor y genera la presión de asistencia. Muchos autos nuevos usan dirección eléctrica y no la tienen.",
      },
      {
        id: "mangueras-direccion", name: "Mangueras de presión y retorno", at: [{ x: 806, y: 286 }], category: "mangueras", query: "manguera",
        text: "Llevan el aceite de la bomba a la cremallera y lo devuelven al depósito.",
      },
      {
        id: "cremallera", name: "Cremallera y terminales", at: [{ x: 728, y: 316 }], category: "repuestos", query: "repuestos",
        text: "Convierte el giro del timón en movimiento lateral; los terminales lo transmiten a cada rueda delantera.",
      },
    ],
  },
  {
    id: "tornilleria",
    name: "Tornillería",
    lead: "Fijaciones que trabajan con vibración, calor y carga constante.",
    paths: [],
    parts: [
      {
        id: "tuercas-rueda", name: "Pernos y tuercas de rueda", at: [{ x: 250, y: 352 }, { x: 760, y: 352 }], category: "tornilleria", query: "perno",
        text: "Sujetan la rueda al buje. Se aprietan en cruz y al torque que indica el fabricante.",
      },
      {
        id: "tornillos-suspension", name: "Tornillería de suspensión", at: [{ x: 742, y: 312 }], category: "tornilleria", query: "tornillo",
        text: "Pernos de tijeras, columnas y barras estabilizadoras; muchos son de grado específico y se cambian si se deforman.",
      },
      {
        id: "tornillos-motor", name: "Tornillos de motor y soportes", at: [{ x: 806, y: 252 }], category: "tornilleria", query: "tornillo",
        text: "Fijan el motor, la caja y sus soportes a la carrocería.",
      },
    ],
  },
  {
    id: "transmision",
    name: "Componentes mecánicos",
    lead: "Piezas de desgaste que se cambian por mantenimiento.",
    paths: ["exhaust"],
    parts: [
      {
        id: "clutch", name: "Kit de clutch", at: [{ x: 690, y: 266 }], category: "repuestos", query: "repuestos",
        text: "En autos mecánicos: disco, prensa y balinera conectan y desconectan el motor de la caja.",
      },
      {
        id: "retenedores", name: "Retenedores", at: [{ x: 640, y: 296 }], category: "repuestos", query: "repuestos",
        text: "Sellos que evitan fugas de aceite en el motor, la caja y los ejes.",
      },
      {
        id: "mofle", name: "Mofle", at: [{ x: 160, y: 318 }], category: "accesorios", query: "accesorios",
        text: "Silenciador al final del escape: reduce el ruido de los gases del motor.",
      },
    ],
  },
];

export const SYSTEMS: VehicleSystem[] = [
  {
    id: "frenos",
    name: "Frenos de aire",
    lead: "El motor mueve un compresor; el aire se guarda en tanques y el pedal decide cuánto llega a cada rueda.",
    paths: ["air-line"],
    parts: [
      {
        id: "compresor", name: "Compresor de aire", at: [{ x: 812, y: 236 }], category: "frenos-aire", query: "freno de aire",
        text: "Lo acciona el motor. Comprime el aire que alimenta todo el sistema de frenos.",
      },
      {
        id: "tanques", name: "Tanques de aire", at: [{ x: 520, y: 300 }], category: "frenos-aire", query: "freno de aire",
        text: "Almacenan el aire comprimido para que haya reserva en cada frenada.",
      },
      {
        id: "pedal", name: "Válvula de pedal", at: [{ x: 872, y: 196 }], category: "frenos-aire", query: "valvula de pedal",
        text: "Está en la cabina. Cuanto más se pisa, más presión de aire envía hacia los frenos.",
      },
      {
        id: "relevadora", name: "Válvula relevadora", at: [{ x: 330, y: 262 }], category: "frenos-aire", query: "valvula relevadora",
        text: "Va cerca del eje trasero. Toma aire del tanque y lo entrega rápido a las cámaras cuando el pedal lo ordena.",
      },
      {
        id: "camaras", name: "Cámaras de freno", at: [{ x: 238, y: 330 }, { x: 760, y: 330 }], category: "frenos-aire", query: "camara de freno",
        text: "Convierten la presión del aire en fuerza que acciona el freno. Las de resorte, usadas en el eje trasero, también hacen de freno de parqueo.",
      },
    ],
  },
  {
    id: "suspension",
    name: "Suspensión",
    lead: "Une los ejes al chasis, soporta la carga y mantiene las llantas en contacto con la vía.",
    paths: ["springs"],
    parts: [
      {
        id: "ballestas", name: "Ballestas", at: [{ x: 262, y: 292 }, { x: 782, y: 292 }], category: "suspension", query: "suspension",
        text: "Hojas de acero superpuestas que soportan el peso y se flexionan con las irregularidades del camino.",
      },
      {
        id: "amortiguadores", name: "Amortiguadores", at: [{ x: 312, y: 300 }, { x: 832, y: 300 }], category: "suspension", query: "amortiguador",
        text: "Frenan el rebote de la ballesta o del resorte para que el vehículo no siga oscilando.",
      },
      {
        id: "bujes", name: "Bujes", at: [{ x: 200, y: 284 }, { x: 722, y: 284 }], category: "suspension", query: "suspension",
        text: "Piezas de caucho o poliuretano en los puntos de pivote. Absorben vibración y evitan el contacto metal con metal.",
      },
    ],
  },
  {
    id: "direccion",
    name: "Hidráulica de dirección",
    lead: "Una bomba presuriza aceite que ayuda a girar las ruedas delanteras con poco esfuerzo.",
    paths: ["hydraulic-line"],
    parts: [
      {
        id: "bomba", name: "Bomba de dirección", at: [{ x: 780, y: 226 }], category: "hidraulica", query: "hidraulico",
        text: "La mueve el motor y genera la presión de aceite para la asistencia de la dirección.",
      },
      {
        id: "mangueras", name: "Mangueras de presión y retorno", at: [{ x: 846, y: 262 }], category: "mangueras", query: "manguera hidraulica",
        text: "Llevan el aceite a presión hasta la caja y lo devuelven al depósito.",
      },
      {
        id: "racores", name: "Racores y conexiones", at: [{ x: 890, y: 252 }], category: "hidraulica", query: "racor",
        text: "Unen las mangueras con la bomba y la caja sin fugas, aun con alta presión.",
      },
    ],
  },
  {
    id: "tornilleria",
    name: "Tornillería",
    lead: "Todo lo anterior se mantiene unido por fijaciones que trabajan bajo vibración y carga constante.",
    paths: [],
    parts: [
      {
        id: "tuercas-rueda", name: "Pernos y tuercas de rueda", at: [{ x: 262, y: 352 }, { x: 782, y: 352 }], category: "tornilleria", query: "perno",
        text: "Sujetan la rueda al buje. Se aprietan en cruz y al torque que indica el fabricante del vehículo.",
      },
      {
        id: "abrazaderas-u", name: "Abrazaderas en U", at: [{ x: 280, y: 278 }, { x: 800, y: 278 }], category: "tornilleria", query: "perno",
        text: "Pernos en forma de U que fijan la ballesta al eje.",
      },
      {
        id: "pernos-chasis", name: "Pernos del chasis", at: [{ x: 600, y: 262 }], category: "tornilleria", query: "tornillo",
        text: "Unen travesaños, soportes y accesorios al bastidor.",
      },
    ],
  },
  {
    id: "transmision",
    name: "Componentes mecánicos",
    lead: "Piezas de desgaste que se cambian por mantenimiento y que se venden en la tienda.",
    paths: ["exhaust"],
    parts: [
      {
        id: "clutch", name: "Kit de clutch", at: [{ x: 712, y: 250 }], category: "repuestos", query: "repuestos",
        text: "Disco, prensa y balinera. Conectan y desconectan el motor de la caja para cambiar de marcha.",
      },
      {
        id: "retenedores", name: "Retenedores", at: [{ x: 262, y: 322 }], category: "repuestos", query: "repuestos",
        text: "Sellos que evitan fugas de aceite o grasa en ejes, bujes y cajas.",
      },
      {
        id: "mofle", name: "Mofle", at: [{ x: 600, y: 300 }], category: "accesorios", query: "accesorios",
        text: "Silenciador del escape: reduce el ruido de los gases que salen del motor.",
      },
    ],
  },
];
