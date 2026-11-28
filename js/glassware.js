// Procedural glassware, liquids and garnishes for the 3D bar rail.
// Everything is generated in code — no external models or images.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const TAU = Math.PI * 2;
const V2 = (p) => new THREE.Vector2(p[0], p[1]);
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

/* ---------- deterministic random (same drink = same garnish every build) ---------- */
let seed = 1;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const setSeed = (s) => { seed = s; };

const cache = new Map();
const cached = (k, f) => { if (!cache.has(k)) cache.set(k, f()); return cache.get(k); };

function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }

/* ============================ TEXTURES ============================ */

// Crystal-cut normal map, generated analytically.
function cutNormalMap(kind) {
  return cached('nm-' + kind, () => {
    const S = 256, [c, ctx] = mkCanvas(S, S), img = ctx.createImageData(S, S), d = img.data;
    const h = (u, v) => {
      if (kind === 'ribs') return Math.abs(((u * 6) % 1) - 0.5);
      const a = Math.abs((((u + v) * 3) % 1) - 0.5);
      const b = Math.abs(((((u - v) % 1 + 1) * 3) % 1) - 0.5);
      return Math.min(a, b);
    };
    const e = 1 / S, s = kind === 'ribs' ? 0.05 : 0.09;
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const u = x / S, v = y / S;
      const dx = (h(u + e, v) - h(u - e, v)) / (2 * e), dy = (h(u, v + e) - h(u, v - e)) / (2 * e);
      let nx = -dx * s, ny = -dy * s, nz = 1; const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
      const i = (y * S + x) * 4;
      d[i] = (nx * 0.5 + 0.5) * 255; d[i + 1] = (ny * 0.5 + 0.5) * 255; d[i + 2] = (nz * 0.5 + 0.5) * 255; d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
  });
}

