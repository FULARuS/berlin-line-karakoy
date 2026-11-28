// 3D bar counter with a draggable rail of cocktails.
import * as THREE from 'three';
import { buildDrink } from './glassware.js';

const TAU = Math.PI * 2;
const mod = (n, m) => ((n % m) + m) % m;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutBack = (t) => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }

function rng(s) { return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

/* ---------------- textures ---------------- */

function wallTexture() {
  const W = 2048, H = 1024, [c, x] = mkCanvas(W, H);
  const g = x.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#1a0306'); g.addColorStop(0.5, '#33060e'); g.addColorStop(1, '#1c0307');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  // warm glow behind the centre of the bar
  const rg = x.createRadialGradient(W / 2, H * 0.62, 10, W / 2, H * 0.62, 760);
  rg.addColorStop(0, 'rgba(190,40,40,0.38)'); rg.addColorStop(0.5, 'rgba(120,16,24,0.18)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = rg; x.fillRect(0, 0, W, H);

  const lineY = Math.round(H * 0.47), cols = 8, colW = W / cols, off = colW / 2;
  const rows = [[30, lineY - 22], [lineY + 22, H - 30]];
  for (let i = -1; i < cols; i++) for (const [y0, y1] of rows) {
    const px = off + i * colW + 20, pw = colW - 40;
    const pg = x.createLinearGradient(px, y0, px + pw, y1);
    pg.addColorStop(0, 'rgba(80,10,20,0.55)'); pg.addColorStop(1, 'rgba(12,1,4,0.55)');
    x.fillStyle = pg; x.fillRect(px, y0, pw, y1 - y0);
    x.lineWidth = 2;
    x.strokeStyle = 'rgba(255,120,120,0.09)'; x.beginPath(); x.moveTo(px, y1); x.lineTo(px, y0); x.lineTo(px + pw, y0); x.stroke();
    x.strokeStyle = 'rgba(0,0,0,0.5)'; x.beginPath(); x.moveTo(px + pw, y0); x.lineTo(px + pw, y1); x.lineTo(px, y1); x.stroke();
  }
  // gold lines
  x.save();
  x.shadowColor = 'rgba(255,140,60,0.7)'; x.shadowBlur = 10; x.strokeStyle = 'rgba(225,160,92,0.6)'; x.lineWidth = 1.8;
  x.beginPath(); x.moveTo(0, lineY); x.lineTo(W, lineY); x.stroke();
  for (let i = 0; i < cols; i++) { const lx = i * colW + off; x.beginPath(); x.moveTo(lx, 0); x.lineTo(lx, H); x.stroke(); }
  x.restore();
  // glints at crossings
  for (let i = 0; i < cols; i++) {
    const gx = i * colW + off, gy = lineY;
    const gg = x.createRadialGradient(gx, gy, 0, gx, gy, 22);
    gg.addColorStop(0, 'rgba(255,240,205,0.95)'); gg.addColorStop(0.2, 'rgba(255,190,110,0.5)'); gg.addColorStop(1, 'rgba(255,120,40,0)');
    x.fillStyle = gg; x.fillRect(gx - 22, gy - 22, 44, 44);
    x.strokeStyle = 'rgba(255,220,170,0.45)'; x.lineWidth = 1;
    x.beginPath(); x.moveTo(gx - 34, gy); x.lineTo(gx + 34, gy); x.moveTo(gx, gy - 34); x.lineTo(gx, gy + 34); x.stroke();
  }
  // soft vignette top/bottom
  const vg = x.createLinearGradient(0, 0, 0, H);
  vg.addColorStop(0, 'rgba(0,0,0,0.55)'); vg.addColorStop(0.25, 'rgba(0,0,0,0)'); vg.addColorStop(0.8, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.4)');
  x.fillStyle = vg; x.fillRect(0, 0, W, H);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

function marbleTexture(dark = false) {
  const W = 2048, H = 1024, [c, x] = mkCanvas(W, H), r = rng(dark ? 77 : 11);
  const g = x.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, dark ? '#220307' : '#3a060d'); g.addColorStop(0.5, dark ? '#2e050a' : '#4a0911'); g.addColorStop(1, dark ? '#1a0206' : '#30050b');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 220; i++) {
    const px = r() * W, py = r() * H, rad = 40 + r() * 260, light = r() < 0.5;
    const rg = x.createRadialGradient(px, py, 0, px, py, rad);
    rg.addColorStop(0, light ? 'rgba(160,40,50,0.16)' : 'rgba(8,0,2,0.28)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = rg; x.fillRect(px - rad, py - rad, rad * 2, rad * 2);
  }
  const vein = (sx, sy, steps, w, a, ang) => {
    x.beginPath(); x.moveTo(sx, sy); let px = sx, py = sy;
    for (let i = 0; i < steps; i++) {
      ang += (r() - 0.5) * 0.55; px += Math.cos(ang) * 9; py += Math.sin(ang) * 6; x.lineTo(px, py);
      if (r() < 0.02 && w > 0.8) vein(px, py, steps * 0.4 | 0, w * 0.5, a * 0.8, ang + (r() - 0.5) * 1.6);
    }
    x.strokeStyle = `rgba(255,${dark ? 150 : 175},${dark ? 150 : 165},${a})`; x.lineWidth = w; x.stroke();
  };
  x.shadowColor = 'rgba(255,90,90,0.6)'; x.shadowBlur = 5;
  for (let i = 0; i < 46; i++) vein(r() * W, r() * H, 60 + r() * 160, 0.6 + r() * 2.2, 0.08 + r() * 0.26, (r() - 0.5) * 1.2);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping; t.anisotropy = 8; return t;
}

function cabinetTexture() {
  const W = 2048, H = 512, [c, x] = mkCanvas(W, H);
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1d0408'); g.addColorStop(1, '#0c0103');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  const cols = 8, colW = W / cols;
  for (let i = 0; i < cols; i++) {
    const px = i * colW + 18;
    x.strokeStyle = 'rgba(255,110,110,0.06)'; x.lineWidth = 2; x.strokeRect(px, 30, colW - 36, H - 60);
  }
  x.save(); x.shadowColor = 'rgba(255,140,60,0.8)'; x.shadowBlur = 10; x.strokeStyle = 'rgba(220,160,90,0.45)'; x.lineWidth = 2;
  for (let i = 0; i <= cols; i++) { x.beginPath(); x.moveTo(i * colW, 0); x.lineTo(i * colW, H); x.stroke(); }
  x.restore();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function radialTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)') {
  const S = 256, [c, x] = mkCanvas(S, S);
  const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, inner); g.addColorStop(1, outer);
  x.fillStyle = g; x.fillRect(0, 0, S, S);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* ---------------- environment for reflections ---------------- */

function buildEnvironment(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const s = new THREE.Scene();
  s.add(new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshBasicMaterial({ color: '#0c0103', side: THREE.BackSide })));
  const panel = (w, h, color, k, pos) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...pos); m.lookAt(0, 0.6, 0); s.add(m);
  };
  panel(9, 1.4, '#fff1dc', 7, [0, 8, 2]);       // overhead strip
  panel(1.2, 7, '#ffe4c0', 6, [-6, 2, 5]);      // front-left softbox
  panel(1.2, 7, '#ffd3a0', 5, [6, 2, 5]);       // front-right softbox
  panel(14, 4, '#c8202a', 0.45, [0, 1, -9]);    // red back wall
  panel(14, 2, '#e0943c', 0.5, [0, -4, 2]);     // warm bounce from the counter
  panel(0.4, 6, '#ffb070', 6, [-7, 2, -5]);     // rim strips
  panel(0.4, 6, '#ffb070', 6, [7, 2, -5]);
  const rt = pmrem.fromScene(s, 0.035);
  pmrem.dispose();
  return rt.texture;
}

