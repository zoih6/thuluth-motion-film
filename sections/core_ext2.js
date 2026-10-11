// ── shared helpers for s06+ ───────────────────────────────────────────
// ink-component centres (ink-image px): fatha, shadda, damma, error spot on tail
const INKPT = { fatha: [1168, 50], shadda: [883, 95], damma: [909, 176], tail: [300, 520], body: [620, 420] };
// place ink at centre (x,y), width w → mapping helper
function inkMap(x, y, w) { const k = w / inkW, h = inkH * k; const x0 = x - w / 2, y0 = y - h / 2; return { x0, y0, k, w, h, p: (u, v) => [x0 + u * k, y0 + v * k] }; }
function drawInkAt(x, y, w, alpha = 1, dot = true) {
  const m = inkMap(x, y, w); g.save(); g.globalAlpha *= alpha; g.drawImage(A.ink, m.x0, m.y0, m.w, m.h); if (dot) g.drawImage(A.dot, m.x0, m.y0, m.w, m.h); g.restore(); return m;
}
// sheet + ink as one card (same look as s01's sheet), returns ink map
function drawWordCard(t, x, y, sc, rot = 0, id = 600) {
  const b = boil(id, t, .5);
  g.save(); g.translate(x + b[0], y + b[1]); g.rotate(rot + b[2]);
  drawPiece(sheet, 0, 0, 0, sc, 0, 1);
  const m = drawInkAt(0, 14 * sc, CAL.w * sc);
  g.restore();
  // map in world coords (rotation ignored for small angles → apply properly)
  const c = Math.cos(rot + b[2]), s = Math.sin(rot + b[2]);
  return { k: m.k, p: (u, v) => { const lx = m.x0 + u * m.k, ly = m.y0 + v * m.k; return [x + b[0] + lx * c - ly * s, y + b[1] + lx * s + ly * c]; } };
}
// text cut from a paper texture with soft shadow
function cutText(txt, size, tex = 'paper_red', font = 'Kufi', weight = 900) {
  const c = mk(size * txt.length * .9 + 80, size * 1.6), x = c.getContext('2d');
  x.direction = 'rtl'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `${weight} ${size}px ${font}`;
  x.fillText(txt, c.width / 2, c.height / 2); x.globalCompositeOperation = 'source-in'; x.drawImage(A[tex], 0, 0, c.width, c.height);
  const s = mk(c.width + 60, c.height + 60), sx = s.getContext('2d'); sx.filter = 'blur(12px) brightness(0)'; sx.drawImage(c, 30, 30);
  return { c, s };
}
function drawCutText(o, x, y, sc = 1, rot = 0, lift = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc, sc);
  g.globalAlpha = .5; g.drawImage(o.s, -o.s.width / 2 + 10 + lift, -o.s.height / 2 + 16 + lift); g.globalAlpha = 1;
  g.drawImage(o.c, -o.c.width / 2, -o.c.height / 2); g.restore();
}
// qalam with its nib tip at (x,y); dir = angle the pen body points to (from nib), thin = thickness scale
function drawQalam(x, y, len, rot = 0, thin = 1, alpha = 1) {
  const k = len / A.qalam.width, uN = 1127 * k, vN = 449 * k;
  g.save(); g.globalAlpha *= alpha; g.translate(x, y); g.rotate(rot); g.scale(-1, thin);
  g.save(); g.globalAlpha *= .4; g.drawImage(A.qalamSh, -uN - 30 * k - 20, -vN - 30 * k + 30, A.qalamSh.width * k, A.qalamSh.height * k); g.restore();
  g.drawImage(A.qalam, -uN, -vN, len, A.qalam.height * k); g.restore();
}
// calligraphic ribbon: flat nib at fixed angle swept along pts (progress p)
function penRibbon(pts, nib, ang, p, color = INK) {
  const n = Math.max(2, Math.floor(pts.length * clamp(p))); if (p <= 0) return;
  const dx = Math.cos(ang) * nib / 2, dy = Math.sin(ang) * nib / 2;
  g.save(); g.fillStyle = color; g.beginPath();
  for (let i = 0; i < n; i++) { const [x, y] = pts[i]; i ? g.lineTo(x + dx, y + dy) : g.moveTo(x + dx, y + dy); }
  for (let i = n - 1; i >= 0; i--) { const [x, y] = pts[i]; g.lineTo(x - dx, y - dy); }
  g.closePath(); g.fill(); g.restore();
}
// hand-drawn circle (red marker)
function handCircle(x, y, r, p, seed = 1, color = RED, width = 5) {
  const pts = [], rr = rng(seed), ph = rr() * 6;
  for (let i = 0; i <= 60; i++) { const a = -Math.PI / 2 - i / 60 * Math.PI * 2.15, j = 1 + Math.sin(i * .3 + ph) * .05; pts.push([x + Math.cos(a) * r * j, y + Math.sin(a) * r * .86 * j]); }
  pathReveal(pts, p, { color, width });
}
// small pinned tag (cream/red chip)
const TAGS = {};
function tag(txt, t, t0, x, y, rot = 0, kind = 'red', fs = 40, t1 = null) {
  const key = txt + kind + fs; if (!TAGS[key]) TAGS[key] = makeTape(txt, 7000 + Object.keys(TAGS).length * 7, txt.length * fs * .62 + 70, kind, kind === 'red' || kind === 'dark' ? CREAM : INK, fs, fs * 1.75);
  tapeIn(TAGS[key], t, t0, t1, x, y, rot, 7000 + (key.length * 13) % 997, 'pop');
}
// precompute tags at init so first use doesn't stall
function preTag(list) { for (const [txt, kind = 'red', fs = 40] of list) tag(txt, -1, 1e9, 0, 0, 0, kind, fs); }