function fruitTex(kind) {
  return cached('fruit-' + kind, () => {
    const S = 256, [c, x] = mkCanvas(S, S), cx = S / 2;
    const P = {
      orange: { rind: '#e8640f', pith: '#f7e2bf', flesh: '#f2861b', flesh2: '#ffc35c', seg: 10 },
      dried: { rind: '#9a3a0a', pith: '#e2a865', flesh: '#c95f15', flesh2: '#eea047', seg: 10 },
      lemon: { rind: '#e6bd14', pith: '#f8f0cc', flesh: '#f0d23a', flesh2: '#fff3a6', seg: 9 },
      cucumber: { rind: '#1f4a17', pith: '#8fbe5e', flesh: '#cfe6a3', flesh2: '#effad7', seg: 0 }
    }[kind];
    const disc = (r, f) => { x.fillStyle = f; x.beginPath(); x.arc(cx, cx, r, 0, TAU); x.fill(); };
    disc(128, P.rind); disc(117, P.pith);
    if (P.seg) {
      for (let i = 0; i < P.seg; i++) {
        const a0 = i / P.seg * TAU + 0.05, a1 = (i + 1) / P.seg * TAU - 0.05, am = (a0 + a1) / 2;
        const g = x.createRadialGradient(cx, cx, 6, cx, cx, 108); g.addColorStop(0, P.flesh2); g.addColorStop(1, P.flesh);
        x.fillStyle = g; x.beginPath(); x.moveTo(cx + Math.cos(am) * 9, cx + Math.sin(am) * 9); x.arc(cx, cx, 107, a0, a1); x.closePath(); x.fill();
        x.strokeStyle = 'rgba(255,255,255,0.18)'; x.lineWidth = 1.2;
        for (let k = 0; k < 7; k++) { const a = a0 + (a1 - a0) * (k + 0.5) / 7; x.beginPath(); x.moveTo(cx + Math.cos(a) * 25, cx + Math.sin(a) * 25); x.lineTo(cx + Math.cos(a) * 98, cx + Math.sin(a) * 98); x.stroke(); }
      }
      disc(9, P.pith);
    } else {
      const g = x.createRadialGradient(cx, cx, 4, cx, cx, 112); g.addColorStop(0, P.flesh2); g.addColorStop(1, P.flesh);
      disc(112, g);
      x.fillStyle = 'rgba(160,200,110,0.55)';
      for (let k = 0; k < 3; k++) { const a = k / 3 * TAU + 0.5; x.beginPath(); x.ellipse(cx + Math.cos(a) * 34, cx + Math.sin(a) * 34, 26, 15, a, 0, TAU); x.fill(); }
      x.fillStyle = 'rgba(250,255,235,0.9)';
      for (let k = 0; k < 18; k++) { const a = k / 18 * TAU; x.beginPath(); x.ellipse(cx + Math.cos(a) * 38, cx + Math.sin(a) * 38, 6, 3, a, 0, TAU); x.fill(); }
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  });
}

/* ============================ MATERIALS ============================ */

// Glass shell: reflections are added on top of what is behind (custom blend),
// the background is only slightly darkened — reads as clear glass.
function shellMat(type, cut) {
  return cached('shell-' + type, () => {
    const m = new THREE.MeshPhysicalMaterial({
      color: '#000000', roughness: 0.03, metalness: 0, transparent: true, opacity: 0.1,
      envMapIntensity: 2.2, clearcoat: 1, clearcoatRoughness: 0.02, ior: 1.5, specularIntensity: 1,
      depthWrite: false
    });
    m.blending = THREE.CustomBlending;
    m.blendSrc = THREE.OneFactor; m.blendDst = THREE.OneMinusSrcAlphaFactor; m.blendEquation = THREE.AddEquation;
    if (cut) {
      const nm = cutNormalMap(cut.kind).clone(); nm.needsUpdate = true; nm.repeat.set(cut.rx, cut.ry);
      m.normalMap = nm; m.normalScale.setScalar(cut.kind === 'ribs' ? 0.35 : 0.8);
    }
    return m;
  });
}

function liquidMat(color, o = {}) {
  const key = 'liq-' + color + JSON.stringify(o);
  return cached(key, () => {
    const c = new THREE.Color(color);
    if (o.opaque) return new THREE.MeshPhysicalMaterial({ color: c, roughness: o.rough ?? 0.6, clearcoat: o.rough > 0.7 ? 0 : 0.6, emissive: c, emissiveIntensity: o.glow ?? 0.08, sheen: o.rough > 0.7 ? 1 : 0, sheenColor: '#ffffff', sheenRoughness: 0.8 });
    return new THREE.MeshPhysicalMaterial({
      color: c, transmission: 1, thickness: o.thick ?? 0.14, ior: 1.34, roughness: o.rough ?? 0.06,
      attenuationColor: c, attenuationDistance: o.atten ?? 0.6,
      emissive: c, emissiveIntensity: o.glow ?? 0.22, envMapIntensity: 1.4, specularIntensity: 1
    });
  });
}

// Ice: drawn in the opaque pass (so liquids refract it) but blended like glass.
const iceMat = () => cached('ice', () => {
  const m = new THREE.MeshPhysicalMaterial({ color: '#6f8790', roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 2.4, opacity: 0.55, depthWrite: false });
  m.blending = THREE.CustomBlending; m.blendSrc = THREE.OneFactor; m.blendDst = THREE.OneMinusSrcAlphaFactor;
  return m;
});
const std = (k, color, o = {}) => cached('std-' + k, () => new THREE.MeshStandardMaterial({ color, roughness: 0.55, ...o }));
const phys = (k, color, o = {}) => cached('phys-' + k, () => new THREE.MeshPhysicalMaterial({ color, roughness: 0.4, ...o }));
const goldMat = () => phys('gold', '#d9a557', { metalness: 1, roughness: 0.22, emissive: '#6a4010', emissiveIntensity: 0.25 });

/* ============================ GLASS PROFILES ============================ */

function densify(pts, step = 0.02) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < 1e-6) continue;
    const n = Math.max(1, Math.ceil(L / step));
    for (let k = 1; k <= n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
  }
  return out;
}
const spline = (pts, n) => new THREE.SplineCurve(pts.map(V2)).getSpacedPoints(n).map((v) => [v.x, v.y]);

function offsetInward(b, t) {
  return b.map((p, i) => {
    const a = b[Math.max(i - 1, 0)], c = b[Math.min(i + 1, b.length - 1)];
    let dx = c[0] - a[0], dy = c[1] - a[1]; const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
    return [Math.max(p[0] - dy * t, 0.002), p[1] + dx * t];
  });
}

