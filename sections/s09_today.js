// ════════════════════════════════════════════════════════════════════
//  S09 · 188.92 – 236.0  «واليوم لم يبقَ الثلث حبيس الأوراق القديمة، بل يبدأ من قصبة الخطاط
//  ليعبر المسح الضوئي عالي الدقة، ويتحول عبر الفكتر في الإليستريتر إلى منحنيات صافية
//  يمكن تكبيرها لعمائر المساجد دون أن تتكسر، ومن تطبيقات الذكاء الاصطناعي وبروكريت إلى
//  ماكينة الليزر التي تنحته على الرخام والمعدن والأخشاب. سيبقى خط الثلث شاهداً خالداً
//  على أن الكلمة العربية حين تُهندَس تتحول إلى سلطان يتربع على عرش الجمال إلى الأبد»
//  Idea: the word in a cage on old paper → bars burst → reed writes it fresh → scanner
//  bar pixelates it → vector nodes trace it → infinite zoom (pixels break, vector stays)
//  → monumental façade with a tiny scribe for scale → tablet + AI variants → laser
//  engraves marble / metal / wood → geometry returns, every red nuqta flies in to build
//  the crown, the sheet rises onto its throne. End.
// ════════════════════════════════════════════════════════════════════
(() => {
  const S = { from: 188.92, to: 236.1 };
  const TT = { wipe: 188.92, old: 189.3, cage: 191.35, oldTag: 192.0, burst: 193.6, reed: 194.2, write1: 196.0,
    scan: 196.05, scanTag: 197.1, hi: 198.3, vec: 199.2, vecTag: 200.8, curves: 202.86, zoom: 204.4, mosque: 205.95, noBreak: 207.4,
    tablet: 209.9, ai: 211.8, procreate: 213.1, laser: 214.2, marble: 217.1, metal: 217.62, wood: 218.36,
    stay: 220.0, witness: 222.06, geo: 225.1, eng: 227.16, crownDots: 227.8, sultan: 229.7, throne: 230.5, beauty: 232.2, ever: 233.2, black: 235.2 };
  const P = {};
  S.init = async () => {
    P.old = piece({ w: 1180, h: 680, tex: 'kraft', seed: 901, rough: 10 });
    P.fresh = piece({ w: 1180, h: 680, tex: 'cream', seed: 902, rough: 9, tint: 'rgba(246,238,218,.7)' });
    P.inkf = mk(inkW, inkH); { const x = P.inkf.getContext('2d'); x.drawImage(A.ink, 0, 0); x.drawImage(A.dot, 0, 0); }
    // pixelated version (scan)
    const px = mk(Math.ceil(inkW / 16), Math.ceil(inkH / 16)); px.getContext('2d').drawImage(P.inkf, 0, 0, px.width, px.height); P.px = px;
    P.inkOld = mk(inkW, inkH); { const x = P.inkOld.getContext('2d'); x.drawImage(P.inkf, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = '#3b2a1a'; x.fillRect(0, 0, inkW, inkH); }
    // materials
    const mat = (kind) => { const c = mk(1240, 640), x = c.getContext('2d'), r = rng(910 + kind.length);
      if (kind === 'marble') { x.fillStyle = '#e8e4dc'; x.fillRect(0, 0, 1240, 640); for (let i = 0; i < 40; i++) { x.strokeStyle = `rgba(90,90,96,${.08 + r() * .25})`; x.lineWidth = .6 + r() * 2.5; x.beginPath(); let px2 = r() * 1240, py = r() * 640; x.moveTo(px2, py); for (let j = 0; j < 12; j++) { px2 += (r() - .3) * 120; py += (r() - .5) * 70; x.lineTo(px2, py); } x.stroke(); } }
      if (kind === 'metal') { const gr = x.createLinearGradient(0, 0, 0, 640); gr.addColorStop(0, '#8d9096'); gr.addColorStop(.5, '#c9ccd1'); gr.addColorStop(1, '#7c7f85'); x.fillStyle = gr; x.fillRect(0, 0, 1240, 640); for (let i = 0; i < 500; i++) { x.strokeStyle = `rgba(255,255,255,${r() * .12})`; x.beginPath(); const y = r() * 640; x.moveTo(0, y); x.lineTo(1240, y + (r() - .5) * 4); x.stroke(); } }
      if (kind === 'wood') { x.fillStyle = '#9a6a3a'; x.fillRect(0, 0, 1240, 640); for (let i = 0; i < 70; i++) { x.strokeStyle = `rgba(60,34,14,${.1 + r() * .3})`; x.lineWidth = 1 + r() * 3; x.beginPath(); const y = r() * 640; for (let xx = 0; xx <= 1240; xx += 40) x.lineTo(xx, y + Math.sin(xx * .01 + i) * 8 + Math.sin(xx * .003 + i * 2) * 20); x.stroke(); } }
      return piece({ w: 1240, h: 640, tex: 'cream', seed: 915 + kind.length, rough: 3, content: (cx, w, h) => cx.drawImage(c, 0, 0, w, h), tint: 'rgba(0,0,0,0)', fiber: 0 }); };
    P.mats = ['marble', 'metal', 'wood'].map(mat);
    P.engr = ['#4d4a48', '#2a2b2e', '#2b170a'].map(col => { const c = mk(inkW, inkH), x = c.getContext('2d'); x.drawImage(P.inkf, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, inkW, inkH); return c; });
    P.tablet = piece({ w: 980, h: 660, tex: 'dark', seed: 920, rough: 4 });
    P.screen = piece({ w: 880, h: 560, tex: 'cream', seed: 921, rough: 2, tint: 'rgba(246,238,218,.75)' });
    P.thumb = piece({ w: 250, h: 150, tex: 'cream', seed: 922, rough: 4, tint: 'rgba(246,238,218,.7)' });
    P.steps = [0, 1, 2].map(i => piece({ w: 1500 - i * 220, h: 110, tex: i % 2 ? 'cream' : 'kraft', seed: 930 + i, rough: 5 }));
    preTag([['حبيس الأوراق القديمة', 'dark', 48], ['قصبة الخطاط', 'cream', 48], ['مسح ضوئي', 'cream', 48], ['عالي الدقة', 'red', 44], ['الفكتر', 'dark', 48],
      ['منحنيات صافية', 'red', 48], ['بكسل', 'dark', 40], ['فكتر', 'red', 40], ['دون أن تتكسر', 'cream', 46], ['عمائر المساجد', 'cream', 46],
      ['الذكاء الاصطناعي', 'dark', 46], ['بروكريت', 'cream', 46], ['ماكينة الليزر', 'red', 48], ['الرخام', 'cream', 46], ['المعدن', 'dark', 46], ['الأخشاب', 'cream', 46],
      ['شاهداً خالداً', 'red', 52], ['حين تُهندَس', 'cream', 48], ['سلطان', 'red', 60], ['عرش الجمال', 'dark', 52], ['إلى الأبد', 'cream', 52]]);
  };

  // vector outline of the word in screen space (map m), progress p, nodes
  function vecOutline(m, p, lw = 3, nodes = true, scl = 1) {
    const all = THULUTH_VEC; let total = 0; all.forEach(poly => total += poly.length);
    let budget = Math.floor(total * clamp(p));
    for (const poly of all) { if (budget <= 0) break; const n = Math.min(poly.length, budget); budget -= n;
      const pts = poly.slice(0, n).map(([u, v]) => m.p(u, v)); if (n === poly.length) pts.push(pts[0]);
      g.save(); g.strokeStyle = RED; g.lineWidth = lw / scl; g.lineJoin = 'round'; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
      if (nodes) { g.fillStyle = CREAM; g.strokeStyle = RED; g.lineWidth = 1.5 / scl; const s = 11 / scl; for (let i = 0; i < n; i += 3) { const [x, y] = pts[i]; g.fillRect(x - s / 2, y - s / 2, s, s); g.strokeRect(x - s / 2, y - s / 2, s, s); } }
      g.restore(); }
  }
  const mapAt = (x, y, w) => inkMap(x, y, w);

  function sceneCageToVector(t) {
    // camera: steady, slow push; infinite zoom phase handled below
    const zin = smooth(TT.zoom, TT.zoom + 1.4, t), zout = smooth(TT.mosque - .1, TT.mosque + 1.1, t);
    const zs = Math.exp(Math.log(5.5) * zin * (1 - zout));
    const fx = 960 + 120, fy = 520;   // zoom target near the tha
    camBegin(t, zs * (1 - .3 * zout), lerp(960, fx, zin * (1 - zout)), lerp(540, fy, zin * (1 - zout)) + zout * 160, 0, shake(t, TT.burst, 10));
    const W0 = 1000, b = boil(940, t, .5);
    // paper: old kraft, then the fresh cream sheet slides over at «قصبة»
    drawPiece(P.old, 960 + b[0], 540 + b[1], -.01, 1, 0, 1);
    const fk = spring(t - TT.reed, 140, 20);
    if (fk > 0) drawPiece(P.fresh, lerp(2400, 960, fk) + b[0], 540 + b[1], .004, 1, 0, 1);
    const m = mapAt(960, 548, W0);
    if (fk < .999) { g.save(); g.beginPath(); g.rect(-500, -500, lerp(2400, 960, fk) - 590 + 500, 2200); g.clip(); g.drawImage(P.inkOld, m.x0, m.y0, m.w, m.h); g.restore(); }
    // cage bars
    const bo = spring(t - TT.burst, 160, 14);
    for (let i = 0; i < 9; i++) { const k = spring(t - (TT.cage + i * .05), 300, 18); if (k <= 0) continue;
      const x = 960 - 520 + i * 130, dir = i < 4 ? -1 : 1, fly = bo * (1500 + i * 60);
      g.save(); g.translate(x + dir * fly * .6, lerp(-900, 540, k) - fly * .9); g.rotate(dir * bo * 1.2); g.fillStyle = '#16130f'; g.fillRect(-9, -380, 18, 760); g.fillStyle = RED; g.fillRect(-9, -380, 18, 26); g.fillRect(-9, 354, 18, 26); g.restore(); }
    if (t > TT.cage) { const k = spring(t - (TT.cage + .45), 300, 18) * (1 - bo); g.save(); g.fillStyle = '#16130f'; g.globalAlpha = clamp(k); g.fillRect(960 - 560, 540 - 380 - 20, 1120 * k, 26); g.fillRect(960 + 560 - 1120 * k, 540 + 360, 1120 * k, 26); g.restore(); }
    tag('حبيس الأوراق القديمة', t, TT.oldTag, 960, 940, -.02, 'dark', 48, TT.burst);
    // the reed writes it fresh
    if (fk > .3) {
      const p = clamp((t - (TT.reed + .25)) / (TT.write1 - TT.reed - .25));
      const sc = smooth(TT.scan, TT.scan + 2.6, t);    // scan bar position 0..1 (top→bottom over the word)
      const yBar = lerp(m.y0 - 40, m.y0 + m.h + 40, sc);
      const vk = smooth(TT.vec, TT.vec + .8, t);         // pixels → crisp
      // crisp ink (above scan line, before vector), pixel ink after scan, crisp again after vector
      g.save(); g.beginPath(); if (t > TT.scan) g.rect(-5000, yBar, 12000, 9000); else g.rect(-5000, -5000, 12000, 12000); g.clip();
      if (p > 0) { g.drawImage(inkFrame(p), m.x0, m.y0, m.w, m.h); if (p > .97) g.drawImage(A.dot, m.x0, m.y0, m.w, m.h); } g.restore();
      if (t > TT.scan) { g.save(); g.beginPath(); g.rect(-5000, -5000, 12000, yBar + 5000); g.clip(); g.imageSmoothingEnabled = false;
        // zoom phase: left half pixels, right half vector-crisp
        g.globalAlpha = 1 - vk * (1 - zin * (1 - zout)) ; g.drawImage(P.px, m.x0, m.y0, m.w, m.h); g.imageSmoothingEnabled = true; g.restore();
        if (vk > 0) { g.save(); const split = zin * (1 - zout) > .02; if (split) { g.beginPath(); g.rect(fx, -5000, 9000, 12000); g.clip(); g.fillStyle = '#efe5cf'; g.fillRect(fx, 0, 3000, 1080); }
          g.globalAlpha = split ? 1 : vk; g.drawImage(P.inkf, m.x0, m.y0, m.w, m.h); g.restore();
          if (split) { g.save(); g.strokeStyle = RED; g.lineWidth = 3 / zs; g.beginPath(); g.moveTo(fx, 0); g.lineTo(fx, 1080); g.stroke(); g.restore(); } }
        // grid lines + scan bar
        if (sc > 0 && sc < 1) { g.save(); g.fillStyle = 'rgba(250,246,236,.85)'; g.fillRect(m.x0 - 80, yBar - 5, m.w + 160, 10); g.fillStyle = 'rgba(179,38,43,.9)'; g.fillRect(m.x0 - 80, yBar - 1, m.w + 160, 2); g.restore(); }
      }
      // qalam follows the writing
      const qo = spring(t - (TT.write1 + .05), 150, 22);
      if (p > 0 && qo < .999) { const u = 1 - p; const nx = m.x0 + lerp(1180, 60, p) * m.k, ny = m.y0 + (300 + Math.sin(p * 25) * 120) * m.k; drawQalam(nx + qo * 1500, ny - qo * 600, 640, -.62, 1, 1); }
      tag('قصبة الخطاط', t, TT.reed + .4, 520, 200, -.05, 'cream', 48, TT.scan);
      tag('مسح ضوئي', t, TT.scanTag, 1420, 190, .04, 'cream', 48, TT.vec);
      tag('عالي الدقة', t, TT.hi, 1500, 290, -.03, 'red', 44, TT.vec);
      // vector nodes
      const vp = smooth(TT.vec + .2, TT.vec + 2.6, t);
      if (vp > 0) vecOutline(m, vp, 4.5, t < TT.mosque, zs);
      tag('الفكتر', t, TT.vecTag, 520, 200, -.05, 'dark', 48, TT.zoom);
      tag('منحنيات صافية', t, TT.curves, 1400, 200, .04, 'red', 48, TT.zoom);
    }
    g.restore();
    // zoom labels in screen space
    if (zin * (1 - zout) > .5) { g.setTransform(1, 0, 0, 1, 0, 0); tag('بكسل', t, TT.zoom + .9, 760, 120, -.04, 'dark', 40, TT.mosque); tag('فكتر', t, TT.zoom + .9, 1160, 120, .04, 'red', 40, TT.mosque); }
  }

  function sceneMosque(t) {
    const k = spring(t - TT.mosque, 90, 18);
    camBegin(t, lerp(1.4, 1, k), 960, 560, 0, 0);
    // façade: big arch + dome + minarets, the word as a band
    g.save(); g.translate(0, lerp(500, 0, k)); g.fillStyle = '#8a6238';
    g.beginPath(); g.arc(960, 470, 300, Math.PI, 0); g.rect(560, 470, 800, 560); g.fill();
    g.fillRect(380, 190, 50, 840); g.fillRect(1490, 190, 50, 840); g.beginPath(); g.moveTo(370, 190); g.lineTo(405, 60); g.lineTo(440, 190); g.moveTo(1480, 190); g.lineTo(1515, 60); g.lineTo(1550, 190); g.fill();
    g.fillStyle = '#efe5cf'; g.fillRect(600, 520, 720, 200);
    const m = mapAt(960, 622, 430); g.drawImage(P.inkf, m.x0, m.y0, m.w, m.h);
    g.fillStyle = '#16130f'; g.beginPath(); g.arc(960, 900, 110, Math.PI, 0); g.rect(850, 900, 220, 140); g.fill();
    g.restore();
    // tiny scribe for scale
    const sk = spring(t - (TT.mosque + .6), 200, 18); if (sk > 0) { g.save(); g.fillStyle = '#efe5cf'; g.fillRect(0, 1030, 1920, 60); g.restore(); drawCut(A.scribe, A.scribeSh, 760, 1034, 120 * sk, 0, 0, 1, false, 1); }
    tag('عمائر المساجد', t, TT.mosque + .3, 960, 150, -.02, 'cream', 46, TT.tablet);
    tag('دون أن تتكسر', t, TT.noBreak, 1580, 820, .04, 'red', 46, TT.tablet);
    g.restore();
  }

  function sceneTablet(t) {
    const k = spring(t - TT.tablet, 130, 19);
    camBegin(t, 1, 960, 540, 0, 0);
    const x = lerp(-900, 820, k), y = 540, b = boil(950, t, .5);
    drawPiece(P.tablet, x + b[0], y + b[1], -.03, 1, 0, 1); drawPiece(P.screen, x + b[0], y + b[1], -.03, 1, 0, 1);
    const p = clamp((t - (TT.tablet + .5)) / 2.6), m = mapAt(x, y + 10, 700);
    if (p > 0) { g.save(); g.translate(x, y); g.rotate(-.03); g.translate(-x, -y); g.drawImage(inkFrame(p), m.x0, m.y0, m.w, m.h); if (p > .97) g.drawImage(A.dot, m.x0, m.y0, m.w, m.h); g.restore(); }
    if (p > 0 && p < 1) drawQalam(m.x0 + lerp(1180, 60, p) * m.k, m.y0 + (300 + Math.sin(p * 25) * 120) * m.k, 520, -.62, .3, 1);
    // AI variants pop beside the tablet
    for (let i = 0; i < 3; i++) { const s = spring(t - (TT.ai + .15 + i * .18), 260, 16); if (s <= 0) continue; const tx = 1530, ty = 250 + i * 270, rot = (i - 1) * .05;
      drawPiece(P.thumb, tx, ty, rot, s, 0, 1); g.save(); g.translate(tx, ty); g.rotate(rot + (i - 1) * .12); g.scale(s * (1 + i * .08), s * (1 - i * .06)); const mm = mapAt(0, 0, 200); g.drawImage(P.inkf, mm.x0, mm.y0, mm.w, mm.h); g.restore(); }
    tag('الذكاء الاصطناعي', t, TT.ai, 1530, 90, .03, 'dark', 46, TT.laser);
    tag('بروكريت', t, TT.procreate, 820, 930, -.03, 'cream', 46, TT.laser);
    g.restore();
  }

  function sceneLaser(t) {
    camBegin(t, 1, 960, 540, 0, 0);
    const kin = spring(t - TT.laser, 130, 19);
    // three slabs slide in turn
    const swaps = [TT.laser, TT.marble, TT.metal, TT.wood];
    for (let i = 0; i < 3; i++) { const kk = spring(t - swaps[i + 1] + (i === 0 ? 3 : 0), 160, 20), ko = i < 2 ? spring(t - swaps[i + 2], 160, 20) : 0;
      const xin = i === 0 ? lerp(2600, 960, kin) : lerp(2600, 960, spring(t - swaps[i + 1], 160, 20)); const x = xin - ko * 1700; if (x > 2500 || x < -800) continue;
      drawPiece(P.mats[i], x, 600, 0, 1, 0, 1);
      // engraving progress along the word
      const p = i === 0 ? clamp((t - (TT.laser + .6)) / 2.2) : 1;
      const m = mapAt(x, 610, 900); if (p > 0) { const f = inkFrame(Math.max(.001, p)); g.save(); g.globalAlpha = .92; const c = P.engr[i]; g.drawImage(f, m.x0, m.y0, m.w, m.h); g.globalCompositeOperation = 'source-atop'; g.restore(); }
      if (p >= 1) g.drawImage(P.engr[i], m.x0, m.y0, m.w, m.h);
    }
    // gantry + head + beam
    const p = clamp((t - (TT.laser + .6)) / 2.2), m = mapAt(960, 610, 900);
    const hx = m.x0 + lerp(1180, 60, p) * m.k + Math.sin(t * 40) * 6, hy = m.y0 + (300 + Math.sin(p * 25) * 120) * m.k;
    g.save(); g.translate(0, lerp(-500, 0, kin)); g.fillStyle = '#1c1916'; g.fillRect(200, 150, 1520, 40); g.fillStyle = '#2b2622'; g.fillRect(hx - 50, 130, 100, 110);
    if (p > 0 && p < 1) { g.strokeStyle = RED; g.lineWidth = 3; g.beginPath(); g.moveTo(hx, 240); g.lineTo(hx, hy); g.stroke(); nuqta(g, hx, hy, 18, RED, 0); }
    g.restore();
    tag('ماكينة الليزر', t, TT.laser + .9, 960, 90, -.02, 'red', 48, TT.marble);
    tag('الرخام', t, TT.marble, 1500, 960, .04, 'cream', 46, TT.metal);
    tag('المعدن', t, TT.metal, 1500, 960, -.04, 'dark', 46, TT.wood);
    tag('الأخشاب', t, TT.wood, 1500, 960, .03, 'cream', 46, TT.stay);
    g.restore();
  }

  function sceneFinale(t) {
    const pull = smooth(TT.ever, 236, t);
    camBegin(t, lerp(1.0, .9, pull), 960, 540 - spring(t - TT.throne, 90, 18) * 60, 0, shake(t, TT.sultan + .1, 6));
    const k = spring(t - TT.stay, 110, 19), rise = spring(t - TT.throne, 90, 18);
    // throne steps rise
    for (let i = 0; i < 3; i++) { const s = spring(t - (TT.throne + i * .18), 160, 18); if (s <= 0) continue; drawPiece(P.steps[i], 960, lerp(1500, 1010 - i * 100, s), 0, 1, 0, 1); }
    const y = lerp(1500, 520, k) - rise * 150;
    const C = drawSheetState(t, { x: 960, y, sc: .78, dots: false, crown: smooth(TT.sultan, TT.sultan + .4, t), crownLift: 0 });
    // geometry construction returns
    const gp = smooth(TT.geo, TT.geo + 1.4, t);
    if (gp > 0) { const cx = C.x + 1180 * C.k, cy = C.y + 330 * C.k, R = 230 * C.k * 1.5;
      g.save(); g.globalAlpha = 1 - smooth(TT.crownDots, TT.crownDots + .5, t);
      pathReveal(Array.from({ length: 61 }, (_, i) => [cx + Math.cos(-Math.PI / 2 - i / 60 * 6.283) * R, cy + Math.sin(-Math.PI / 2 - i / 60 * 6.283) * R]), gp, { color: RED, width: 3 });
      pathReveal([[cx, cy - R], [cx + R, cy], [cx, cy + R], [cx - R, cy]], smooth(TT.geo + .5, TT.geo + 1.6, t), { color: RED, width: 2.5, closed: true });
      pathReveal([[C.x - 20, C.y + 560 * C.k], [C.x + C.w + 20, C.y + 560 * C.k]], smooth(TT.eng, TT.eng + .6, t), { color: RED, width: 2.5, dash: [10, 8] });
      g.restore(); }
    // red nuqtas fly in and assemble the crown, which then turns gold
    const cwid = 360 * .78, kk = cwid / A.crown.width, chh = A.crown.height * kk, cxp = C.x + 1110 * C.k, cyp = C.y - 6 * C.k;
    const ca = smooth(TT.sultan - .1, TT.sultan + .4, t);
    if (t > TT.crownDots && ca < 1) CROWN_PTS.forEach(([u, v], i) => { const s = spring(t - (TT.crownDots + (i % 17) * .06), 120, 15);
      const a0 = hash(i, 3) * 6.283, r0 = 1400 + hash(i, 4) * 600, tx = cxp - cwid / 2 + u * kk, ty = cyp - chh + v * kk;
      const x = lerp(960 + Math.cos(a0) * r0, tx, s), yy = lerp(540 + Math.sin(a0) * r0, ty, s); g.save(); g.globalAlpha = 1 - ca; nuqta(g, x, yy, 22, RED, 0); g.restore(); });
    tag('شاهداً خالداً', t, TT.witness, 960, y + 360, -.02, 'red', 52, TT.geo);
    tag('حين تُهندَس', t, TT.eng, 520, y - 330, -.05, 'cream', 48, TT.crownDots + .3);
    tag('سلطان', t, TT.sultan + .1, 1450, y - 330, .05, 'red', 60);
    tag('عرش الجمال', t, TT.beauty, 960, 1080 - 70, 0, 'dark', 52);
    tag('إلى الأبد', t, TT.ever, 470, y - 330, -.05, 'cream', 52);
    g.restore();
  }

  S.draw = (t) => {
    if (!wipeCovered(t, TT.wipe)) { SECTIONS.find(s => s.id === 's08').draw(t); paperWipe(t, TT.wipe); return; }
    if (t < TT.mosque - .05) sceneCageToVector(t);
    else if (t < TT.tablet - .1) sceneMosque(t);
    else if (t < TT.laser) sceneTablet(t);
    else if (t < TT.stay) sceneLaser(t);
    else sceneFinale(t);
    finishFrame(t);
    paperWipe(t, TT.wipe);
    // transitions: quick paper wipes between chapters
    for (const tw of [TT.tablet - .45, TT.laser - .35, TT.stay - .35]) { if (t > tw && t < tw + .7) paperWipe(t, tw); }
    const bk = smooth(TT.black, 236.0, t); if (bk > 0) { g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = `rgba(0,0,0,${bk})`; g.fillRect(0, 0, W, H); }
  };
  SECTIONS.push({ id: 's09', from: S.from, to: S.to, init: S.init, draw: S.draw });
})();
