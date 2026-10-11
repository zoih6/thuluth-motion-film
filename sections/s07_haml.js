// ════════════════════════════════════════════════════════════════════
//  S07 · 103.44 – 133.52  «ولكن، هل تعلم كيف تُشكَّل الحركات الإعرابية والتزيينية؟ لا تُكتب
//  بالقلم نفسه، بل بقلم آخر مخصص حجمه يعادل ربع عرض القلم الأصلي غالباً، ليصنع تداخلاً
//  وتشابكاً وتوازناً بصرياً دقيقاً بين الفراغ والامتلاء، يسميه الخطاطون «الحَمْل».
//  وليس الثلث شكلاً واحداً…»
//  Idea: the stage collapses on «ولكن». Harakat get circled; the big qalam is crossed
//  out, a thin one replaces it; nib-width = nuqta: the big nuqta splits in 4, the small
//  one fits one quarter. Small marks weave into the gaps, a spirit level settles, a
//  coverage grid shows void vs fill, the «الحمل» stamp lands, and the card fans into nine.
// ════════════════════════════════════════════════════════════════════
(() => {
  const S = { from: 103.44, to: 133.52 };
  const TT = { but: 103.44, card: 104.6, know: 104.9, harakat: 107.7, irab: 108.66, zin: 109.46, pen1: 110.4, cross: 111.35,
    pen2: 112.45, special: 114.3, size: 115.0, quarter: 116.7, often: 118.9, weave: 119.5, mesh: 121.5, level: 122.8, exact: 124.6,
    grid: 125.3, voidT: 125.8, fullT: 126.44, callers: 127.6, haml: 129.3, notone: 131.4, fan: 132.2 };
  const P = {};
  const CX = 640, CY = 560, CS = .76;      // word card home in this section
  S.init = async () => {
    P.stage = piece({ w: 1560, h: 860, tex: 'cream', seed: 601, rough: 9, tint: 'rgba(246,238,218,.7)' });
    P.cmp = piece({ w: 640, h: 560, tex: 'cream', seed: 701, rough: 7, tint: 'rgba(246,238,218,.66)' });
    P.but = cutText('ولكن', 230);
    P.stamp = makeStamp('الحَمْل', 702, 620, 220, 140);
    P.level = piece({ w: 760, h: 74, tex: 'kraft', seed: 703, rough: 3 });
    // coverage grid of the ink (12 × 6)
    const c = mk(inkW, inkH), x = c.getContext('2d'); x.drawImage(A.ink, 0, 0); const d = x.getImageData(0, 0, inkW, inkH).data;
    P.cov = []; const GX = 12, GY = 6;
    for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) { let s = 0, n = 0;
      for (let y = Math.floor(j * inkH / GY); y < (j + 1) * inkH / GY; y += 3) for (let xx = Math.floor(i * inkW / GX); xx < (i + 1) * inkW / GX; xx += 3) { s += d[(y * inkW + xx) * 4 + 3] > 100; n++; }
      P.cov.push({ i, j, v: s / n }); }
    // small ornamental marks woven into empty cells (ink space): [u, v, type, rot]
    const r = rng(704); P.marks = [];
    for (const cell of P.cov) if (cell.v < .02 && cell.j >= 1 && cell.j <= 4 && cell.i >= 2 && cell.i <= 7) {
      const u = (cell.i + .5) * inkW / 12 + (r() - .5) * 30, v = (cell.j + .5) * inkH / 6 + (r() - .5) * 20; P.marks.push([u, v, Math.floor(r() * 3), (r() - .5) * .5, r()]); }
    preTag([['هل تعلم؟', 'cream', 50], ['الحركات', 'red', 48], ['إعرابية', 'cream', 40], ['تزيينية', 'cream', 40], ['قلم مخصص', 'red', 46],
      ['رُبع', 'red', 64], ['غالباً', 'dark', 36], ['تداخل', 'cream', 42], ['تشابك', 'cream', 42], ['توازن بصري', 'dark', 44],
      ['الفراغ', 'cream', 46], ['الامتلاء', 'red', 46], ['يسميه الخطاطون', 'dark', 40], ['ليس شكلاً واحداً', 'dark', 48]]);
  };

  function wordCard(t) {
    // in from below at «هل تعلم», recentres for the weave, then fans into nine
    const k = spring(t - TT.card, 130, 19), ctr = spring(t - (TT.weave - .3), 110, 20);
    const x = lerp(CX, 960, ctr), y = lerp(1600, lerp(CY, 520, ctr), k), sc = lerp(CS, .92, ctr);
    // the fan: 8 ghost copies swing out behind
    const fk = spring(t - TT.fan, 120, 16);
    if (fk > 0) for (let i = 7; i >= 0; i--) { const a = (i - 3.5) * .11 * fk;
      g.save(); g.translate(x, y + 500); g.rotate(a); g.translate(-x, -(y + 500)); drawPiece(sheet, x, y, 0, sc, 0, 1); drawInkAt(x, y + 14 * sc, CAL.w * sc, .85); g.restore(); }
    return { m: drawWordCard(t, x, y, sc, -.006, 710), x, y, sc };
  }

  S.draw = (t) => {
    camBegin(t, 1, 960, 540, 0, 0); g.restore();   // background only
    // «ولكن»: the s06 stage drops away
    const ck = spring(t - TT.but, 70, 15);
    if (ck < .999) { window.NOBG = true; window.CAMOFF = [0, -ck * 1500]; SECTIONS.find(s => s.id === 's06').stage(Math.min(t, 103.43)); window.CAMOFF = null; }
    window.NOBG = true; camBegin(t, 1, 960, 540, 0, shake(t, TT.haml, 16) + shake(t, TT.but + .05, 6)); window.NOBG = false;
    // cover the old stage as it drops: draw it again translated (cheap trick: veil from bottom)
    const bk = spring(t - TT.but, 260, 14), bo = spring(t - TT.card, 160, 22);
    if (bo < .999) drawCutText(P.but, 960 - bo * 1600, 540, lerp(3.2, 2, bk), -.04 + (1 - bk) * .2, 0);
    if (t > TT.card - .05) {
      const { m, x, y, sc } = wordCard(t);
      tag('هل تعلم؟', t, TT.know, x - 470 * sc, y - 430 * sc, -.05, 'cream', 50, TT.size);
      // harakat circled
      const hp = (i) => smooth(TT.harakat + i * .15, TT.harakat + i * .15 + .4, t) * (1 - smooth(TT.size - .1, TT.size + .2, t));
      [INKPT.fatha, INKPT.shadda, INKPT.damma].forEach((q, i) => { const [hx, hy] = m.p(q[0], q[1]); handCircle(hx, hy, 70 * m.k * (i === 0 ? 1.1 : .8), hp(i), 720 + i); });
      tag('الحركات', t, TT.harakat + .1, x + 180 * sc, y - 470 * sc, .04, 'red', 48, TT.size);
      tag('إعرابية', t, TT.irab, x - 200 * sc, y + 450 * sc, -.03, 'cream', 40, TT.size);
      tag('تزيينية', t, TT.zin, x + 220 * sc, y + 455 * sc, .03, 'cream', 40, TT.size);
      // the two pens
      const p1 = spring(t - TT.pen1, 150, 19), p2 = spring(t - TT.pen2, 150, 19), po = spring(t - (TT.size + .05), 150, 22);
      if (p1 > 0 && po < .999) { drawQalam(lerp(2300, 1250, p1) + po * 1400, 520, 760, -.5, 1, 1);
        const xk = smooth(TT.cross, TT.cross + .3, t); handLine(1350 + po * 1400, 220, 1650 + po * 1400, 560, xk, RED, 12, 731); handLine(1650 + po * 1400, 220, 1350 + po * 1400, 560, smooth(TT.cross + .15, TT.cross + .45, t), RED, 12, 732); }
      if (p2 > 0 && po < .999) drawQalam(lerp(2300, 1270, p2) + po * 1400, 800, 700, -.5, .45, 1);
      tag('قلم مخصص', t, TT.special, 1560, 940, .04, 'red', 46, TT.size);
      // nib width = nuqta: the comparison card
      const kc = spring(t - TT.size, 140, 19), oc = spring(t - (TT.weave - .3), 140, 22);
      if (kc > 0 && oc < .999) {
        const bx = lerp(2300, 1500, kc) + oc * 1200, by = 520, b = boil(740, t, .5);
        drawPiece(P.cmp, bx + b[0], by + b[1], .015, 1, 0, 1);
        const big = 240, bxN = bx + 40, byN = by - 40;
        nuqta(g, bxN, byN, big * kc, INK, 0);
        // width bracket + 4 parts
        const wk = smooth(TT.size + .4, TT.size + .9, t), half = big * .5;
        if (wk > 0) { g.save(); g.strokeStyle = RED; g.lineWidth = 3; const y0 = byN + half + 30;
          g.beginPath(); g.moveTo(bxN - half, y0); g.lineTo(bxN - half + big * wk, y0); g.stroke();
          for (let q = 0; q <= 4; q++) { const s = spring(t - (TT.size + .6 + q * .1), 300, 16); if (s <= 0) continue; const xx = bxN - half + q * big / 4; g.beginPath(); g.moveTo(xx, y0 - 12 * s); g.lineTo(xx, y0 + 12 * s); g.stroke(); }
          g.restore(); }
        // the small nuqta slides into one quarter
        const sk = spring(t - TT.quarter, 160, 15);
        if (sk > 0) { const tx = bxN - half + big / 8, ty = byN + half + 80; nuqta(g, lerp(bx - 200, tx, sk), lerp(by + 200, ty, sk), big / 4, RED, 0); }
        drawQalam(bx - 200 + 60, by + 200 - 120, 300, -.5, .45, 1 - sk);
        tag('رُبع', t, TT.quarter + .15, bx - 170, by - 220, -.06, 'red', 64, TT.weave - .3);
        tag('غالباً', t, TT.often, bx + 200, by + 230, .05, 'dark', 36, TT.weave - .3);
      }
      // weave: small marks fill the empty spaces + red interlace threads
      if (t > TT.weave) { P.marks.forEach(([u, v, ty, rot, d], i) => { const s = spring(t - (TT.weave + d * 1.2), 320, 17), o = spring(t - TT.notone, 200, 24); if (s <= 0) return;
          const [mx, my] = m.p(u, v), K = Math.max(0, m.k * s * (1 - o)); g.save(); g.translate(mx, my); g.rotate(rot - .5); g.fillStyle = INK;
          if (ty === 0) { g.fillRect(-26 * K, -7 * K, 52 * K, 14 * K); } else if (ty === 1) nuqta(g, 0, 0, 30 * K, INK, 0); else { g.beginPath(); g.arc(0, 0, 18 * K, 0, 4.2); g.lineWidth = 9 * K; g.strokeStyle = INK; g.stroke(); }
          g.restore(); });
        const wp = smooth(TT.mesh, TT.mesh + .9, t) * (1 - smooth(TT.grid - .2, TT.grid + .1, t));
        if (wp > 0) { const pts = P.marks.slice().sort((a, b) => a[0] - b[0]).map(([u, v]) => m.p(u, v)); pathReveal(pts, wp, { color: RED, width: 2.5, dash: [7, 6] }); }
        tag('تداخل', t, TT.weave + .9, 360, 230, -.05, 'cream', 42, TT.level);
        tag('تشابك', t, TT.mesh, 600, 190, .04, 'cream', 42, TT.level);
      }
      // spirit level settles
      const lk = spring(t - TT.level, 140, 18), lo = spring(t - TT.grid, 160, 22);
      if (lk > 0 && lo < .999) { const lx = 960, ly = lerp(1300, 990, lk) + lo * 400, b = boil(750, t, .5);
        drawPiece(P.level, lx + b[0], ly + b[1], 0, 1, 0, 1);
        g.save(); g.fillStyle = 'rgba(239,229,207,.9)'; g.beginPath(); g.roundRect(lx - 300, ly - 16, 600, 32, 16); g.fill();
        const bub = lx + 220 * Math.cos((t - TT.level) * 3.2) * Math.exp(-(t - TT.level) * 1.6);
        g.fillStyle = RED; g.beginPath(); g.ellipse(bub, ly, 46, 12, 0, 0, 6.283); g.fill();
        g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(lx - 56, ly - 22); g.lineTo(lx - 56, ly + 22); g.moveTo(lx + 56, ly - 22); g.lineTo(lx + 56, ly + 22); g.stroke(); g.restore();
        tag('توازن بصري', t, TT.level + .2, 1460, 990, .04, 'dark', 44, TT.grid); }
      // void vs fill grid
      const gk = smooth(TT.grid, TT.grid + .3, t) * (1 - smooth(TT.notone - .2, TT.notone + .2, t));
      if (gk > 0) {
        const cw = inkW / 12, chh = inkH / 6;
        P.cov.forEach((c, n) => { const s = spring(t - (TT.grid + ((c.i * 7 + c.j * 3) % 12) * .06), 300, 18) * gk; if (s <= 0) return;
          const [x0, y0] = m.p(c.i * cw, c.j * chh), w = cw * m.k, h = chh * m.k;
          if (c.v > .08) { g.fillStyle = `rgba(179,38,43,${.35 * s})`; g.fillRect(x0 + 3, y0 + 3, w - 6, h - 6); }
          else if (t > TT.voidT) { g.save(); g.strokeStyle = `rgba(20,17,15,${.45 * s})`; g.lineWidth = 2; g.setLineDash([5, 6]); g.strokeRect(x0 + 6, y0 + 6, w - 12, h - 12); g.restore(); } });
      }
      tag('الفراغ', t, TT.voidT, x - 300, y - 440 * sc, -.05, 'cream', 46, TT.haml);
      tag('الامتلاء', t, TT.fullT, x + 300, y - 440 * sc, .05, 'red', 46, TT.haml);
      tag('ليس شكلاً واحداً', t, TT.notone + .2, x, y - 470 * sc, -.03, 'dark', 48);
      tag('يسميه الخطاطون', t, TT.callers, x, y + 430 * sc, -.02, 'dark', 40, TT.notone);
      // the stamp
      const sk2 = spring(t - TT.haml, 420, 22), so = spring(t - TT.notone, 160, 24);
      if (sk2 > 0 && so < .999) { g.save(); g.translate(x + 40, y - 20 + so * 1200); g.rotate(-.1); g.scale(lerp(3.2, 1.35, sk2), lerp(3.2, 1.35, sk2)); g.globalAlpha = clamp(sk2 * 3) * .92; g.drawImage(P.stamp, -P.stamp.width / 2, -P.stamp.height / 2); g.restore(); }
    }
    g.restore(); finishFrame(t);
  };
  SECTIONS.push({ id: 's07', from: S.from, to: S.to, init: S.init, draw: S.draw });
})();