function finishBowl(outer, b, t, footR) {
  const R = b[b.length - 1][0], H = b[b.length - 1][1];
  const inner = offsetInward(b, t).map(([r, y]) => [r, Math.min(y, H)]);
  for (let i = 1; i < inner.length; i++) if (inner[i][1] <= inner[i - 1][1]) inner[i][1] = inner[i - 1][1] + 1e-4;
  const bottomY = inner[0][1];
  const profile = [...outer, ...b, [R - t * 0.5, H + t * 0.45], ...inner.slice().reverse(), [0, bottomY]];
  return { profile: densify(profile), inner: [[0, bottomY], ...inner], rimY: H, rimR: R - t, bottomY, footR };
}

function stemmed({ footR, stemR, stemTop, bowl, t = 0.011, footH = 0.024, knob }) {
  const outer = [[0, 0], [footR * 0.97, 0], [footR, 0.007], [footR * 0.95, footH * 0.75], [footR * 0.5, footH],
    [stemR * 2.6, footH + 0.018], [stemR * 1.25, footH + 0.06], [stemR, footH + 0.11]];
  if (knob) outer.push([stemR, knob - 0.05], [stemR * 2.1, knob], [stemR, knob + 0.05]);
  outer.push([stemR, stemTop - 0.07], [stemR * 1.4, stemTop - 0.02]);
  return finishBowl(outer, spline(bowl, 48), t, footR);
}

function tumbler({ R, H, base, t = 0.014, Rb = R }) {
  const outer = [[0, 0], [Rb - 0.014, 0], [Rb, 0.014], [R, H]];
  const inner = [[0, base], [Rb - t - 0.012, base], [Rb - t, base + 0.012], [R - t, H]];
  const profile = [...outer, [R - t * 0.5, H + t * 0.45], ...inner.slice().reverse()];
  return { profile: densify(profile), inner, rimY: H, rimR: R - t, bottomY: base, footR: Rb };
}

const GLASSES = {
  coupe: () => stemmed({ footR: 0.27, stemR: 0.02, stemTop: 0.56, bowl: [[0.035, 0.56], [0.15, 0.585], [0.26, 0.65], [0.325, 0.75], [0.35, 0.86]] }),
  martini: () => stemmed({ footR: 0.25, stemR: 0.018, stemTop: 0.6, bowl: [[0.02, 0.6], [0.13, 0.715], [0.25, 0.84], [0.36, 0.96]] }),
  nicknora: () => stemmed({ footR: 0.23, stemR: 0.018, stemTop: 0.52, bowl: [[0.03, 0.52], [0.15, 0.56], [0.235, 0.66], [0.265, 0.8], [0.25, 0.94]] }),
  flute: () => stemmed({ footR: 0.21, stemR: 0.017, stemTop: 0.6, bowl: [[0.02, 0.6], [0.085, 0.68], [0.125, 0.85], [0.14, 1.15], [0.135, 1.5]] }),
  goblet: () => stemmed({ footR: 0.27, stemR: 0.026, stemTop: 0.42, knob: 0.25, t: 0.014, bowl: [[0.05, 0.42], [0.2, 0.47], [0.285, 0.6], [0.305, 0.8], [0.31, 1.02]] }),
  copa: () => stemmed({ footR: 0.26, stemR: 0.019, stemTop: 0.52, bowl: [[0.03, 0.52], [0.21, 0.58], [0.335, 0.74], [0.355, 0.92], [0.32, 1.14]] }),
  wine: () => stemmed({ footR: 0.25, stemR: 0.018, stemTop: 0.56, bowl: [[0.03, 0.56], [0.19, 0.62], [0.28, 0.8], [0.275, 1.0], [0.23, 1.2]] }),
  rocks: () => tumbler({ R: 0.3, H: 0.68, base: 0.11, t: 0.016, Rb: 0.29 }),
  highball: () => tumbler({ R: 0.2, H: 1.28, base: 0.12, t: 0.013, Rb: 0.195 }),
  mug: () => tumbler({ R: 0.23, H: 0.76, base: 0.07, t: 0.013, Rb: 0.215 })
};
const CUT = {
  goblet: { kind: 'diamond', rx: 16, ry: 3 },
  rocks: { kind: 'diamond', rx: 14, ry: 2.5 },
  highball: { kind: 'ribs', rx: 8, ry: 1 }
};

