// ════════════════════════════════════════════════════════════════════
//  S03 · 32.64 – 48.64  «بدأت الحكاية في العصر الأموي؛ يوم اشتقه الخطاط «قطبة المحرر»
//  من خط الطومار الكبير، حيث قطّت رأس القصبة بمقدار ثلث عرضه، ومن هنا جاء الاسم.»
//  Idea: rewind along a paper timeline → the scribe + the giant Tumar scroll →
//  ink-dot iris into a macro of the reed → the knife cuts → the cut face is split in thirds.
// ════════════════════════════════════════════════════════════════════
(() => {
  const S = { from: 32.64, to: 48.64 };
  const TT = { wipe: 32.64, rewind: 33.0, era: 35.0, scribe: 36.85, name: 38.42, pan: 39.9, scroll: 40.35, tapeTumar: 41.1,
    arrow: 41.45, iris: 41.95, irisOut: 42.25, knife: 42.45, cut: 43.1, measure: 44.5, third: 45.4, name2: 46.5, write0: 46.85, write1: 48.25 };
  let P = {};
  // reed geometry in its own canvas (tip at left)
  const RW = 1900, RH = 300, CUTX = 250;
  const nibTop = (u) => { // quadratic from (350,90) ctrl (150,100) to (20,188)
    const x = (1 - u) * (1 - u) * 350 + 2 * (1 - u) * u * 150 + u * u * 20, y = (1 - u) * (1 - u) * 90 + 2 * (1 - u) * u * 100 + u * u * 188; return [x, y]; };
  function reedPath(x) {
    x.beginPath(); x.moveTo(RW, 90); x.lineTo(350, 90);
    for (let i = 1; i <= 30; i++) { const [px, py] = nibTop(i / 30); x.lineTo(px, py); }
    x.lineTo(34, 210); x.lineTo(RW, 210); x.closePath();
  }
  let faceTop = 0;

  S.init = async () => {
    P.timeline = piece({ w: 4600, h: 110, tex: 'kraft', seed: 80, rough: 6 });
    P.tEra = makeTape('العصر الأموي', 81, 420, 'cream', INK, 54);
    P.tName = makeTape('قُطبة المحرر', 82, 420, 'red', CREAM, 56);
    P.tTumar = makeTape('خط الطومار', 83, 380, 'dark', CREAM, 52);
    P.tThird = makeTape('ثُلث', 84, 230, 'red', CREAM, 64, 100);
    P.tName2 = makeTape('ومن هنا جاء الاسم', 85, 560, 'cream', INK, 50);
    P.scroll = piece({ w: 380, h: 860, tex: 'cream', seed: 86, rough: 5, tint: 'rgba(246,238,218,.66)' });
    P.roll = piece({ w: 420, h: 46, tex: 'kraft', seed: 87, rough: 2 });
    P.portrait = piece({ w: 430, h: 420, tex: 'cream', seed: 90, rough: 6, tint: 'rgba(246,238,218,.62)' });
    P.small = piece({ w: 900, h: 470, tex: 'cream', seed: 88, rough: 8, tint: 'rgba(246,238,218,.7)' });
    // reed canvas + shadow
    const c = mk(RW, RH), x = c.getContext('2d');
    reedPath(x); x.save(); x.clip();
    const gr = x.createLinearGradient(0, 90, 0, 210); gr.addColorStop(0, '#4a2f17'); gr.addColorStop(.35, '#a8794a'); gr.addColorStop(.6, '#8a5e33'); gr.addColorStop(1, '#3e2612');
    x.fillStyle = gr; x.fillRect(0, 0, RW, RH);
    const r = rng(89); x.globalAlpha = .25; x.strokeStyle = '#2a1a0c';
    for (let i = 0; i < 60; i++) { const yy = 92 + r() * 116; x.lineWidth = .6 + r() * 1.4; x.beginPath(); x.moveTo(0, yy); x.lineTo(RW, yy + (r() - .5) * 6); x.stroke(); }
    x.globalAlpha = 1;
    for (const nx of [980, 1640]) { const ng = x.createLinearGradient(nx - 18, 0, nx + 18, 0); ng.addColorStop(0, 'rgba(40,24,10,0)'); ng.addColorStop(.5, 'rgba(40,24,10,.75)'); ng.addColorStop(1, 'rgba(40,24,10,0)'); x.fillStyle = ng; x.fillRect(nx - 18, 0, 36, RH); }
    const ink = x.createLinearGradient(20, 0, 200, 0); ink.addColorStop(0, 'rgba(10,8,6,.95)'); ink.addColorStop(1, 'rgba(10,8,6,0)'); x.fillStyle = ink; x.fillRect(0, 0, 210, RH);
    x.restore(); reedPath(x); x.strokeStyle = 'rgba(250,244,230,.6)'; x.lineWidth = 3; x.stroke();
    P.reed = c;
    const s = mk(RW, RH), sx = s.getContext('2d'); sx.filter = 'blur(10px)'; reedPath(sx); sx.fillStyle = '#000'; sx.fill(); P.reedSh = s;
    // nib top y at the cut
    for (let i = 0; i <= 400; i++) { const [px, py] = nibTop(i / 400); if (px <= CUTX) { faceTop = py; break; } }
    const sil = (img, blur) => { const c = mk(img.width + blur * 6, img.height + blur * 6), x = c.getContext('2d');
      x.filter = `blur(${blur}px) brightness(0)`; x.drawImage(img, blur * 3, blur * 3); return c; };
    A.knifeSh = sil(A.knife, 8);
  };

  // ── timeline world ──────────────────────────────────────────────────
  function drawTimelineWorld(t) {
    const camX = track(t, [[0, 900], [TT.rewind, 2700], [TT.pan, 3120]], 30, 11);
    const s = Math.exp(track(t, [[0, Math.log(1.0)], [TT.scribe, Math.log(1.08)], [TT.pan, Math.log(.95)]], 30, 11));
    camBegin(t, s, camX, 560, 0, shake(t, TT.era + .35, 5));
    // archive fragments pinned around the timeline (reuse the wall cards)
    for (let i = 0; i < 34; i++) { const c = cards[(i * 37 + 11) % cards.length]; if (c.isHero) continue;
      const x = -700 + i * 135 + hash(i, 1) * 60, up = i % 2 ? -1 : 1, y = 660 + up * (170 + hash(i, 2) * 230);
      if (Math.abs(x - 2900) < 260 && up < 0) continue; if (x > 2350 && x < 2800 && up < 0) continue; if (x > 3250) continue;
      const bb = boil(860 + i, t, .6); drawPiece(c.p, x + bb[0], y + bb[1], (hash(i, 3) - .5) * .3, .8, 0, .9); }
    veil(0); g.save(); g.setTransform(1,0,0,1,0,0); g.fillStyle = 'rgba(8,7,6,.35)'; g.fillRect(0,0,W,H); g.restore();
    // the strip + red thread + time ticks (RTL: the beginning is to the right)
    const b = boil(810, t, .6);
    drawPiece(P.timeline, 1600 + b[0], 660 + b[1], 0, 1, 0, 1);
    g.strokeStyle = RED; g.lineWidth = 3; g.beginPath(); g.moveTo(-700, 660); g.lineTo(3900, 660); g.stroke();
    for (let i = 0; i < 30; i++) { const x = -600 + i * 150; nuqta(g, x, 660, i % 5 === 0 ? 26 : 14, i % 5 === 0 ? CREAM : 'rgba(239,229,207,.55)', 0); }
    // pin + era label
    const pinX = 2900;
    const kp = spring(t - TT.era, 300, 18);
    if (kp > 0) {
      g.strokeStyle = 'rgba(232,222,198,.8)'; g.lineWidth = 2; g.beginPath(); g.moveTo(pinX, 660); g.lineTo(pinX, lerp(660, 540, kp)); g.stroke();
      nuqta(g, pinX, 660, 44 * kp, RED, 0);
      tapeIn(P.tEra, t, TT.era + .05, null, pinX + 150, 490, -.04, 811, 'pop');
    }
    // the scribe on the timeline
    if (t > TT.scribe - .1) {
      const k = spring(t - TT.scribe, 150, 19), bb = boil(812, t, .7);
      drawPiece(P.portrait, 2580 + bb[0], lerp(1300, 618, k) - 200 + bb[1], .03, 1, 0, 1);
      drawCut(A.scribe, A.scribeSh, 2580 + bb[0], lerp(1300, 618, k) - 12 + bb[1], 340, bb[2], 0, 1, true, 1);
      tapeIn(P.tName, t, TT.name, null, 2580, 790, .03, 813, 'pop');
    }
    // the great Tumar scroll unrolls
    if (t > TT.scroll - .05) {
      const u = smooth(TT.scroll, TT.scroll + .9, t), sx = 3530, top = 150, hh = 860 * u;
      g.save(); g.beginPath(); g.rect(sx - 260, top - 40, 520, hh + 40); g.clip();
      drawPiece(P.scroll, sx, top + 430, 0, 1, 0, 1);
      // giant wide-reed strokes (abstract Tumar marks)
      const strokes = [[[sx + 90, top + 110], [sx + 90, top + 620]], [[sx + 40, top + 700], [sx - 60, top + 760], [sx - 120, top + 700], [sx - 120, top + 560]], [[sx - 30, top + 140], [sx - 30, top + 460]]];
      strokes.forEach((pts, i) => { const p = smooth(TT.scroll + .45 + i * .22, TT.scroll + .85 + i * .22, t);
        pathReveal(pts, p, { color: INK, width: 54 }); });
      g.restore();
      drawPiece(P.roll, sx, top + hh, 0, 1, 0, 1);
      tapeIn(P.tTumar, t, TT.tapeTumar, null, sx, 1060, -.03, 814, 'pop');
      // derivation arrow: scroll → scribe
      const ap = smooth(TT.arrow, TT.arrow + .45, t);
      if (ap > 0) { const pts = []; for (let i = 0; i <= 30; i++) { const u2 = i / 30; pts.push([lerp(3300, 2820, u2), 420 - Math.sin(u2 * Math.PI) * 120]); }
        pathReveal(pts, ap, { color: RED, width: 6 });
        if (ap > .97) { g.save(); g.translate(2820, 420); g.rotate(2.6); g.fillStyle = RED; g.beginPath(); g.moveTo(0, 0); g.lineTo(-26, -12); g.lineTo(-26, 12); g.fill(); g.restore(); } }
    }
    g.restore();
  }

  // ── macro of the reed ───────────────────────────────────────────────
  const REED = { x: 520, y: 470, sc: 1.55, rot: -0.07 };
  const toReed = (px, py) => { const c = Math.cos(REED.rot), s = Math.sin(REED.rot); const x = px * REED.sc, y = (py - 150) * REED.sc;
    return [REED.x + x * c - y * s, REED.y + x * s + y * c]; };
  function drawReedScene(t) {
    // local zoom onto the cut face during the measurement
    const fz = Math.exp(Math.log(1.55) * spring(t - (TT.measure - .2), 60, 15) - Math.log(1.55) * spring(t - TT.name2, 90, 19));
    const [fx, fy] = toReed(CUTX, (faceTop + 210) / 2);
    camBegin(t, 1, 960, 540, 0, shake(t, TT.cut, 12));
    g.translate(fx, fy); g.scale(fz, fz); g.translate(-fx, -fy);
    const slide = spring(t - TT.name2, 120, 20) * 2600;
    const b = boil(830, t, .5);
    g.save(); g.translate(REED.x + b[0] + slide, REED.y + b[1]); g.rotate(REED.rot + b[2]); g.scale(REED.sc, REED.sc); g.translate(0, -150);
    // shadow
    g.globalAlpha = .55; g.drawImage(P.reedSh, 12, 20); g.globalAlpha = 1;
    const cut = t >= TT.cut;
    // body (right of the cut once cut)
    g.save(); if (cut) { g.beginPath(); g.rect(CUTX, 0, RW, RH); g.clip(); } g.drawImage(P.reed, 0, 0); g.restore();
    if (cut) {
      // fresh cut face (pale reed fibre)
      g.strokeStyle = '#e9d3a8'; g.lineWidth = 7; g.beginPath(); g.moveTo(CUTX, faceTop + 2); g.lineTo(CUTX, 208); g.stroke();
      // the falling tip
      const dt = t - TT.cut;
      if (dt < 1.4) { g.save(); g.translate(CUTX, 200); g.translate(-60 * dt, 900 * dt * dt + 20 * dt); g.rotate(-1.6 * dt); g.translate(-CUTX, -200);
        g.beginPath(); g.rect(0, 0, CUTX, RH); g.clip(); g.drawImage(P.reed, 0, 0); g.restore(); }
    } else {
      g.save(); g.beginPath(); g.rect(0, 0, CUTX, RH); g.clip(); g.drawImage(P.reed, 0, 0); g.restore();
    }
    // measurement on the face: bracket + thirds
    const mp = smooth(TT.measure, TT.measure + .45, t);
    if (mp > 0) {
      const bx = CUTX - 34, y0 = faceTop + 2, y1 = 208, L = y1 - y0;
      g.save(); g.strokeStyle = CREAM; g.lineWidth = 2.4; g.lineCap = 'round';
      g.beginPath(); g.moveTo(bx, y0); g.lineTo(bx, lerp(y0, y1, mp)); g.stroke();
      g.beginPath(); g.moveTo(bx - 9, y0); g.lineTo(bx + 9, y0); g.stroke();
      if (mp > .98) { g.beginPath(); g.moveTo(bx - 9, y1); g.lineTo(bx + 9, y1); g.stroke(); }
      g.restore();
      for (let k = 1; k <= 2; k++) { const st = spring(t - (TT.measure + .35 + k * .15), 320, 16); if (st > 0) nuqta(g, bx, y0 + L * k / 3, 13 * st, RED, 0); }
      const th = spring(t - TT.third, 260, 18);
      if (th > 0) { g.save(); g.strokeStyle = RED; g.lineWidth = 10 * th; g.lineCap = 'butt'; g.beginPath(); g.moveTo(CUTX + 1, y0 + 2); g.lineTo(CUTX + 1, y0 + L / 3); g.stroke(); g.restore(); }
    }
    g.restore();
    // knife: blade down, slicing through the cut line
    if (t > TT.knife - .1 && t < TT.cut + .7) {
      const [kx, ky] = toReed(CUTX, 150);
      const u = (t - TT.knife) / (TT.cut - TT.knife);           // 0..1 at contact
      const y = u < 1 ? lerp(-520, ky + 80, 1 - Math.pow(1 - u, 2.2)) : ky + 80 + (t - TT.cut) * 2600;
      const kw = 760;
      g.save(); g.translate(kx + 10, y); g.rotate(-Math.PI / 2 + .08);
      const kk = kw / A.knife.width, kh = A.knife.height * kk, pad = (A.knifeSh.width - A.knife.width) / 2;
      // blade (left end of image) leads downward → image drawn with its left end at the contact point
      g.globalAlpha = .5; g.drawImage(A.knifeSh, -pad * kk + 14, -kh / 2 - pad * kk - 18, A.knifeSh.width * kk, A.knifeSh.height * kk);
      g.globalAlpha = 1; g.drawImage(A.knife, 0, -kh / 2, kw, kh); g.restore();
    }
    // labels
    if (t > TT.third) { const [tx, ty] = toReed(CUTX - 34, faceTop); const k = spring(t - (TT.third + .1), ...SNAPPY), ko = spring(t - TT.name2, 200, 24);
      const fxs = (x, y) => [fx + (x - fx) * fz, fy + (y - fy) * fz];
      const [sx, sy] = fxs(tx - 150, ty - 40);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); if (k > 0) drawPiece(P.tThird, lerp(sx, 960, ko), lerp(sy, 880, ko), -.05 * (1 - ko), lerp(1.4, 1, k), 0, 1); g.restore(); }
    g.restore();
    // the name: small sheet + the word writes itself
    if (t > TT.name2) {
      const k = spring(t - (TT.name2 + .15), 120, 19);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
      const b2 = boil(831, t, .5);
      drawPiece(P.small, 960 + b2[0], lerp(-400, 470, k) + b2[1], -.012, 1, 0, 1);
      const cw = 680, ch = cw * inkH / inkW, ox = 960 - cw / 2, oy = lerp(-400, 470, k) - ch / 2 + 6;
      const p = clamp((t - TT.write0) / (TT.write1 - TT.write0));
      if (p > 0) g.drawImage(inkFrame(p), ox, oy, cw, ch);
      const dk = spring(t - (TT.write1 + .02), 380, 18); if (dk > 0) { g.globalAlpha = clamp(dk * 3); g.drawImage(A.dot, ox, oy, cw, ch); g.globalAlpha = 1; }
      g.restore();
      tapeIn(P.tName2, t, TT.name2 + .35, null, 960, 150, .025, 832, 'pop');
    }
  }

  S.draw = (t) => {
    if (t < TT.iris + .15) {
      if (!wipeCovered(t, TT.wipe)) { SECTIONS.find(s => s.id === 's02').draw(t); }
      else { drawTimelineWorld(t); finishFrame(t); }
      paperWipe(t, TT.wipe);
      // iris in: black nuqta grows from the scribe's pen
      if (t > TT.iris) { const k = smooth(TT.iris, TT.iris + .3, t);
        const [px, py] = toScreen(2470, 560); g.setTransform(1, 0, 0, 1, 0, 0); nuqta(g, px, py, 20 + 3200 * k * k, '#0b0a09', 0); }
      return;
    }
    // iris out: the reed scene opens inside a growing nuqta
    const k = smooth(TT.iris + .15, TT.irisOut + .35, t);
    g.setTransform(1, 0, 0, 1, 0, 0);
    if (k < 1) { g.fillStyle = '#0b0a09'; g.fillRect(0, 0, W, H); g.save();
      const s = 40 + 3000 * k * k, a = s / 2; g.translate(560, 560); g.rotate(Math.PI / 4); g.beginPath(); g.rect(-a, -a, s, s); g.restore(); g.save(); g.clip(); }
    drawReedScene(t); finishFrame(t);
    if (k < 1) g.restore();
  };
  SECTIONS.push({ id: 's03', from: S.from, to: S.to, init: S.init, draw: S.draw });
})();
