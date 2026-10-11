// ════════════════════════════════════════════════════════════════════
//  S08 · 133.52 – 188.92  «بل هو تسعة عوالم: المفرق… الوسط… المشبك… الجلي… المحبوك…
//  الزخرفي… المختزل… المتناظر… وأخيراً المسلسل»
//  Idea: the fanned cards from s07 deal themselves into a 3×3 grid (RTL order). The camera
//  whips into each card exactly when its name is spoken; every world has its own motion
//  rule (spacing, balance, stacking, monumental dome, braid, ornament, compression,
//  mirror, endless chain). At the end it pulls back to show all nine alive.
// ════════════════════════════════════════════════════════════════════
(() => {
  const S = { from: 133.52, to: 188.92 };
  const NAMES = ['المفرق', 'الوسط', 'المشبك', 'الجلي', 'المحبوك', 'الزخرفي', 'المختزل', 'المتناظر', 'المسلسل'];
  const ZOOM = [136.55, 141.6, 146.5, 152.1, 160.3, 165.55, 168.65, 174.05, 178.55];   // camera arrives (just before the name)
  const NAME = [137.2, 143.04, 147.74, 153.54, 162.76, 165.86, 168.92, 174.36, 179.94];
  const TT = { deal: 133.6, nine: 134.55, worlds: 135.1, out: 187.8 };
  const CW = 620, CH = 400, GX = 720, GY = 470;
  const P = {};
  const pos = (n) => [960 + (1 - (n % 3)) * GX, 540 + (Math.floor(n / 3) - 1) * GY];
  const CUTS = [0, 560, 860, 1125, inkW || 1243];
  S.init = async () => {
    CUTS[4] = inkW;
    P.cards = NAMES.map((nm, n) => piece({ w: CW, h: CH, tex: 'cream', seed: 800 + n, rough: 6, tint: 'rgba(246,238,218,.68)' }));
    P.names = NAMES.map((nm, n) => makeTape(nm, 820 + n, nm.length * 30 + 70, n % 2 ? 'dark' : 'red', CREAM, 44, 76));
    P.nine = cutText('٩', 300);
    P.tNine = makeTape('تسعة عوالم', 840, 420, 'cream', INK, 56);
    preTag([['تتباعد', 'cream', 26], ['دون تشابك', 'dark', 26], ['ترابط', 'cream', 24], ['تباعد', 'cream', 24], ['فوق بعضها', 'cream', 26],
      ['أقلام عريضة', 'dark', 26], ['جدران المساجد', 'cream', 26], ['ضفيرة', 'cream', 26], ['نباتات هندسية', 'cream', 26],
      ['تقهر المساحة', 'cream', 26], ['انعكاس مرآوي', 'cream', 26], ['سلسلة لا تنقطع', 'cream', 26]]);
  };

  // ink slices helper (card coords, ink width IW centred at (0, y))
  const IW = 440;
  function slices(offs, y = 10, alpha = 1, dys = null) {
    const k = IW / inkW, h = inkH * k;
    for (let i = 0; i < 4; i++) { const sx = CUTS[i], sw = CUTS[i + 1] - CUTS[i];
      g.save(); g.globalAlpha *= alpha; g.drawImage(A.ink, sx, 0, sw, inkH, -IW / 2 + sx * k + offs[i], y - h / 2 + (dys ? dys[i] : 0), sw * k, h); g.restore(); }
  }
  // the nine worlds, local time lt (s since camera arrival; <0 = preview state)
  const W = [
    (lt, t) => { // 1 المفرق: letters move apart, clear gaps
      const sp = 46 * smooth(.4, 1.6, lt); slices([0, 1, 2, 3].map(i => (i - 1.5) * sp));
      const bk = smooth(1.6, 2.2, lt); if (bk > 0) for (let i = 0; i < 3; i++) { const x = -IW / 2 + CUTS[i + 1] * IW / inkW + (i - 1) * sp; g.save(); g.strokeStyle = RED; g.lineWidth = 2; g.globalAlpha = bk;
        g.beginPath(); g.moveTo(x - sp / 2 + 4, 120); g.lineTo(x + sp / 2 - 4, 120); g.moveTo(x - sp / 2 + 4, 112); g.lineTo(x - sp / 2 + 4, 128); g.moveTo(x + sp / 2 - 4, 112); g.lineTo(x + sp / 2 - 4, 128); g.stroke(); g.restore(); }
      tag('تتباعد', t, ZOOM[0] + 2.2, -150, -140, -.05, 'cream', 26); tag('دون تشابك', t, ZOOM[0] + 4.4, 150, 150, .04, 'dark', 26);
    },
    (lt, t) => { // 2 الوسط: between joined and apart — a slider settles in the middle
      const u = .5 + .5 * Math.cos(clamp(lt, 0, 3) * 2.2) * Math.exp(-clamp(lt, 0, 9) * .9);
      const sp = lerp(-14, 46, u); slices([0, 1, 2, 3].map(i => (i - 1.5) * sp), -6);
      g.save(); g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(-200, 140); g.lineTo(200, 140); g.stroke();
      nuqta(g, lerp(200, -200, u), 140, 30, RED, 0); g.restore();
      tag('ترابط', t, ZOOM[1] + .3, 240, 140, 0, 'cream', 24); tag('تباعد', t, ZOOM[1] + .3, -240, 140, 0, 'cream', 24);
    },
    (lt, t) => { // 3 المشبك: letters pack and climb over each other
      const k = smooth(.3, 1.8, lt); slices([0, 1, 2, 3].map(i => -(i - 1.5) * 34 * k), 20, 1, [0, 1, 2, 3].map(i => (i % 2 ? -40 : 22) * k));
      tag('فوق بعضها', t, NAME[2] + 1.8, 170, -150, .05, 'cream', 26);
    },
    (lt, t) => { // 4 الجلي: very broad pens → monumental band on a dome
      const pts = []; for (let i = 0; i <= 60; i++) { const u = i / 60; pts.push([lerp(250, -250, u), -20 + Math.sin(u * 3.1) * 50]); }
      const up = smooth(4.6, 5.6, lt);
      g.save(); g.translate(0, -up * 330); penRibbon(pts, 92, -.75, smooth(3.0, 4.4, lt)); g.restore();
      tag('أقلام عريضة', t, NAME[3] + 2.5, -170, -150, -.05, 'dark', 26, ZOOM[3] + 4.8);
      const dk = smooth(4.8, 6.0, lt); if (dk > 0) { g.save(); g.translate(0, lerp(420, 0, dk));
        g.fillStyle = '#16130f'; g.beginPath(); g.arc(0, 30, 150, Math.PI, 0); g.rect(-190, 30, 380, 170); g.fill();
        g.fillRect(-5, -150, 10, 40); nuqta(g, 0, -160, 22, '#c9a24a', 0);
        g.fillStyle = '#efe5cf'; g.fillRect(-170, 60, 340, 86); const ik = smooth(6.0, 7.6, lt);
        if (ik > 0) { const w = 300, h = w * inkH / inkW; g.drawImage(inkFrame(ik), -w / 2, 103 - h / 2, w, h); }
        g.restore(); }
      tag('جدران المساجد', t, ZOOM[3] + 6.6, 170, -150, .04, 'cream', 26);
    },
    (lt, t) => { // 5 المحبوك: a braid of three strands
      const p = smooth(.2, 2.4, lt), cols = [INK, RED, '#9a6b3c'];
      for (let pass = 0; pass < 2; pass++) for (let s = 0; s < 3; s++) { const pts = [];
        for (let i = 0; i <= 120; i++) { const u = i / 120, x = lerp(260, -260, u), y = Math.sin(u * 14 + s * 2.094) * 70; pts.push([x, y]); }
        if (pass === 0) pathReveal(pts, p, { color: cols[s], width: 22 });
        else { // redraw the 'over' crossings
          const n = Math.floor(120 * p); g.save(); g.strokeStyle = cols[s]; g.lineWidth = 22; g.lineCap = 'butt';
          for (let i = 0; i < n; i++) { const ph = (i / 120 * 14 + s * 2.094) % 6.283; if (Math.cos(ph) > .3) { g.beginPath(); g.moveTo(...pts[i]); g.lineTo(...pts[i + 1]); g.stroke(); } } g.restore(); } }
      tag('ضفيرة', t, NAME[4] + .9, 0, 150, -.03, 'cream', 26);
    },
    (lt, t) => { // 6 الزخرفي: rosettes and geometric vines grow round the word
      drawInkAt(0, 0, 300, 1);
      for (let r = 0; r < 4; r++) { const k = spring(lt - (.2 + r * .25), 220, 16); if (k <= 0) continue; const [x, y] = [[-230, -120], [230, -120], [-230, 120], [230, 120]][r];
        g.save(); g.translate(x, y); g.rotate(lt * .4 * (r % 2 ? 1 : -1)); g.scale(k, k); g.strokeStyle = r % 2 ? RED : '#9a6b3c'; g.lineWidth = 4;
        for (let q = 0; q < 2; q++) { g.rotate(Math.PI / 4); g.strokeRect(-34, -34, 68, 68); } nuqta(g, 0, 0, 22, INK, 0); g.restore(); }
      const vp = smooth(.6, 2.4, lt); for (const sgn of [-1, 1]) { const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; pts.push([sgn * lerp(60, 280, u), -150 + Math.sin(u * 9) * 18]); }
        pathReveal(pts, vp, { color: '#3d5a2a', width: 4 });
        for (let l = 0; l < 6; l++) { const lk = smooth(.8 + l * .25, 1.1 + l * .25, lt); if (lk <= 0) continue; const [lx, ly] = pts[5 + l * 6];
          g.save(); g.translate(lx, ly); g.rotate(sgn * (l % 2 ? .8 : -.8)); g.scale(lk, lk); g.fillStyle = '#4e6e33'; g.beginPath(); g.ellipse(0, -12, 7, 14, 0, 0, 6.283); g.fill(); g.restore(); } }
      tag('نباتات هندسية', t, NAME[5] + 2.3, 0, 160, .03, 'cream', 26);
    },
    (lt, t) => { // 7 المختزل: the word is compressed into a square that conquers the space
      const k = smooth(.6, 2.6, lt), S0 = lerp(560, 250, k);
      g.save(); g.strokeStyle = RED; g.lineWidth = 4; g.setLineDash([12, 8]); g.strokeRect(-S0 / 2, -Math.min(S0, 330) / 2, S0, Math.min(S0, 330)); g.restore();
      const w = lerp(440, 230, k), h = lerp(440 * inkH / inkW, 230, k); g.drawImage(A.ink, -w / 2, -h / 2, w, h); g.drawImage(A.dot, -w / 2, -h / 2, w, h);
      tag('تقهر المساحة', t, ZOOM[6] + 3.6, 0, 165, -.03, 'cream', 26);
    },
    (lt, t) => { // 8 المتناظر: mirror axis, the reflection unfolds
      const k = smooth(.3, 1.8, lt), w = 260, h = w * inkH / inkW;
      g.drawImage(A.ink, 6, -h / 2, w, h);
      g.save(); g.beginPath(); g.rect(-6 - w * k, -200, w * k, 400); g.clip(); g.scale(-1, 1); g.drawImage(A.ink, 6, -h / 2, w, h); g.restore();
      g.save(); g.strokeStyle = RED; g.lineWidth = 3; g.setLineDash([8, 7]); g.beginPath(); g.moveTo(0, -170); g.lineTo(0, 170); g.stroke(); g.restore();
      tag('انعكاس مرآوي', t, NAME[7] + 2.2, 0, 160, .03, 'cream', 26);
    },
    (lt, t) => { // 9 المسلسل: an endless chain — each word's end links to the next one's start
      const w = 240, h = w * inkH / inkW, gap = 70, per = w + gap, sc = (Math.max(0, lt) * 90) % per;
      g.save(); g.beginPath(); g.rect(-CW / 2 + 10, -CH / 2 + 10, CW - 20, CH - 20); g.clip();
      for (let i = -3; i <= 3; i++) { const x = i * per + sc; g.drawImage(A.ink, x - w / 2, -h / 2, w, h);
        g.save(); g.strokeStyle = RED; g.lineWidth = 6; g.beginPath(); g.ellipse(x - w / 2 - gap / 2, h * .32, gap * .55, 16, 0, 0, 6.283); g.stroke(); g.restore(); }
      g.restore();
      tag('سلسلة لا تنقطع', t, ZOOM[8] + 7.2, 0, 160, -.03, 'cream', 26);
    }];

  S.draw = (t) => {
    // camera: overview → each card in turn → overview
    const keysX = [[0, 960]], keysY = [[0, 540]], keysS = [[0, Math.log(1.0)]];
    keysS.push([TT.deal + .2, Math.log(.74)]);
    ZOOM.forEach((z, n) => { const [x, y] = pos(n); keysX.push([z - .45, x]); keysY.push([z - .45, y]); keysS.push([z - .45, Math.log(2.55)]); });
    keysX.push([TT.out, 960]); keysY.push([TT.out, 540]); keysS.push([TT.out, Math.log(.74)]);
    const cx = track(t, keysX, 70, 16), cy = track(t, keysY, 70, 16), s = Math.exp(track(t, keysS, 70, 16));
    camBegin(t, s, cx, cy, 0, 0);
    // cards deal from the s07 fan (centre) to the grid
    for (let n = 8; n >= 0; n--) {
      const k = spring(t - (TT.deal + n * .07), 120, 16), [gx, gy] = pos(n);
      const x = lerp(960, gx, k), y = lerp(520, gy, k), sc = lerp(1320 * .92 / CW, 1, k), rot = lerp((n - 4) * .11, 0, k);
      const b = boil(850 + n, t, .5);
      g.save(); g.translate(x + b[0], y + b[1]); g.rotate(rot + b[2]); g.scale(sc, sc);
      drawPiece(P.cards[n], 0, 0, 0, 1, 0, 1);
      if (k > .5) { g.save(); g.globalAlpha = clamp((k - .5) * 3); g.beginPath(); g.rect(-CW / 2 + 6, -CH / 2 + 6, CW - 12, CH - 12); g.clip();
        W[n](t - ZOOM[n], t); g.restore();
        // number + name tape
        nuqta(g, CW / 2 - 46, -CH / 2 + 46, 50, RED, 0);
        g.fillStyle = CREAM; g.font = '800 30px Kufi'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('١٢٣٤٥٦٧٨٩'[n], CW / 2 - 46, -CH / 2 + 49);
        const nk = spring(t - NAME[n], ...SNAPPY), pre = clamp((k - .7) * 4);
        drawPiece(P.names[n], CW / 2 - 150, -CH / 2 + 44, -.03, lerp(.8, 1, nk) * (t < NAME[n] ? .75 : 1), 0, pre);
      } else { drawInkAt(0, 10, IW, 1); }
      g.restore();
    }
    // «٩» + «تسعة عوالم» over the overview
    const nk = spring(t - TT.nine, 260, 15), no = spring(t - (ZOOM[0] - .6), 200, 24);
    if (nk > 0 && no < .999) { drawCutText(P.nine, 960, 540 - 40, 1.6 * nk * (1 - no) + .001, -.08, 0); drawPiece(P.tNine, 960, 540 + 220, .03, lerp(1.4, 1, spring(t - TT.worlds, ...SNAPPY)) * (1 - no), 0, t > TT.worlds ? 1 : 0); }
    g.restore(); finishFrame(t);
  };
  SECTIONS.push({ id: 's08', from: S.from, to: S.to, init: S.init, draw: S.draw });
})();