function innerR(inner, y) {
  if (y <= inner[0][1]) return inner[0][0];
  for (let i = 1; i < inner.length; i++) {
    const a = inner[i - 1], b = inner[i];
    if (y <= b[1]) { const d = b[1] - a[1]; return d < 1e-6 ? b[0] : a[0] + (b[0] - a[0]) * (y - a[1]) / d; }
  }
  return inner[inner.length - 1][0];
}
const level = (G, f) => G.bottomY + (G.rimY - G.bottomY) * f;

function liquidGeo(G, y0, y1, shrink = 0.975) {
  const pts = [[0, y0]];
  const n = 20;
  for (let i = 0; i <= n; i++) { const y = y0 + (y1 - y0) * i / n; pts.push([Math.max(innerR(G.inner, y) * shrink - 0.002, 0.001), y]); }
  pts.push([0, y1]);
  return new THREE.LatheGeometry(pts.map(V2), 48);
}

/* ============================ GARNISH ============================ */

function wheel(kind, r, thick = 0.016) {
  const face = cached('face-' + kind, () => new THREE.MeshStandardMaterial({ map: fruitTex(kind), roughness: kind === 'dried' ? 0.8 : 0.35, emissive: '#ffffff', emissiveMap: fruitTex(kind), emissiveIntensity: kind === 'dried' ? 0.1 : 0.2 }));
  const side = std('side-' + kind, { orange: '#d9560c', dried: '#7f2d06', lemon: '#dcb012', cucumber: '#1c4314' }[kind], { roughness: 0.5 });
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, thick, 40), [side, face, face]);
  m.rotation.x = Math.PI / 2;
  const g = new THREE.Group(); g.add(m); return g;
}

function twist(color, len = 0.26, rad = 0.045, turns = 1.5) {
  const pts = [];
  for (let i = 0; i <= 40; i++) { const t = i / 40, a = t * turns * TAU; pts.push(V3(Math.cos(a) * rad * (1 - t * 0.35), t * len, Math.sin(a) * rad * (1 - t * 0.35))); }
  const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 90, 0.012, 8, false);
  return new THREE.Mesh(geo, phys('peel-' + color, color, { roughness: 0.38, clearcoat: 0.7, emissive: color, emissiveIntensity: 0.18 }));
}

function sprig({ L = 0.55, n = 70, leaf = 'needle', color = '#30502a', bend = 0.012 } = {}) {
  const curve = new THREE.CatmullRomCurve3([V3(0, 0, 0), V3(bend, L * 0.35, bend * 0.5), V3(-bend, L * 0.7, -bend * 0.4), V3(bend, L, 0)]);
  const stem = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.0045, 5), std('stem', '#4b5a2c', { roughness: 0.8 }));
  const parts = [];
  for (let i = 0; i < n; i++) {
    const t = 0.06 + 0.94 * i / n, p = curve.getPointAt(t);
    let g;
    if (leaf === 'needle') {
      const len = 0.045 + 0.03 * Math.sin(t * Math.PI * 0.9);
      g = new THREE.BoxGeometry(0.007, len, 0.0025); g.translate(0, len / 2, 0); g.rotateZ(0.95 - t * 0.45);
    } else {
      g = new THREE.SphereGeometry(1, 6, 4); g.scale(0.009, 0.0035, 0.014); g.translate(0, 0, 0.012); g.rotateX(-0.6);
    }
    g.rotateY(i * 2.39996); g.translate(p.x, p.y, p.z); parts.push(g);
  }
  const leaves = new THREE.Mesh(mergeGeometries(parts), std('leaf-' + color, color, { roughness: 0.6, emissive: color, emissiveIntensity: 0.08 }));
  const grp = new THREE.Group(); grp.add(stem, leaves); return grp;
}

function thymeWreath(R, y) {
  const pts = [];
  for (let i = 0; i < 64; i++) { const a = i / 64 * TAU, r = R + 0.014 + Math.sin(a * 5) * 0.006; pts.push(V3(Math.cos(a) * r, y + Math.sin(a * 3) * 0.014, Math.sin(a) * r)); }
  const curve = new THREE.CatmullRomCurve3(pts, true);
  const stem = new THREE.Mesh(new THREE.TubeGeometry(curve, 128, 0.003, 4, true), std('thyme-stem', '#5b5428', { roughness: 0.8 }));
  const parts = [];
  for (let i = 0; i < 220; i++) {
    const p = curve.getPointAt(rnd());
    const g = new THREE.SphereGeometry(1, 6, 4); g.scale(0.011, 0.004, 0.016);
    g.rotateX(rnd() * TAU); g.rotateY(rnd() * TAU); g.translate(p.x + (rnd() - 0.5) * 0.022, p.y + (rnd() - 0.5) * 0.02, p.z + (rnd() - 0.5) * 0.022); parts.push(g);
  }
  const leaves = new THREE.Mesh(mergeGeometries(parts), std('thyme', '#41612b', { roughness: 0.6 }));
  const grp = new THREE.Group(); grp.add(stem, leaves); return grp;
}

