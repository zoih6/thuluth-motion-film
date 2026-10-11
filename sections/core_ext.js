// ════════════════════════════════════════════════════════════════════
//  Shared helpers for sections s02+ (loaded after the main script)
// ════════════════════════════════════════════════════════════════════
const EXT = {};

// camera: draws bg with parallax, applies world transform. Caller must g.restore().
function camBegin(t, s = 1, cx = 960, cy = 540, crot = 0, sh = 0) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  const d = camDrift(t); cx += d[0]; cy += d[1]; if (window.CAMOFF) { cx += CAMOFF[0]; cy += CAMOFF[1]; }
  CAM = { cx, cy, s, crot, sh };
  if (!window.NOBG) g.drawImage(bg, -100 - (cx - 960) * .02, -100 - (cy - 540) * .02);
  g.save(); g.translate(W / 2 + sh, H / 2 + sh * .6); g.scale(s, s); g.rotate(crot); g.translate(-cx, -cy);
}
function finishFrame(t) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.save(); g.globalCompositeOperation = 'overlay'; g.globalAlpha = .10; g.drawImage(grain[Math.floor(t * 12) % 4], 0, 0, W, H); g.restore();
  g.drawImage(vign, 0, 0);
}
const veil = (a) => { if (a <= 0) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = `rgba(8,7,6,${a})`; g.fillRect(0, 0, W, H); g.restore(); };

// label tape / strip factories
function makeTape(txt, seed, w = 480, tex = 'cream', col = INK, fs = 54, h = 96) {
  return piece({ w, h, tex, seed, rough: 3, fiber: .25, tint: tex === 'cream' ? 'rgba(236,226,196,.55)' : null,
    content: (x, w, h) => { x.fillStyle = col; x.direction = 'rtl'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `800 ${fs}px Kufi`; x.fillText(txt, w / 2, h / 2 + 4); } });
}
// spring-in tape with boil; returns nothing. dir: 'pop' | 'left' | 'right' | 'up'
function tapeIn(p, t, t0, t1, x, y, rot = 0, id = 1, dir = 'pop') {
  const k = spring(t - t0, ...SNAPPY), ko = t1 ? spring(t - t1, 220, 26) : 0;
  if (k <= 0.001 || ko >= .999) return;
  const b = boil(id, t);
  let dx = 0, dy = 0, sc = 1, r = rot;
  if (dir === 'pop') { sc = lerp(1.4, 1, k); r += (1 - k) * .25; }
  else if (dir === 'left') dx = -(1 - k) * 900; else if (dir === 'right') dx = (1 - k) * 900; else if (dir === 'up') dy = (1 - k) * 400;
  dx -= ko * 1800;
  drawPiece(p, x + dx + b[0], y + dy + b[1], r + b[2], sc, 0, 1);
}

// polyline progressive reveal (0..1), optional dash
function pathReveal(pts, p, { color = RED, width = 4, dash = null, closed = false } = {}) {
  if (p <= 0) return;
  const seg = []; let L = 0;
  const P = closed ? [...pts, pts[0]] : pts;
  for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seg.push(l); L += l; }
  let rem = L * clamp(p);
  g.save(); g.strokeStyle = color; g.lineWidth = width; g.lineCap = 'round'; g.lineJoin = 'round'; if (dash) g.setLineDash(dash);
  g.beginPath(); g.moveTo(P[0][0], P[0][1]);
  for (let i = 1; i < P.length && rem > 0; i++) {
    const l = seg[i - 1], k = Math.min(1, rem / l);
    g.lineTo(lerp(P[i - 1][0], P[i][0], k), lerp(P[i - 1][1], P[i][1], k)); rem -= l;
  }
  g.stroke(); g.restore();
}
// hand-drawn line between two points (slight wobble), progressive
function handLine(x0, y0, x1, y1, p, color = RED, width = 5, seed = 1) {
  const pts = []; const r = rng(seed), n = 24, ph = r() * 6;
  for (let i = 0; i <= n; i++) { const u = i / n; const wob = Math.sin(u * 7 + ph) * 2.2;
    const nx = -(y1 - y0), ny = x1 - x0, nl = Math.hypot(nx, ny) || 1;
    pts.push([lerp(x0, x1, u) + nx / nl * wob, lerp(y0, y1, u) + ny / nl * wob]); }
  pathReveal(pts, p, { color, width });
}
// row/column of measuring nuqtas popping one by one
function dotRow(x, y, dx, dy, n, size, t, t0, step = .09, color = RED) {
  for (let k = 0; k < n; k++) { const st = spring(t - (t0 + k * step), 320, 16); if (st <= 0) continue;
    nuqta(g, x + dx * k, y + dy * k, size * st, color, k % 2 ? .04 : -.04); }
}

