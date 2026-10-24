import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

/* ── "Ingeniería en movimiento" ─────────────────────────────────────
 * A disc-brake corner built from real geometry, not a picture:
 * a ventilated, cross-drilled rotor with its hat, five wheel studs and
 * lug nuts, and a yellow two-piston-style caliper straddling the rotor
 * with its pads. Around it float the things the store sells: hex bolts
 * with helical threads, nuts, a washer and the gear from the logo.
 *
 * Behaviour
 * - Intro: the parts fly in from an exploded view and assemble.
 * - The rotor turns slowly (as a wheel would) while the caliper stays put.
 * - Scrolling the hero separates the assembly again; lug nuts unscrew as
 *   they travel out along their studs.
 * - Drag rotates the assembly; the key light follows the cursor.
 * - Rendering pauses off-screen and in hidden tabs; reduced motion starts
 *   assembled and stops the idle spin.
 * ─────────────────────────────────────────────────────────────────── */

export type SceneOptions = {
  reducedMotion: boolean;
  lowPower: boolean;
  onReady?: () => void;
};

export type SceneHandle = {
  /** 0 = top of the hero, 1 = hero scrolled away. */
  setScroll: (p: number) => void;
  dispose: () => void;
};

const TAU = Math.PI * 2;
const deg = (d: number) => (d * Math.PI) / 180;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

class HelixCurve extends THREE.Curve<THREE.Vector3> {
  constructor(private radius: number, private length: number, private turns: number) {
    super();
  }
  override getPoint(t: number, target = new THREE.Vector3()) {
    const a = t * this.turns * TAU;
    return target.set(Math.cos(a) * this.radius, t * this.length, Math.sin(a) * this.radius);
  }
}

function sectorShape(r1: number, r2: number, a0: number, a1: number) {
  const s = new THREE.Shape();
  s.moveTo(Math.cos(a0) * r2, Math.sin(a0) * r2);
  s.absarc(0, 0, r2, a0, a1, false);
  s.lineTo(Math.cos(a1) * r1, Math.sin(a1) * r1);
  s.absarc(0, 0, r1, a1, a0, true);
  s.closePath();
  return s;
}

function gearShape(teeth: number, rOuter: number, rRoot: number, hole: number) {
  const s = new THREE.Shape();
  const step = TAU / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const pts: [number, number][] = [
      [rRoot, a],
      [rOuter, a + step * 0.18],
      [rOuter, a + step * 0.48],
      [rRoot, a + step * 0.66],
    ];
    pts.forEach(([r, ang], k) => {
      const x = Math.cos(ang) * r;
      const y = Math.sin(ang) * r;
      if (i === 0 && k === 0) s.moveTo(x, y);
      else s.lineTo(x, y);
    });
  }
  s.closePath();
  const h = new THREE.Path();
  h.absarc(0, 0, hole, 0, TAU, true);
  s.holes.push(h);
  // Six lightening holes, like the gear in the logo.
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU;
    const p = new THREE.Path();
    p.absarc(Math.cos(a) * (hole + (rRoot - hole) / 2), Math.sin(a) * (hole + (rRoot - hole) / 2), (rRoot - hole) * 0.24, 0, TAU, true);
    s.holes.push(p);
  }
  return s;
}

function extrude(shape: THREE.Shape, depth: number, curveSegments: number, bevel = 0.012) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    curveSegments,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
  });
  g.translate(0, 0, -depth / 2);
  return g;
}

type Part = {
  obj: THREE.Object3D;
  home: THREE.Vector3;
  away: THREE.Vector3;
  /** Extra spin applied about the part's own axis while exploding (screw motion). */
  screw?: number;
  homeRot?: number;
};