/* ================================================================== */

export class BarRail {
  constructor({ canvas, drinks, onSelect, onOpen, onClose, onReady, reducedMotion = false }) {
    this.canvas = canvas; this.drinks = drinks; this.N = drinks.length;
    this.onSelect = onSelect || (() => {}); this.onOpen = onOpen || (() => {}); this.onClose = onClose || (() => {});
    this.reduced = reducedMotion;
    this.S = 0.9; this.GAP = 0.32;
    this.offset = 0; this.target = 0; this.selected = -1;
    this.focus = 0; this.focusTarget = 0; this.isOpen = false;
    this.hovered = -1; this.mouse = new THREE.Vector2(0, 0); this.parallax = new THREE.Vector2(0, 0);
    this.intro = this.reduced ? 1 : 0; this.time = 0; this.active = true;

    const r = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.08;
    r.outputColorSpace = THREE.SRGBColorSpace;

    const scene = this.scene = new THREE.Scene();
    scene.background = new THREE.Color('#120204');
    scene.environment = buildEnvironment(r);
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);

    this.buildRoom();
    this.buildLights();
    this.buildItems();

    this.raycaster = new THREE.Raycaster();
    this.bindEvents();
    this.resize();
    this.clock = new THREE.Clock();
    this.loop = this.loop.bind(this);
    // compile shaders before first visible frame
    r.compile(scene, this.camera);
    this.raf = requestAnimationFrame(this.loop);
    onReady && requestAnimationFrame(() => requestAnimationFrame(onReady));
  }

  buildRoom() {
    const s = this.scene;
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(26, 13), new THREE.MeshBasicMaterial({ map: wallTexture(), toneMapped: false }));
    wall.position.set(0, 1.5, -2.6); wall.renderOrder = -10; s.add(wall);

    const marble = marbleTexture(false); marble.repeat.set(6.5, 0.85);
    const top = new THREE.Mesh(new THREE.PlaneGeometry(40, 2.7), new THREE.MeshPhysicalMaterial({
      map: marble, color: '#6e5a5a', roughness: 0.22, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.08,
      transparent: true, opacity: 0.78, envMapIntensity: 0.22
    }));
    top.rotation.x = -Math.PI / 2; top.position.set(0, 0, 0.0); top.renderOrder = -1; s.add(top);

    const marbleD = marbleTexture(true); marbleD.repeat.set(6.5, 0.12);
    const front = new THREE.Mesh(new THREE.PlaneGeometry(40, 0.34), new THREE.MeshStandardMaterial({ map: marbleD, roughness: 0.25, envMapIntensity: 0.8 }));
    front.position.set(0, -0.17, 1.35); s.add(front);

    const gold = new THREE.MeshStandardMaterial({ color: '#e0a860', metalness: 1, roughness: 0.3, emissive: '#c2701e', emissiveIntensity: 0.9 });
    const lip = new THREE.Mesh(new THREE.BoxGeometry(40, 0.008, 0.012), gold); lip.position.set(0, -0.004, 1.352); s.add(lip);
    const trim = new THREE.Mesh(new THREE.BoxGeometry(40, 0.016, 0.02), gold); trim.position.set(0, -0.345, 1.36); s.add(trim);

    const cab = cabinetTexture(); cab.wrapS = THREE.RepeatWrapping; cab.repeat.set(40 / 26, 1);
    const cabinet = new THREE.Mesh(new THREE.PlaneGeometry(40, 3), new THREE.MeshBasicMaterial({ map: cab, toneMapped: false }));
    cabinet.position.set(0, -1.86, 1.3); s.add(cabinet);

    this.shadowTex = radialTexture('rgba(0,0,0,0.75)', 'rgba(0,0,0,0)');
    this.glowTex = radialTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)');
  }

  buildLights() {
    const s = this.scene;
    s.add(new THREE.HemisphereLight('#ffd9c0', '#2a0508', 0.45));
    const key = new THREE.DirectionalLight('#ffe8d0', 1.7); key.position.set(3, 6, 6); s.add(key);
    const rim = new THREE.DirectionalLight('#ff8a5a', 1.1); rim.position.set(-4, 3, -4); s.add(rim);
    const rim2 = new THREE.DirectionalLight('#ffb27a', 0.8); rim2.position.set(4, 2.5, -4); s.add(rim2);
  }

  buildItems() {
    this.items = []; this.tickers = [];
    const shadowMat = new THREE.MeshBasicMaterial({ map: this.shadowTex, transparent: true, depthWrite: false });
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const plane = new THREE.PlaneGeometry(1, 1);
    this.drinks.forEach((d, i) => {
      const group = new THREE.Group();
      const v = buildDrink(d), rf = buildDrink(d, { reflection: true });
      rf.group.scale.y = -1;
      group.add(v.group, rf.group);
      this.tickers.push(...v.tickers);

      const shadow = new THREE.Mesh(plane, shadowMat);
      shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.003; shadow.scale.setScalar(v.footR * 3.2); shadow.renderOrder = 0;
      const col = new THREE.Color(d.swatch);
      const pool = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ map: this.glowTex, color: col.clone().multiplyScalar(0.9), transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
      pool.rotation.x = -Math.PI / 2; pool.position.set(0, 0.004, 0.22); pool.scale.set(1.25, 0.8, 1);
      // backlight halo (opaque pass, additive) — liquids refract it, so they glow
      const back = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ map: this.glowTex, color: col.clone().lerp(new THREE.Color('#ff7a40'), 0.35).multiplyScalar(0.32), blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
      back.position.set(0, v.rimY * 0.6, -0.55); back.scale.set(1.25, Math.max(1.1, v.rimY * 1.5), 1); back.renderOrder = -5;
      const hitH = v.height + 0.2;
      const hit = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, hitH, 10), hitMat);
      hit.position.y = hitH / 2; hit.userData.index = i;
      group.add(shadow, pool, back, hit);
      this.scene.add(group);
      this.items.push({
        group, visual: v.group, refl: rf.group, pool, back, hit, height: v.height, hover: 0,
        center: clamp(1.62 / v.height, 1.15, 1.72), spin: 0
      });
    });
    this.hits = this.items.map((it) => it.hit);
  }

  /* ---------------- layout ---------------- */

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth, h = this.canvas.clientHeight || window.innerHeight;
    if (!w || !h) return;
    this.w = w; this.h = h;
    this.portrait = w / h < 0.9;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.portrait ? 1.5 : 1.75));
    this.renderer.setSize(w, h, false);
    const cam = this.camera; cam.aspect = w / h;
    const tan = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const wantH = this.portrait ? 4.1 : 4.45, wantW = this.portrait ? 3.15 : 7.4;
    this.dist = Math.max(wantH / (2 * tan), wantW / (2 * tan * cam.aspect));
    this.halfW = this.dist * tan * cam.aspect;
    this.pxPerUnit = h / (2 * this.dist * tan);
    // keep the counter edge at a similar screen height on every aspect ratio
    this.camY = 1.2 + (this.dist - 8.3) * 0.05;
    this.lookY = this.portrait ? 0.5 : 0.78;
    this.focusX = this.portrait ? 0 : -Math.min(1.55, this.halfW * 0.36);
    cam.updateProjectionMatrix();
  }

  /* ---------------- public API ---------------- */

  goTo(i) {
    const cur = mod(Math.round(this.target), this.N);
    let d = i - cur; if (d > this.N / 2) d -= this.N; if (d < -this.N / 2) d += this.N;
    this.target = Math.round(this.target) + d;
  }
  step(dir) { this.target = Math.round(this.target) + dir; }
  open(i = this.selected) {
    if (i !== this.selected) this.goTo(i);
    this.isOpen = true; this.focusTarget = 1; this.onOpen(mod(Math.round(this.target), this.N));
  }
  close() { if (!this.isOpen) return; this.isOpen = false; this.focusTarget = 0; this.onClose(); }
  setActive(v) {
    this.active = v;
    if (v && !this.raf) { this.clock.getDelta(); this.raf = requestAnimationFrame(this.loop); }
    else if (!v && this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
  }

  /* ---------------- input ---------------- */

  bindEvents() {
    const c = this.canvas;
    c.addEventListener('pointerdown', (e) => this.onDown(e));
    window.addEventListener('pointermove', (e) => this.onMove(e), { passive: true });
    window.addEventListener('pointerup', (e) => this.onUp(e));
    window.addEventListener('pointercancel', () => { this.down = null; this.dragging = false; c.classList.remove('is-dragging'); this.target = Math.round(this.offset); });
    c.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 2) {
        e.preventDefault();
        this.offset += e.deltaX / (this.pxPerUnit * this.S) * 0.6;
        clearTimeout(this.wheelT);
        this.target = this.offset;
        this.wheelT = setTimeout(() => { this.target = Math.round(this.offset); }, 120);
      }
    }, { passive: false });
    window.addEventListener('resize', () => this.resize());
  }

  pick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    const hits = this.raycaster.intersectObjects(this.hits.filter((h) => h.parent.visible && h.parent.scale.x > 0.3), false);
    return hits.length ? hits[0].object.userData.index : -1;
  }

  onDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    this.down = { x: e.clientX, y: e.clientY, off: this.offset, id: e.pointerId };
    this.axis = null; this.vel = 0; this.lastX = e.clientX; this.lastT = performance.now();
  }

  onMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      this.mouse.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    }
    if (!this.down) {
      if (e.pointerType === 'mouse' && e.target === this.canvas) {
        const h = this.pick(e);
        this.hovered = h;
        this.canvas.style.cursor = h >= 0 ? 'pointer' : 'grab';
      } else if (e.target !== this.canvas) this.hovered = -1;
      return;
    }
    const dx = e.clientX - this.down.x, dy = e.clientY - this.down.y;
    if (!this.axis && Math.hypot(dx, dy) > 7) {
      this.axis = Math.abs(dx) > Math.abs(dy) * 0.9 ? 'x' : 'y';
      if (this.axis === 'x') { this.dragging = true; this.canvas.classList.add('is-dragging'); try { this.canvas.setPointerCapture(this.down.id); } catch (_) {} }
    }
    if (this.dragging) {
      const unit = this.pxPerUnit * (this.focus > 0.5 ? 2.2 : this.S);
      this.offset = this.down.off - dx / unit;
      const now = performance.now(), dt = Math.max(12, now - this.lastT);
      const inst = -(e.clientX - this.lastX) / unit / dt;
      this.vel = this.vel * 0.6 + inst * 0.4; this.lastX = e.clientX; this.lastT = now;
    }
  }

  onUp(e) {
    if (!this.down) return;
    if (this.dragging) {
      if (performance.now() - this.lastT > 90) this.vel = 0; // finger stopped before release
      let proj = this.offset + clamp(this.vel * (this.reduced ? 0 : 160), -3, 3);
      if (this.focus > 0.5) proj = clamp(proj, Math.round(this.down.off) - 1, Math.round(this.down.off) + 1);
      this.target = Math.round(proj);
      this.dragging = false; this.canvas.classList.remove('is-dragging');
    } else if (!this.axis && e.target === this.canvas) {
      const i = this.pick(e);
      if (i >= 0) { if (!(this.isOpen && i === this.selected)) this.open(i); }
      else if (this.isOpen) this.close();
    }
    this.down = null;
  }

  /* ---------------- frame ---------------- */

  loop() {
    if (!this.active) { this.raf = 0; return; }
    this.raf = requestAnimationFrame(this.loop);
    this.frame(Math.min(this.clock.getDelta(), 0.05));
  }

  frame(dt) {
    this.time += dt;
    const N = this.N;

    if (!this.dragging) this.offset += (this.target - this.offset) * (1 - Math.exp(-dt * (this.reduced ? 30 : 7)));
    this.focus += (this.focusTarget - this.focus) * (1 - Math.exp(-dt * (this.reduced ? 30 : 5.5)));
    if (this.intro < 1) this.intro = Math.min(1, this.intro + dt / 1.6);

    const sel = mod(Math.round(this.offset), N);
    if (sel !== this.selected) { this.selected = sel; this.onSelect(sel, this.isOpen); }

    const f = this.focus, S = this.S;
    this.items.forEach((it, i) => {
      let u = mod(i - this.offset, N); if (u > N / 2) u -= N;
      const near = Math.exp(-u * u * 2.4);
      // rail pose
      let x = u * S + clamp(u, -1, 1) * this.GAP;
      let s = 1 + (it.center - 1) * near;
      let z = 0.55 * near;
      // focus pose: selected glass moves aside & grows, the rest slide away
      const fx = this.focusX + u * (this.portrait ? 3 : 4.4);
      const fs = lerp(0.4, it.center * (this.portrait ? 0.95 : 1.05), near);
      x = lerp(x, fx, f); s = lerp(s, fs, f); z = lerp(z, 0.95 * near, f);
      // intro: glasses rise from the counter one by one
      const k = clamp(this.intro * 1.7 - Math.abs(u) * 0.09, 0, 1);
      s *= k <= 0 ? 0.0001 : easeOutBack(k);

      it.group.position.set(x, 0, z);
      it.group.scale.setScalar(Math.max(s, 0.0001));
      it.group.visible = Math.abs(x) < this.halfW + 1.2 && s > 0.01;

      it.hover += ((this.hovered === i && !this.dragging ? 1 : 0) - it.hover) * (1 - Math.exp(-dt * 10));
      const lift = it.hover * 0.035;
      it.visual.position.y = lift; it.refl.position.y = -lift;
      if (!this.reduced) it.spin += dt * (0.12 * near + f * near * 0.25);
      const rot = -0.35 + Math.sin(it.spin * 2.2) * 0.28 * (1 - f) + f * near * it.spin * 0.8;
      it.visual.rotation.y = rot; it.refl.rotation.y = rot;
      it.pool.material.opacity = 0.08 + 0.26 * near + 0.12 * it.hover;
    });

    // camera parallax
    if (!this.reduced) this.parallax.lerp(this.mouse, 1 - Math.exp(-dt * 2.5));
    const cam = this.camera, pf = 1 - f * 0.6;
    const drop = this.portrait ? f * 1.35 : 0;
    cam.position.set(this.parallax.x * 0.28 * pf, this.camY + this.parallax.y * 0.1 * pf - drop, this.dist - f * (this.portrait ? 0.3 : 0.6));
    cam.lookAt(0, this.lookY - drop, 0);

    for (const t of this.tickers) t.userData.tick(this.time);
    this.renderer.render(this.scene, cam);
  }
}