// the end state of s01: sheet + calligraphy + crown + red dot column
// o = {x, y, sc, crown(0..1 alpha/present), crownLift(px), dots(bool)}
function drawSheetState(t, o) {
  const ss = o.sc ?? 1, x = o.x ?? 960, y = o.y ?? 548;
  const b = boil(500, t, .5);
  drawPiece(sheet, x + b[0], y + b[1], b[2], ss, o.lift || 0, 1);
  const cw = CAL.w * ss, ch = cw * inkH / inkW;
  const C = { x: x - cw / 2, y: y - ch / 2 + 14 * ss, k: cw / inkW, w: cw, h: ch };
  g.drawImage(A.ink, C.x, C.y, cw, ch); g.drawImage(A.dot, C.x, C.y, cw, ch);
  if (o.dots !== false) for (let k = 0; k < 6; k++) nuqta(g, C.x + 1268 * C.k, C.y + (500 - k * 66) * C.k, 46 * C.k, RED, k % 2 ? 0.04 : -0.04);
  if ((o.crown ?? 1) > 0) {
    const cwid = 360 * ss, chh = cwid * A.crown.height / A.crown.width, kk = cwid / A.crown.width;
    const cxp = C.x + 1110 * C.k, cyp = C.y - 6 * C.k - (o.crownLift || 0);
    g.save(); g.translate(cxp, cyp); g.rotate(-0.07 + (o.crownRot || 0));
    g.globalAlpha = .55; g.drawImage(A.crownSh, -cwid / 2 - 36 * kk + 9, -chh - 36 * kk + 14, A.crownSh.width * kk, A.crownSh.height * kk);
    g.globalAlpha = 1; g.drawImage(A.crown, -cwid / 2, -chh, cwid, chh); g.restore();
  }
  return C;
}

// draw an image cutout with baked silhouette shadow (silhouette made at init)
function drawCut(img, sh, x, y, w, rot = 0, lift = 0, alpha = 1, flip = false, anchorY = .5) {
  const k = w / img.width, h = img.height * k;
  g.save(); g.translate(x, y); g.rotate(rot); if (flip) g.scale(-1, 1); g.globalAlpha = alpha * .5;
  if (sh) { const pad = (sh.width - img.width) / 2; g.drawImage(sh, -w / 2 - pad * k + 8 + lift * 18, -h * anchorY - pad * k + 12 + lift * 24, sh.width * k, sh.height * k); }
  g.globalAlpha = alpha; g.drawImage(img, -w / 2, -h * anchorY, w, h); g.restore();
}

// rubber stamp (procedural ink texture)
function makeStamp(txt, seed, w = 760, h = 230, fs = 128) {
  const c = mk(w + 40, h + 40), x = c.getContext('2d');
  x.translate(20, 20); x.strokeStyle = RED; x.fillStyle = RED; x.lineWidth = 12;
  const rr = 26; x.beginPath(); x.roundRect(6, 6, w - 12, h - 12, rr); x.stroke();
  x.lineWidth = 4; x.beginPath(); x.roundRect(24, 24, w - 48, h - 48, rr * .6); x.stroke();
  x.direction = 'rtl'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `900 ${fs}px Kufi`; x.fillText(txt, w / 2, h / 2 + 10);
  // worn rubber: knock out speckles + streaks
  const r = rng(seed); x.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 2600; i++) { const s = r() * r() * 7 + .6; x.globalAlpha = .35 + r() * .65; x.beginPath(); x.arc(r() * w, r() * h, s, 0, 6.28); x.fill(); }
  for (let i = 0; i < 26; i++) { x.globalAlpha = .25 + r() * .3; x.fillRect(r() * w, r() * h, 40 + r() * 160, 1 + r() * 3); }
  return c;
}

// paper wipe transition: a big torn sheet sweeps right→left across the screen.
// returns progress so callers know which side to draw (prev under until covered).
function paperWipe(t, t0, dur = .7, tex = 'kraft') {
  if (!EXT.wipe) EXT.wipe = piece({ w: 2300, h: 1500, tex, seed: 4040, rough: 22, tint: 'rgba(150,104,58,.6)' });
  const k = smooth(t0, t0 + dur, t); if (k <= 0 || k >= 1) return;
  const x = lerp(1920 + 1250, -1250, k);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); drawPiece(EXT.wipe, x, 540, -0.05, 1, 0.5, 1); g.restore();
}
const wipeCovered = (t, t0, dur = .7) => t >= t0 + dur * .5;