function leaves(count, color, size = 1) {
  const parts = [];
  for (let i = 0; i < count; i++) {
    const g = new THREE.SphereGeometry(1, 14, 8); g.scale(0.042 * size, 0.008, 0.072 * size); g.translate(0, 0, 0.06 * size);
    g.rotateX(-0.55 - rnd() * 0.5); g.rotateY(i / count * TAU + rnd() * 0.5); g.translate(0, rnd() * 0.035 * size, 0); parts.push(g);
  }
  return new THREE.Mesh(mergeGeometries(parts), phys('leaves-' + color, color, { roughness: 0.42, sheen: 0.6, sheenColor: '#bfffa0', emissive: color, emissiveIntensity: 0.12 }));
}

function berries(n, color, r, spread, y = 0) {
  const parts = [];
  for (let i = 0; i < n; i++) {
    const a = rnd() * TAU, d = Math.sqrt(rnd()) * spread;
    const g = new THREE.SphereGeometry(r * (0.85 + rnd() * 0.3), 16, 12); g.translate(Math.cos(a) * d, y + rnd() * r * 1.4, Math.sin(a) * d); parts.push(g);
  }
  return new THREE.Mesh(mergeGeometries(parts), phys('berry-' + color, color, { roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.15, emissive: color, emissiveIntensity: 0.1 }));
}

function blackberry() {
  const parts = [], N = 34;
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, rr = Math.sqrt(1 - y * y), a = i * 2.39996;
    const g = new THREE.SphereGeometry(0.0115, 10, 8); g.translate(Math.cos(a) * rr * 0.026, y * 0.032, Math.sin(a) * rr * 0.026); parts.push(g);
  }
  return new THREE.Mesh(mergeGeometries(parts), phys('blackberry', '#1d0718', { roughness: 0.12, clearcoat: 1, emissive: '#3a0a30', emissiveIntensity: 0.2 }));
}

function straw(L, color = '#0d0b0b') {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, L, 14), phys('straw-' + color, color, { roughness: 0.25, clearcoat: 1 }));
  m.geometry.translate(0, L / 2, 0); return m;
}

function pansy() {
  const grp = new THREE.Group();
  const petal = (sx, sz, rot, color, k, tilt) => {
    const g = new THREE.SphereGeometry(1, 18, 10); g.scale(sx, 0.008, sz); g.translate(0, 0, sz * 0.85); g.rotateX(tilt); g.rotateY(rot);
    return new THREE.Mesh(g, phys('petal-' + k, color, { roughness: 0.55, sheen: 1, sheenColor: '#ff5577', emissive: color, emissiveIntensity: 0.2 }));
  };
  for (let i = 0; i < 2; i++) grp.add(petal(0.062, 0.058, Math.PI + (i - 0.5) * 1.0, '#4a0617', 'back', -0.15));
  for (let i = 0; i < 3; i++) grp.add(petal(0.055, 0.052, (i - 1) * 1.1, '#7d0d28', 'front', -0.3));
  const c = new THREE.Mesh(new THREE.SphereGeometry(0.013, 12, 8), phys('pansy-c', '#f2b41b', { roughness: 0.4, emissive: '#a86a00', emissiveIntensity: 0.4 }));
  c.position.y = 0.008; grp.add(c);
  return grp;
}

function lavenderSprig(L = 0.42) {
  const grp = new THREE.Group();
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.004, L, 5), std('lav-stem', '#5e6d3b'));
  stem.position.y = L / 2; grp.add(stem);
  const parts = [];
  for (let i = 0; i < 46; i++) {
    const t = i / 46, a = i * 2.39996, y = L - 0.15 + t * 0.15, r = 0.01 * (1 - t * 0.5);
    const g = new THREE.SphereGeometry(0.0075 * (1 - t * 0.35), 8, 6); g.translate(Math.cos(a) * r, y, Math.sin(a) * r); parts.push(g);
  }
  grp.add(new THREE.Mesh(mergeGeometries(parts), phys('lav', '#8a63cf', { roughness: 0.5, emissive: '#4b2a8a', emissiveIntensity: 0.35 })));
  return grp;
}

