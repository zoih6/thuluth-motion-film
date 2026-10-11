// ════════════════════════════════════════════════════════════════════
//  S06 · 81.76 – 103.44  «لماذا هو الأصعب؟ لأن الخطأ فيه لا يُغتفر؛ أي إهمال بسيط في رسم
//  حرف أو حركة يشوّه لوحة بأكملها. يتميز الثلث بحروف طويلة ممشوقة وانحناءات واسعة
//  تمنحه طواعية هائلة في التركيب»
//  Idea: a red paper «؟» drops; one misplaced drop of ink → the loupe → cracks run
//  through the whole panel and it splits. Then tall slender stems rise on a stage,
//  a wide pen-sweep curve joins them, and the pieces re-compose three times.
// ════════════════════════════════════════════════════════════════════
(() => {
  const S = { from: 81.76, to: 103.44 };
  const TT = { wipe: 81.76, q: 81.85, hard: 83.1, because: 83.7, err: 84.9, unforg: 85.9, loupe: 87.0, harf: 89.3, haraka: 90.4,
    crack: 91.35, split: 92.7, away: 93.9, stage: 94.2, tall: 94.35, tallTape: 96.3, slender: 97.3, curve: 98.0, curveTape: 99.4,
    flex: 100.1, lay1: 101.0, lay2: 101.9, lay3: 102.7, comp: 103.0 };
  const P = {};
  S.init = async () => {
    P.q = cutText('؟', 560);
    P.stage = piece({ w: 1560, h: 860, tex: 'cream', seed: 601, rough: 9, tint: 'rgba(246,238,218,.7)' });
    // cracks: branching polylines in ink-space, seeded
    const r = rng(602); P.cracks = [];
    const grow = (x, y, a, len, depth, t0) => {
      const pts = [[x, y]]; let cx = x, cy = y;
      for (let i = 0; i < len; i++) { a += (r() - .5) * .9; cx += Math.cos(a) * 26; cy += Math.sin(a) * 26; pts.push([cx, cy]); }
      P.cracks.push({ pts, t0, w: 4 - depth });
      if (depth < 2) for (let k = 0; k < 2; k++) { const j = 4 + Math.floor(r() * (pts.length - 5)); grow(pts[j][0], pts[j][1], a + (r() - .5) * 2.2, Math.floor(len * .6), depth + 1, t0 + j * .025); }
    };
    for (let i = 0; i < 6; i++) grow(INKPT.tail[0], INKPT.tail[1], i / 6 * Math.PI * 2 + r() * .5, 22 + Math.floor(r() * 12), 0, 0);
    // jagged split line (ink-space x as function of y)
    P.splitL = []; for (let y = -200; y <= 800; y += 40) P.splitL.push([INKPT.tail[0] + 260 + Math.sin(y * .02) * 50 + (r() - .5) * 40, y]);
    // stems for the stage: [x, height]
    P.stems = [[-420, 560], [-250, 470], [-60, 600], [130, 500], [330, 540]];
    preTag([['الأصعب', 'red', 56], ['لا يُغتفر', 'red', 52], ['حرف', 'cream', 40], ['حركة', 'cream', 40], ['يُشوِّه اللوحة', 'dark', 46],
      ['طويلة', 'red', 46], ['ممشوقة', 'cream', 46], ['انحناءات واسعة', 'red', 46], ['طواعية', 'dark', 48], ['التركيب', 'red', 48]]);
  };

  // the panel with the error (word card), drawn possibly twice for the split
  function panel(t, side) {
    const k = spring(t - TT.because, 120, 18);
    const y = lerp(1500, 540, k);
    const m = drawWordCard(t, 960, y, .92, -.01, 610);
    // the careless drop of ink
    const ek = spring(t - TT.err, 400, 16);
    if (ek > 0) { const [ex, ey] = m.p(INKPT.tail[0], INKPT.tail[1]); g.save(); g.fillStyle = INK; g.beginPath();
      for (let i = 0; i <= 14; i++) { const a = i / 14 * 6.283, rr = (34 + Math.sin(i * 2.7) * 5) * m.k * ek; i ? g.lineTo(ex + Math.cos(a) * rr * 1.2, ey + Math.sin(a) * rr) : g.moveTo(ex + rr * 1.2, ey); }
      g.fill(); g.restore();
      handCircle(ex, ey, 70 * m.k, smooth(TT.err + .15, TT.err + .55, t), 611); }
    // cracks
    if (t > TT.crack) for (const c of P.cracks) { const p = smooth(TT.crack + c.t0, TT.crack + c.t0 + .55, t); if (p <= 0) continue;
      const pts = c.pts.map(([u, v]) => m.p(u, v)); pathReveal(pts, p, { color: INK, width: c.w * 1.4 });
      g.save(); g.translate(1.5, 1.5); pathReveal(pts, p, { color: 'rgba(250,244,230,.55)', width: 1 }); g.restore(); }
    return m;
  }

  function sceneA(t) {
    camBegin(t, 1, 960, 540, 0, shake(t, TT.split, 14) + shake(t, TT.err, 3));
    // «؟» drops, swings, and falls away
    const qk = spring(t - TT.q, 160, 13), qo = spring(t - TT.because, 90, 20);
    if (qo < .999) drawCutText(P.q, 960 + qo * 300, lerp(-700, 470, qk) + qo * 1600, 2.3, (1 - qk) * .6 + qo * 1.2 + Math.sin(t * 3) * .02 * (1 - qo), 0);
    tag('الأصعب', t, TT.hard, 1320, 760, .05, 'red', 56, TT.because);
    let m;
    const sp = spring(t - TT.split, 120, 16), aw = spring(t - TT.away, 80, 18);
    if (t < TT.split) m = panel(t);
    else {
      const ink2 = (u, v) => [u, v]; // split line in ink space → screen via panel map (approx, computed per side)
      for (const side of [-1, 1]) {
        g.save();
        // clip by the jagged line, computed with the unsplit panel map
        const mm = inkMap(960, 540 + 14 * .92, CAL.w * .92);
        g.beginPath(); const L = P.splitL.map(([u, v]) => mm.p(u, v));
        if (side < 0) { g.moveTo(-2000, -2000); L.forEach(([x, y], i) => g.lineTo(x, i === 0 ? -2000 : i === L.length - 1 ? 3000 : y)); g.lineTo(-2000, 3000); }
        else { g.moveTo(4000, -2000); L.forEach(([x, y], i) => g.lineTo(x, i === 0 ? -2000 : i === L.length - 1 ? 3000 : y)); g.lineTo(4000, 3000); }
        g.closePath(); g.clip();
        g.translate(side * (40 * sp + 1500 * aw), 18 * sp * side); g.rotate(side * (.035 * sp + .2 * aw));
        m = panel(t); g.restore();
      }
    }
    tag('لا يُغتفر', t, TT.unforg, 600, 250, -.04, 'red', 52, TT.crack);
    // loupe on the shadda/damma
    const lk = spring(t - TT.loupe, 200, 18), lo = spring(t - (TT.crack - .1), 200, 24);
    if (lk > 0 && lo < .999 && m) {
      const [hx, hy] = m.p(INKPT.damma[0], INKPT.damma[1] - 30), R = Math.max(0, 170 * lk * (1 - lo)), Lx = 1380, Ly = 360, Z = 2.6;
      g.save(); g.strokeStyle = 'rgba(239,229,207,.7)'; g.lineWidth = 2; g.setLineDash([6, 8]); g.beginPath(); g.moveTo(hx, hy); g.lineTo(Lx, Ly); g.stroke(); g.restore();
      g.save(); g.beginPath(); g.arc(Lx, Ly, R, 0, 6.283); g.clip(); g.fillStyle = '#efe5cf'; g.fillRect(Lx - R, Ly - R, R * 2, R * 2);
      g.translate(Lx, Ly); g.scale(Z, Z); g.translate(-hx, -hy); panel(t); g.restore();
      // the ghost of the correct position (dashed) vs drawn mark
      g.save(); g.strokeStyle = RED; g.lineWidth = 3; g.setLineDash([8, 7]); const gk = smooth(TT.loupe + .5, TT.loupe + .9, t);
      g.globalAlpha = gk * (1 - lo); g.beginPath(); g.ellipse(Lx - 40, Ly + 30, 46, 40, 0, 0, 6.283); g.stroke(); g.restore();
      g.save(); g.lineWidth = 12; g.strokeStyle = '#2a211a'; g.beginPath(); g.arc(Lx, Ly, R, 0, 6.283); g.stroke(); g.lineWidth = 3; g.strokeStyle = CREAM; g.stroke();
      g.lineWidth = 26; g.lineCap = 'round'; g.strokeStyle = '#2a211a'; g.beginPath(); g.moveTo(Lx + R * .72, Ly + R * .72); g.lineTo(Lx + R * 1.3, Ly + R * 1.3); g.stroke(); g.restore();
      tag('حرف', t, TT.harf, Lx - 190, Ly - 150, -.06, 'cream', 40, TT.crack);
      tag('حركة', t, TT.haraka, Lx + 190, Ly - 150, .06, 'cream', 40, TT.crack);
    }
    tag('يُشوِّه اللوحة', t, TT.crack + .25, 960, 950, -.02, 'dark', 46, TT.away);
    g.restore();
  }

  // stage of stems + curve, three re-compositions
  const LAYS = [
    (i) => [0, 0, 0, 1],                                        // [dx, dy, rot, scale]
    (i) => [[-60, -30, 0, 30, 60][i] * 2, 0, [-.36, -.18, 0, .18, .36][i], 1],          // fan
    (i) => [[120, 60, 0, -60, -120][i], 0, 0, [.55, .7, .85, 1, 1.12][i]],             // stair
    (i) => [[-70, -35, 0, 35, 70][i], 0, .14, .95]];                                  // italic lean
  function sceneB(t) {
    const k = spring(t - TT.stage, 130, 19);
    camBegin(t, 1, 960, 540, 0, 0);
    const b = boil(620, t, .5), sy = lerp(1500, 540, k);
    drawPiece(P.stage, 960 + b[0], sy + b[1], -.008, 1, 0, 1);
    const base = sy + 300, slim = smooth(TT.slender, TT.slender + .6, t);
    const layK = [spring(t - TT.lay1, 160, 17), spring(t - TT.lay2, 160, 17), spring(t - TT.lay3, 160, 17)];
    const lay = (i) => { let v = LAYS[0](i); for (let j = 0; j < 3; j++) { const a = LAYS[j](i), c = LAYS[j + 1](i); v = v.map((q, n) => q + (c[n] - a[n]) * layK[j]); } return v; };
    P.stems.forEach(([x, h], i) => {
      const gk = spring(t - (TT.tall + i * .14), 140, 15); if (gk <= 0) return;
      const [dx, dy, rot, sc] = lay(i), w = lerp(64, 40, slim), H = h * gk * sc;
      g.save(); g.translate(960 + x + dx, base + dy); g.rotate(rot); g.fillStyle = INK; g.beginPath();
      g.moveTo(-w / 2 - 8, -H); g.lineTo(w / 2 + 6, -H + 18); g.lineTo(w / 2 - 6, -12); g.lineTo(0, 0); g.lineTo(-w / 2, -14); g.closePath(); g.fill(); g.restore();
    });
    // red dimension line on the tallest stem
    const dk = smooth(TT.tallTape - .3, TT.tallTape + .2, t) * (1 - layK[0]);
    if (dk > 0) { const x = 960 - 60 + 70, top = base - 600; g.save(); g.strokeStyle = RED; g.lineWidth = 3; g.globalAlpha = clamp(dk * 2);
      g.beginPath(); g.moveTo(x, base); g.lineTo(x, lerp(base, top, dk)); g.stroke(); g.beginPath(); g.moveTo(x - 12, base); g.lineTo(x + 12, base); g.moveTo(x - 12, top); g.lineTo(x + 12, top); g.stroke(); g.restore(); }
    tag('طويلة', t, TT.tallTape, 960 + 250, base - 640, .04, 'red', 46, TT.flex);
    tag('ممشوقة', t, TT.slender, 960 + 470, base - 560, -.05, 'cream', 46, TT.flex);
    // the wide sweep (flat nib at 40°)
    const cp = smooth(TT.curve, TT.curve + 1.0, t);
    if (cp > 0) {
      const [dx, dy, rot, sc] = lay(2).map((v, n) => n === 2 ? -v * .5 : v);
      const pts = []; for (let i = 0; i <= 80; i++) { const u = i / 80, a = Math.PI * (.05 + .9 * u); pts.push([560 * Math.cos(a), 150 * Math.sin(a) + 30 * u]); }
      g.save(); g.translate(960 + 40 - dx * .5, base - 40 + dy * .3); g.rotate(rot * .3); g.scale(sc, sc); penRibbon(pts, 56, -.7, cp);
      // dimension arc
      const ak = smooth(TT.curveTape - .2, TT.curveTape + .4, t) * (1 - layK[0]);
      if (ak > 0) { const arc = []; for (let i = 0; i <= 40; i++) { const a = Math.PI * (.05 + .9 * i / 40); arc.push([600 * Math.cos(a), 205 * Math.sin(a) + 30]); } pathReveal(arc, ak, { color: RED, width: 3, dash: [10, 8] }); }
      g.restore();
    }
    tag('انحناءات واسعة', t, TT.curveTape, 960 - 360, base + 230, -.03, 'red', 46, TT.flex);
    tag('طواعية', t, TT.lay1 + .1, 960 - 560, sy - 340, -.06, 'dark', 48);
    tag('التركيب', t, TT.comp, 960 + 560, sy - 340, .05, 'red', 48);
    g.restore();
  }

  S.draw = (t) => {
    if (!wipeCovered(t, TT.wipe)) { SECTIONS.find(s => s.id === 's05').draw(t); paperWipe(t, TT.wipe); return; }
    if (t < TT.stage) sceneA(t);
    else if (t < TT.away + 1.0) { sceneB(t); window.NOBG = true; sceneA(t); window.NOBG = false; }
    else sceneB(t);
    finishFrame(t);
    paperWipe(t, TT.wipe);
  };
  S.world = sceneB;
  SECTIONS.push({ id: 's06', from: S.from, to: S.to, init: S.init, draw: S.draw, stage: (t) => sceneB(t) });
})();