export function createMechanicalScene(
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  opts: SceneOptions,
): SceneHandle {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !opts.lowPower,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.lowPower ? 1.35 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  const envMap = pmrem.fromScene(envScene, 0.04).texture;
  scene.environment = envMap;
  scene.environmentIntensity = 0.8;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  camera.position.set(0, 0.35, 9.4);
  camera.lookAt(0, 0, 0);

  // ── Light: warm key that follows the cursor, yellow rim, cool fill ──
  const key = new THREE.SpotLight(0xfff4e0, 70, 30, deg(28), 0.6, 1.4);
  key.position.set(3.5, 3.5, 6);
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0xffb900, 2.4);
  rim.position.set(-5, 2.5, -4);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0x9fb4d0, 0.5);
  fill.position.set(-3, -2, 4);
  scene.add(fill);

  // ── Materials ──
  const disc = new THREE.MeshStandardMaterial({ color: 0x9aa1aa, metalness: 1, roughness: 0.3 });
  const iron = new THREE.MeshStandardMaterial({ color: 0x3b3f45, metalness: 0.75, roughness: 0.62 });
  const steel = new THREE.MeshStandardMaterial({ color: 0xc4c9d0, metalness: 1, roughness: 0.24 });
  const zinc = new THREE.MeshStandardMaterial({ color: 0xd9dde2, metalness: 1, roughness: 0.2 });
  const darkSteel = new THREE.MeshStandardMaterial({ color: 0x5d636b, metalness: 1, roughness: 0.38 });
  const paint = new THREE.MeshPhysicalMaterial({
    color: 0xffb900,
    metalness: 0.15,
    roughness: 0.36,
    clearcoat: 0.9,
    clearcoatRoughness: 0.18,
  });
  const pad = new THREE.MeshStandardMaterial({ color: 0x1a1b1e, metalness: 0.2, roughness: 0.9 });
  const materials = [disc, iron, steel, zinc, darkSteel, paint, pad];

  const seg = opts.lowPower ? 28 : 56;
  const geometries: THREE.BufferGeometry[] = [];
  const keep = <G extends THREE.BufferGeometry>(g: G) => (geometries.push(g), g);

  // ── Assembly ──
  const rig = new THREE.Group(); // whole corner; drag rotates this
  rig.rotation.set(deg(10), deg(-32), 0);
  scene.add(rig);

  const spinner = new THREE.Group(); // rotor, studs, nuts, cap: turns like a wheel
  rig.add(spinner);

  const parts: Part[] = [];
  const addPart = (obj: THREE.Object3D, parent: THREE.Object3D, away: THREE.Vector3, screw?: number) => {
    parent.add(obj);
    parts.push({ obj, home: obj.position.clone(), away, screw, homeRot: obj.rotation.z });
  };

  // Rotor friction rings, cross-drilled in groups of three.
  const ringShape = () => {
    const s = new THREE.Shape();
    s.absarc(0, 0, 1.6, 0, TAU, false);
    const inner = new THREE.Path();
    inner.absarc(0, 0, 0.96, 0, TAU, true);
    s.holes.push(inner);
    const groups = opts.lowPower ? 8 : 10;
    for (let i = 0; i < groups; i++) {
      const a = (i / groups) * TAU;
      [
        [1.13, 0],
        [1.29, 0.085],
        [1.45, 0.17],
      ].forEach(([r, off]) => {
        const p = new THREE.Path();
        p.absarc(Math.cos(a + off) * r, Math.sin(a + off) * r, 0.045, 0, TAU, true);
        s.holes.push(p);
      });
    }
    return s;
  };
  const ringGeo = keep(extrude(ringShape(), 0.09, seg, 0.01));
  const outerRing = new THREE.Mesh(ringGeo, disc);
  outerRing.position.z = 0.13;
  const innerRing = new THREE.Mesh(ringGeo, disc);
  innerRing.position.z = -0.13;
  const rotor = new THREE.Group();
  rotor.add(outerRing, innerRing);

  // Cooling vanes between the rings.
  const vaneGeo = keep(new THREE.BoxGeometry(0.6, 0.035, 0.17));
  const vanes = opts.lowPower ? 24 : 36;
  for (let i = 0; i < vanes; i++) {
    const a = (i / vanes) * TAU;
    const v = new THREE.Mesh(vaneGeo, iron);
    v.position.set(Math.cos(a) * 1.28, Math.sin(a) * 1.28, 0);
    v.rotation.z = a;
    rotor.add(v);
  }

  // Hat: wall + face with centre bore and five stud holes.
  const wall = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.97, 0.97, 0.34, seg, 1, true)), darkSteel);
  wall.rotation.x = Math.PI / 2;
  wall.position.z = 0.3;
  const hatShape = new THREE.Shape();
  hatShape.absarc(0, 0, 0.99, 0, TAU, false);
  const bore = new THREE.Path();
  bore.absarc(0, 0, 0.34, 0, TAU, true);
  hatShape.holes.push(bore);
  const studAngles = Array.from({ length: 5 }, (_, i) => (i / 5) * TAU + deg(90));
  studAngles.forEach((a) => {
    const p = new THREE.Path();
    p.absarc(Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0.07, 0, TAU, true);
    hatShape.holes.push(p);
  });
  const hat = new THREE.Mesh(keep(extrude(hatShape, 0.08, seg, 0.012)), darkSteel);
  hat.position.z = 0.48;
  rotor.add(wall, hat);
  addPart(rotor, spinner, new THREE.Vector3(0, 0, 0));

  // Hub (behind the hat) with bearing cap.
  const hub = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.33, 0.36, 0.5, seg)), iron);
  hub.rotation.x = Math.PI / 2;
  hub.position.z = 0.48;
  addPart(hub, spinner, new THREE.Vector3(0, 0, -0.6));
  const cap = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.22, 0.26, 0.2, seg)), steel);
  cap.rotation.x = Math.PI / 2;
  cap.position.z = 0.78;
  addPart(cap, spinner, new THREE.Vector3(0, 0, 1.9));

  // Studs and lug nuts.
  const studGeo = keep(new THREE.CylinderGeometry(0.055, 0.055, 0.5, 16));
  const nutGeo = keep(new THREE.CylinderGeometry(0.115, 0.125, 0.16, 6));
  const nutFace = keep(new THREE.CylinderGeometry(0.075, 0.075, 0.165, 18));
  studAngles.forEach((a) => {
    const x = Math.cos(a) * 0.62;
    const y = Math.sin(a) * 0.62;
    const stud = new THREE.Mesh(studGeo, steel);
    stud.rotation.x = Math.PI / 2;
    stud.position.set(x, y, 0.66);
    spinner.add(stud);

    const nut = new THREE.Group();
    const body = new THREE.Mesh(nutGeo, zinc);
    body.rotation.x = Math.PI / 2;
    const face = new THREE.Mesh(nutFace, darkSteel);
    face.rotation.x = Math.PI / 2;
    nut.add(body, face);
    nut.position.set(x, y, 0.62);
    addPart(nut, spinner, new THREE.Vector3(0, 0, 1.25), 5 * TAU);
  });

  // Caliper (fixed, upper right) with pads.
  const cA0 = deg(12);
  const cA1 = deg(74);
  const caliper = new THREE.Group();
  const outboard = new THREE.Mesh(keep(extrude(sectorShape(1.08, 1.82, cA0, cA1), 0.22, seg, 0.04)), paint);
  outboard.position.z = 0.33;
  const inboard = new THREE.Mesh(keep(extrude(sectorShape(1.1, 1.82, cA0 + deg(3), cA1 - deg(3)), 0.2, seg, 0.04)), paint);
  inboard.position.z = -0.33;
  const bridge = new THREE.Mesh(keep(extrude(sectorShape(1.66, 1.86, cA0 + deg(6), cA1 - deg(6)), 0.86, seg, 0.03)), paint);
  const padGeo = keep(extrude(sectorShape(1.12, 1.56, cA0 + deg(5), cA1 - deg(5)), 0.06, seg, 0.006));
  const padOut = new THREE.Mesh(padGeo, pad);
  padOut.position.z = 0.205;
  const padIn = new THREE.Mesh(padGeo, pad);
  padIn.position.z = -0.205;
  // Guide bolts on the outboard face.
  const boltHead = keep(new THREE.CylinderGeometry(0.07, 0.07, 0.08, 6));
  [cA0 + deg(9), cA1 - deg(9)].forEach((a) => {
    const b = new THREE.Mesh(boltHead, zinc);
    b.rotation.x = Math.PI / 2;
    b.position.set(Math.cos(a) * 1.46, Math.sin(a) * 1.46, 0.48);
    outboard.add(b);
    b.position.z = 0.15;
  });
  const mid = (cA0 + cA1) / 2;
  const radial = new THREE.Vector3(Math.cos(mid), Math.sin(mid), 0);
  addPart(outboard, caliper, new THREE.Vector3(0, 0, 1.55).addScaledVector(radial, 0.35));
  addPart(inboard, caliper, new THREE.Vector3(0, 0, -1.3).addScaledVector(radial, 0.35));
  addPart(bridge, caliper, radial.clone().multiplyScalar(1.1));
  addPart(padOut, caliper, new THREE.Vector3(0, 0, 0.85).addScaledVector(radial, 0.2));
  addPart(padIn, caliper, new THREE.Vector3(0, 0, -0.75).addScaledVector(radial, 0.2));
  rig.add(caliper);

  // ── Floating hardware ──
  const floaters: { obj: THREE.Object3D; base: THREE.Vector3; drift: THREE.Vector3; spin: THREE.Vector3; phase: number }[] = [];
  const makeBolt = (length: number) => {
    const g = new THREE.Group();
    const head = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.2, 0.2, 0.15, 6)), zinc);
    head.position.y = length / 2 + 0.075;
    const washerFace = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.21, 0.21, 0.025, 24)), zinc);
    washerFace.position.y = length / 2;
    const shank = new THREE.Mesh(keep(new THREE.CylinderGeometry(0.085, 0.085, length, 20)), steel);
    const thread = new THREE.Mesh(
      keep(new THREE.TubeGeometry(new HelixCurve(0.088, length * 0.62, length * 7), opts.lowPower ? 90 : 180, 0.02, 6, false)),
      steel,
    );
    thread.position.y = -length / 2;
    g.add(head, washerFace, shank, thread);
    return g;
  };
  const makeNut = () => {
    const g = new THREE.Group();
    const shape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU;
      if (i === 0) shape.moveTo(Math.cos(a) * 0.24, Math.sin(a) * 0.24);
      else shape.lineTo(Math.cos(a) * 0.24, Math.sin(a) * 0.24);
    }
    shape.closePath();
    const h = new THREE.Path();
    h.absarc(0, 0, 0.11, 0, TAU, true);
    shape.holes.push(h);
    g.add(new THREE.Mesh(keep(extrude(shape, 0.18, 24, 0.02)), zinc));
    return g;
  };
  const makeWasher = () => {
    const s = new THREE.Shape();
    s.absarc(0, 0, 0.3, 0, TAU, false);
    const h = new THREE.Path();
    h.absarc(0, 0, 0.13, 0, TAU, true);
    s.holes.push(h);
    return new THREE.Mesh(keep(extrude(s, 0.035, 40, 0.008)), steel);
  };
  const gear = new THREE.Mesh(keep(extrude(gearShape(16, 0.78, 0.64, 0.2), 0.16, 24, 0.02)), paint);

  const addFloater = (obj: THREE.Object3D, base: [number, number, number], rot: [number, number, number], spin: [number, number, number]) => {
    obj.rotation.set(...rot);
    scene.add(obj);
    floaters.push({
      obj,
      base: new THREE.Vector3(...base),
      drift: new THREE.Vector3(...base).normalize().multiplyScalar(1.4),
      spin: new THREE.Vector3(...spin),
      phase: floaters.length * 1.7,
    });
  };
  addFloater(makeBolt(1.1), [-2.05, 1.45, -0.6], [deg(20), 0, deg(-38)], [0.0, 0.35, 0.05]);
  addFloater(makeBolt(0.8), [2.15, -1.55, 0.2], [deg(-30), 0, deg(55)], [0.05, -0.4, 0]);
  addFloater(makeNut(), [-1.95, -1.6, 0.6], [deg(55), deg(20), 0], [0.3, 0.2, 0]);
  addFloater(makeNut(), [2.3, 1.15, -1.6], [deg(-40), deg(10), 0], [-0.2, 0.25, 0.1]);
  addFloater(makeWasher(), [1.35, 2.05, -0.9], [deg(65), 0, 0], [0.25, 0, 0.15]);
  addFloater(gear, [-1.65, -0.35, -2.4], [deg(8), deg(28), 0], [0, 0, 0.12]);

  // ── State ──
  const intro = { t: opts.reducedMotion ? 1 : 0 };
  let scroll = 0;
  let assembly = intro.t;
  let raf = 0;
  let running = false;
  let visible = true;
  let last = performance.now();
  let elapsed = 0;

  const pointer = { x: 0, y: 0 };
  const drag = { active: false, x: 0, y: 0, yaw: 0, pitch: 0, tYaw: 0, tPitch: 0 };

  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Keep the assembly framed on tall phones.
    camera.position.z = camera.aspect < 0.9 ? 9.4 / Math.max(camera.aspect, 0.6) * 0.9 : 9.4;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  const onPointerMove = (e: PointerEvent) => {
    const r = container.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    if (drag.active) {
      drag.tYaw = Math.max(-1.1, Math.min(1.1, drag.tYaw + (e.clientX - drag.x) * 0.008));
      drag.tPitch = Math.max(-0.6, Math.min(0.6, drag.tPitch + (e.clientY - drag.y) * 0.006));
      drag.x = e.clientX;
      drag.y = e.clientY;
    }
  };
  const onPointerDown = (e: PointerEvent) => {
    drag.active = true;
    drag.x = e.clientX;
    drag.y = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = "grabbing";
  };
  const onPointerUp = (e: PointerEvent) => {
    drag.active = false;
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    canvas.style.cursor = "grab";
  };
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);
  canvas.style.cursor = "grab";

  const v = new THREE.Vector3();
  const render = (now: number) => {
    // rAF timestamps can be earlier than the performance.now() taken when
    // the loop (re)started, so never let time run backwards.
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = Math.max(last, now);
    elapsed += dt;

    if (intro.t < 1) intro.t = Math.min(1, intro.t + dt / 2.2);
    const introA = easeOutCubic(intro.t);
    // Scrolling away separates the parts again (up to 85%).
    const target = introA * (1 - 0.85 * clamp01(scroll * 1.3));
    assembly += (target - assembly) * Math.min(1, dt * 6);
    const sep = 1 - assembly;

    for (const p of parts) {
      v.copy(p.home).addScaledVector(p.away, sep);
      p.obj.position.copy(v);
      if (p.screw) p.obj.rotation.z = (p.homeRot ?? 0) - p.screw * sep;
    }

    if (!opts.reducedMotion) spinner.rotation.z -= dt * 0.35;

    // Drag eases back to the resting angle when released.
    if (!drag.active) {
      drag.tYaw *= 1 - Math.min(1, dt * 0.8);
      drag.tPitch *= 1 - Math.min(1, dt * 0.8);
    }
    drag.yaw += (drag.tYaw - drag.yaw) * Math.min(1, dt * 8);
    drag.pitch += (drag.tPitch - drag.pitch) * Math.min(1, dt * 8);
    const idle = opts.reducedMotion ? 0 : Math.sin(elapsed * 0.35) * 0.06;
    rig.rotation.y = deg(-32) + drag.yaw + pointer.x * 0.12 + idle;
    rig.rotation.x = deg(10) + drag.pitch - pointer.y * 0.08;
    rig.position.y = scroll * -0.4;

    // Key light follows the cursor.
    key.position.x += (3.5 + pointer.x * 5 - key.position.x) * Math.min(1, dt * 4);
    key.position.y += (3.5 + pointer.y * 4 - key.position.y) * Math.min(1, dt * 4);

    for (const f of floaters) {
      const bob = opts.reducedMotion ? 0 : Math.sin(elapsed * 0.6 + f.phase) * 0.12;
      f.obj.position.copy(f.base).addScaledVector(f.drift, sep * 0.6 + (1 - introA) * 1.5);
      f.obj.position.y += bob;
      if (!opts.reducedMotion) {
        f.obj.rotation.x += f.spin.x * dt;
        f.obj.rotation.y += f.spin.y * dt;
        f.obj.rotation.z += f.spin.z * dt;
      }
    }

    renderer.render(scene, camera);
  };

  const loop = (now: number) => {
    render(now);
    raf = requestAnimationFrame(loop);
  };
  const start = () => {
    if (running || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  io.observe(container);
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener("visibilitychange", onVisibility);

  render(performance.now());
  opts.onReady?.();
  start();

  return {
    setScroll(p: number) {
      scroll = clamp01(p);
    },
    dispose() {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      envMap.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}

/** True when the browser can create a WebGL context. */
export function canUseWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