function pick(L = 0.3) {
  const grp = new THREE.Group();
  const s = new THREE.Mesh(new THREE.CylinderGeometry(0.0032, 0.0032, L, 6), goldMat()); s.position.y = L / 2; grp.add(s);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.003, 6, 18), goldMat()); ring.position.y = L + 0.012; grp.add(ring);
  return grp;
}

function cinnamon(L = 0.34) {
  const grp = new THREE.Group();
  const outer = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, L, 14, 1, true), std('cinn', '#6b3214', { roughness: 0.9, side: THREE.DoubleSide }));
  const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, L * 0.98, 10, 1, true), std('cinn2', '#4d220c', { roughness: 0.9, side: THREE.DoubleSide }));
  inner.position.x = 0.004; grp.add(outer, inner); return grp;
}

function starAnise() {
  const parts = [];
  for (let i = 0; i < 8; i++) { const g = new THREE.ConeGeometry(0.012, 0.05, 6); g.rotateZ(-Math.PI / 2); g.translate(0.03, 0, 0); g.rotateY(i / 8 * TAU); parts.push(g); }
  return new THREE.Mesh(mergeGeometries(parts), std('anise', '#4a2410', { roughness: 0.75 }));
}

function iceCube(s) {
  const m = new THREE.Mesh(cached('ice-' + s, () => new RoundedBoxGeometry(s, s, s, 2, s * 0.16)), iceMat());
  m.rotation.set(rnd() * 0.6, rnd() * TAU, rnd() * 0.6); m.renderOrder = 1; return m;
}

function bubbles(G, y0, y1, n = 34) {
  const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0055, 6, 4), std('bubble', '#fff6d8', { emissive: '#fff0c0', emissiveIntensity: 0.7, roughness: 0.2 }), n);
  const data = Array.from({ length: n }, () => ({ a: rnd() * TAU, rr: 0.15 + rnd() * 0.8, sp: 0.07 + rnd() * 0.12, ph: rnd() }));
  const m4 = new THREE.Matrix4();
  mesh.userData.tick = (time) => {
    for (let i = 0; i < n; i++) {
      const b = data[i], f = (b.ph + time * b.sp) % 1, y = y0 + (y1 - y0) * f, r = innerR(G.inner, y) * 0.8 * b.rr;
      m4.makeTranslation(Math.cos(b.a) * r, y, Math.sin(b.a) * r); mesh.setMatrixAt(i, m4);
    }
    mesh.instanceMatrix.needsUpdate = true;
  };
  mesh.userData.tick(0); mesh.frustumCulled = false;
  return mesh;
}

/* ============================ DRINKS ============================ */

function pour(g, G, layers) {
  let y0 = G.bottomY + 0.003, top = y0;
  for (const [to, color, o] of layers) {
    const y1 = level(G, to);
    g.add(new THREE.Mesh(liquidGeo(G, y0, y1), liquidMat(color, o)));
    y0 = y1; top = y1;
  }
  return { top, r: innerR(G.inner, top) };
}

const BUILD = {
  ruby(g, G) {
    pour(g, G, [[0.8, '#b0122c', { atten: 0.35 }]]);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(G.rimR + 0.006, 0.0055, 8, 120), goldMat()); rim.rotation.x = Math.PI / 2; rim.position.y = G.rimY + 0.004; g.add(rim);
    const tw = twist('#f2891a', 0.2, 0.05, 1.4); tw.position.set(G.rimR * 0.55, G.rimY - 0.03, 0.12); tw.rotation.set(0.3, 0, -0.75); g.add(tw);
    const fl = pansy(); fl.position.set(G.rimR * 0.45, G.rimY + 0.07, -0.08); fl.rotation.set(1.05, 0, -0.4); g.add(fl);
  },
  french75(g, G) {
    const { top } = pour(g, G, [[0.8, '#ecc760', { atten: 0.9, glow: 0.3 }], [0.86, '#f7eccc', { opaque: true, rough: 0.9 }]]);
    g.add(bubbles(G, G.bottomY + 0.02, level(G, 0.79)));
    const tw = twist('#ecc61c', 0.22, 0.03, 1.8); tw.position.set(G.rimR * 0.6, top - 0.05, 0.02); tw.rotation.z = -0.25; g.add(tw);
  },
  gnt(g, G) {
    const { top, r } = pour(g, G, [[0.62, '#d4e8c8', { atten: 2.4, glow: 0.12 }]]);
    for (let i = 0; i < 2; i++) { const c = wheel('cucumber', 0.1, 0.01); c.position.set((i - 0.5) * 0.16, level(G, 0.42) + i * 0.08, r * 0.55); c.rotation.set(-0.15, (i - 0.5) * 0.6, 0.2); g.add(c); }
    for (let i = 0; i < 4; i++) { const ic = iceCube(0.13); const a = i / 4 * TAU + 0.4; ic.position.set(Math.cos(a) * r * 0.45, top + 0.01 - (i % 2) * 0.05, Math.sin(a) * r * 0.45); g.add(ic); }
    const b = leaves(5, '#2c7a22', 1.25); b.position.set(-0.08, top + 0.04, -0.02); g.add(b);
  },
  golden(g, G) {
    const { top, r } = pour(g, G, [[0.8, '#f5c418', { atten: 0.55, glow: 0.3 }]]);
    for (let i = 0; i < 3; i++) { const ic = iceCube(0.12); ic.position.set((i - 1) * 0.12, top + 0.015, (i % 2) * 0.06 - 0.03); g.add(ic); }
    const w = wheel('dried', 0.13, 0.014); w.position.set(-0.04, G.rimY + 0.1, -0.12); w.rotation.set(0, 0.25, 0.1); g.add(w);
    const rs = sprig({ L: 0.58 }); rs.position.set(-0.17, top - 0.1, -0.08); rs.rotation.set(-0.1, 0, 0.28); g.add(rs);
    g.add(thymeWreath(G.rimR + 0.012, G.rimY - 0.04));
    const s = straw(0.62); s.position.set(0.06, top - 0.25, 0); s.rotation.z = -0.42; g.add(s);
  },
  negroni(g, G) {
    const { top, r } = pour(g, G, [[0.64, '#b8121a', { atten: 0.25 }]]);
    const ic = iceCube(0.3); ic.position.set(0, top - 0.06, 0); g.add(ic);
    const w = wheel('orange', 0.15, 0.016); w.position.set(0.05, top - 0.05, r * 0.62); w.rotation.set(-0.12, 0.2, 0.15); g.add(w);
  },
  lavender(g, G) {
    const { top } = pour(g, G, [[0.74, '#7d3e9e', { atten: 0.45, glow: 0.3 }], [0.86, '#e6d6ef', { opaque: true, rough: 0.95, glow: 0.05 }]]);
    const p = pick(0.4); p.position.set(-G.rimR - 0.05, G.rimY - 0.05, 0); p.rotation.z = -1.05; g.add(p);
    [0.22, 0.29].forEach((t) => { const b = blackberry(); b.position.set(-G.rimR - 0.05 + Math.sin(1.05) * t, G.rimY - 0.05 + Math.cos(1.05) * t, 0); g.add(b); });
    const l = lavenderSprig(0.36); l.position.set(0.06, top - 0.02, -0.05); l.rotation.set(-0.15, 0, -0.35); g.add(l);
  },
  mulled(g, G) {
    const { top, r } = pour(g, G, [[0.8, '#640914', { atten: 0.18, glow: 0.12 }]]);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.028, 12, 40, Math.PI), shellMat('mug-h')); handle.rotation.z = -Math.PI / 2; handle.position.set(G.rimR + 0.02, G.rimY * 0.52, 0); g.add(handle);
    const w = wheel('orange', 0.13, 0.016); w.position.set(-0.08, G.rimY + 0.04, 0.06); w.rotation.set(0, 0.35, -0.12); g.add(w);
    const c = cinnamon(0.36); c.position.set(0.1, top + 0.06, -0.06); c.rotation.set(0.2, 0, -0.35); g.add(c);
    const a = starAnise(); a.position.set(0.02, top + 0.006, 0.1); a.rotation.set(0, 0.4, 0); g.add(a);
  },
  aperol(g, G) {
    const { top, r } = pour(g, G, [[0.64, '#f2601a', { atten: 0.6, glow: 0.3 }]]);
    for (let i = 0; i < 3; i++) { const ic = iceCube(0.11); ic.position.set((i - 1) * 0.11, top - 0.01 + (i % 2) * 0.02, -0.04); g.add(ic); }
    const w = wheel('orange', 0.12, 0.016); w.position.set(0.02, level(G, 0.42), r * 0.5); w.rotation.set(-0.1, 0.1, 0.2); g.add(w);
  },
  espresso(g, G) {
    const { top } = pour(g, G, [[0.8, '#1c0b05', { opaque: true, rough: 0.2, glow: 0.02 }], [0.87, '#c99d70', { opaque: true, rough: 0.95, glow: 0.04 }]]);
    for (let i = 0; i < 3; i++) {
      const bean = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), phys('bean', '#3a1a0a', { roughness: 0.3, clearcoat: 0.6 }));
      bean.scale.set(0.022, 0.012, 0.03); const a = i / 3 * TAU + 0.3; bean.position.set(Math.cos(a) * 0.032, top + 0.008, Math.sin(a) * 0.032); bean.rotation.y = a; g.add(bean);
    }
  },
  oldfashioned(g, G) {
    const { top, r } = pour(g, G, [[0.52, '#c46a10', { atten: 0.32, glow: 0.25 }]]);
    const ic = iceCube(0.27); ic.position.set(0, top + 0.02, 0); ic.rotation.set(0.05, 0.4, 0.04); g.add(ic);
    const tw = twist('#f08316', 0.18, 0.04, 1.2); tw.position.set(0.14, top + 0.12, 0.05); tw.rotation.set(0, 0, -1.25); g.add(tw);
  },
  berry(g, G) {
    const { top, r } = pour(g, G, [[0.86, '#b30f33', { atten: 0.3 }]]);
    const parts = [];
    for (let i = 0; i < 26; i++) { const geo = new THREE.DodecahedronGeometry(0.03 + rnd() * 0.02, 0); const a = rnd() * TAU, d = Math.sqrt(rnd()) * r * 0.85; geo.rotateX(rnd() * 3); geo.rotateY(rnd() * 3); geo.translate(Math.cos(a) * d, top - 0.02 + rnd() * 0.06, Math.sin(a) * d); parts.push(geo); }
    const crushed = new THREE.Mesh(mergeGeometries(parts), iceMat()); crushed.renderOrder = 1; g.add(crushed);
    const b = berries(7, '#b5091d', 0.03, r * 0.6, top + 0.04); g.add(b);
    const rs = sprig({ L: 0.42 }); rs.position.set(-0.07, top - 0.05, -0.05); rs.rotation.set(0, 0, 0.18); g.add(rs);
  },
  horn(g, G) {
    const { top, r } = pour(g, G, [[0.42, '#e8622b', { atten: 0.45, glow: 0.3 }], [0.84, '#f6a35a', { atten: 0.6, glow: 0.32 }]]);
    for (let i = 0; i < 3; i++) { const ic = iceCube(0.13); ic.position.set((i - 1) * 0.1, top - 0.02 + (i % 2) * 0.03, 0.02); g.add(ic); }
    const b = berries(6, '#262a5c', 0.03, r * 0.5, top + 0.05); g.add(b);
    const m = leaves(7, '#3b9a2c', 1); m.position.set(0.05, top + 0.08, -0.04); g.add(m);
    const s = straw(0.5); s.position.set(-0.03, top - 0.3, 0); s.rotation.z = 0.28; g.add(s);
  }
};

/**
 * Build one drink. Returns a group with base at y = 0, plus metadata.
 */
export function buildDrink(drink, { reflection = false } = {}) {
  const G = GLASSES[drink.glass]();
  const g = new THREE.Group();
  const shell = new THREE.Mesh(new THREE.LatheGeometry(G.profile.map(V2), 64), shellMat(drink.glass, CUT[drink.glass]));
  shell.renderOrder = 2;
  g.add(shell);
  setSeed(drink.id.split('').reduce((a, c) => a + c.charCodeAt(0) * 31, 7));
  BUILD[drink.id](g, G);
  // reflections skip animated bits
  const tickers = [];
  g.traverse((o) => { if (o.userData.tick) tickers.push(o); });
  if (reflection) tickers.forEach((o) => o.parent.remove(o));
  const box = new THREE.Box3().setFromObject(g);
  return { group: g, height: box.max.y, footR: G.footR, rimY: G.rimY, tickers: reflection ? [] : tickers };
}
