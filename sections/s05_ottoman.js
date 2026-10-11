// ════════════════════════════════════════════════════════════════════
//  S05 · 67.34 – 81.76  «حتى بلغ الثلث ذروة مجده، وعصره الذهبي في العهد العثماني،
//  على أيدي عمالقة خلّدوا أسماءهم، مثل الحافظ عثمان، وسلطان الحرف محمد شوقي»
//  Idea: from s04's foundations the camera rockets up a tower of archive cards to the
//  summit — the Thuluth sheet — and the gold crown lands («ذروة»). A gold-leaf sun rises
//  behind a cut-paper Ottoman skyline; crimson banners of the giants drop from the sky,
//  and two masters' names are pinned on them.
// ════════════════════════════════════════════════════════════════════
(() => {
  const S = { from: 67.34, to: 81.76 };
  const TT = { rise: 67.34, peak: 68.7, crown: 69.25, tapePeak: 69.5, gold: 70.6, sky: 71.2, tapeOtt: 72.6, pull: 73.5,
    banners: 74.5, names: 76.0, hafiz: 77.6, sultan: 79.75, shawqi: 80.25 };
  const P = {};
  const PEAK = { x: 960, y: -1850 };
  S.init = async () => {
    P.bricks = []; for (let i = 0; i < 8; i++) P.bricks.push(piece({ w: 230, h: 92, tex: i % 3 ? 'kraft' : 'cream', seed: 420 + i, rough: 4 }));
    P.tPeak = makeTape('ذروة مجده', 501, 360, 'red', CREAM, 56);
    P.tOtt = makeTape('العهد العثماني', 502, 450, 'cream', INK, 54);
    P.tGold = makeTape('العصر الذهبي', 503, 400, 'dark', '#d9b45a', 52);
    P.tSultan = makeTape('سلطان الحرف', 504, 340, 'red', CREAM, 48, 84);
    P.nHafiz = makeTape('الحافظ عثمان', 505, 430, 'cream', INK, 56, 110);
    P.nShawqi = makeTape('محمد شوقي', 506, 390, 'cream', INK, 56, 110);
    // skyline (domes + minarets) cut from black paper
    const sk = mk(2000, 560), x = sk.getContext('2d'), base = 540;
    x.fillStyle = '#0d0c0b'; x.beginPath();
    const dome = (cx, r, drum) => { x.rect(cx - r, base - drum, r * 2, drum); x.moveTo(cx + r, base - drum); x.arc(cx, base - drum, r, 0, Math.PI, true); x.rect(cx - 3, base - drum - r - 40, 6, 42); };
    const minaret = (cx, h, w) => { x.rect(cx - w / 2, base - h, w, h); x.moveTo(cx - w / 2 - 4, base - h); x.lineTo(cx, base - h - 90); x.lineTo(cx + w / 2 + 4, base - h); x.rect(cx - w / 2 - 8, base - h * .62, w + 16, 10); x.rect(cx - w / 2 - 8, base - h * .82, w + 16, 10); };
    dome(1000, 190, 120); dome(760, 110, 90); dome(1240, 110, 90); dome(590, 70, 60); dome(1410, 70, 60);
    minaret(420, 420, 26); minaret(1580, 420, 26); minaret(260, 330, 22); minaret(1740, 330, 22);
    x.rect(150, base - 50, 1700, 50); x.fill();
    x.globalCompositeOperation = 'source-atop'; x.drawImage(A.bg_dark, 0, 0, 2000, 560); x.fillStyle = 'rgba(10,9,8,.6)'; x.fillRect(0, 0, 2000, 560);
    // cream rim so the cut paper reads against the dark ground
    const rim = mk(2000, 560), rx = rim.getContext('2d'); rx.drawImage(sk, 0, -3); rx.globalCompositeOperation = 'source-out'; rx.drawImage(sk, 0, 0);
    rx.globalCompositeOperation = 'source-in'; rx.fillStyle = 'rgba(239,229,207,.75)'; rx.fillRect(0, 0, 2000, 560);
    x.globalCompositeOperation = 'source-over'; x.drawImage(rim, 0, 0);
    P.sky = sk;
    // crimson banners
    P.ban = []; for (let i = 0; i < 6; i++) P.ban.push(piece({ w: 250, h: 760, tex: 'red', seed: 510 + i, rough: 5, content: (c, w, h) => {
      c.strokeStyle = '#c9a24a'; c.lineWidth = 6; c.strokeRect(18, 18, w - 36, h - 36); c.lineWidth = 2; c.strokeRect(32, 32, w - 64, h - 64);
      nuqta(c, w / 2, 120, 70, '#c9a24a', 0); nuqta(c, w / 2, 120, 24, '#7a1015', 0); } }));
    // tower of archive cards
    P.tower = []; const r = rng(520);
    for (let y = -60; y > PEAK.y + 640; y -= 110) P.tower.push({ y, x: 960 + (r() - .5) * 120, rot: (r() - .5) * .25, c: cards[Math.floor(r() * cards.length)].p, s: .9 + r() * .5 });
  };

  function goldSun(t) {
    const k = spring(t - TT.gold, 70, 16); if (k <= 0) return;
    const R = 560, cy = lerp(PEAK.y + 900, PEAK.y - 260, k);
    g.save(); g.beginPath(); g.arc(PEAK.x, cy, R, 0, 6.283); g.clip();
    g.drawImage(A.paper_gold, PEAK.x - R, cy - R, R * 2, R * 2); g.restore();
    g.save(); g.strokeStyle = 'rgba(201,162,74,.5)'; g.lineWidth = 3; g.setLineDash([4, 14]);
    g.beginPath(); g.arc(PEAK.x, cy, R + 40 + 10 * Math.sin(t * 2), 0, 6.283); g.stroke(); g.restore();
  }

  S.draw = (t) => {
    // camera: rise from foundations (s04 end) to the summit, then pull back for the giants
    const up = spring(t - TT.rise, 60, 15);
    const cy = lerp(540 + 520, PEAK.y - 40, up) + spring(t - TT.pull, 60, 18) * -180;
    const s = Math.exp(lerp(Math.log(1.04), Math.log(.92), up) + spring(t - TT.pull, 50, 17) * Math.log(.74));
    const camX = track(t, [[0, 960], [TT.hafiz - .3, 960 - 430], [TT.sultan - .25, 960 + 430]], 70, 17);
    const zb = Math.exp(Math.log(1.3) * (spring(t - (TT.hafiz - .3), 70, 17)));
    camBegin(t, s * zb, camX, cy + 120 * spring(t - (TT.hafiz - .3), 70, 17), 0, shake(t, TT.crown + .05, 6));
    // s04's world, settled (cards, blueprint, foundations)
    SECTIONS.find(q => q.id === 's04').world(t);
    // tower of cards up to the summit
    P.tower.forEach((c, i) => { const b = boil(530 + i, t, .6); drawPiece(c.c, c.x + b[0], c.y + b[1], c.rot + b[2], c.s, 0, 1); });
    goldSun(t);
    // skyline rises behind the summit
    const kS = spring(t - TT.sky, 110, 19);
    if (kS > 0) g.drawImage(P.sky, PEAK.x - 1000, lerp(PEAK.y + 900, PEAK.y - 660, kS));
    // the summit sheet + landing crown
    const ck = spring(t - TT.crown, 220, 15);
    drawSheetState(t, { x: PEAK.x, y: PEAK.y + 120, sc: .62, crownLift: (1 - ck) * 900, crownRot: (1 - ck) * .5, dots: false });
    tapeIn(P.tPeak, t, TT.tapePeak, TT.pull, PEAK.x - 300, PEAK.y + 330, -.04, 540, 'pop');
    tapeIn(P.tGold, t, TT.gold + .5, null, PEAK.x + 420, PEAK.y - 360, .05, 541, 'pop');
    tapeIn(P.tOtt, t, TT.tapeOtt, null, PEAK.x, PEAK.y + 440, -.02, 542, 'pop');
    // banners of the giants drop from the sky
    const bx = [PEAK.x - 1130, PEAK.x - 820, PEAK.x - 560, PEAK.x + 560, PEAK.x + 820, PEAK.x + 1130];
    const lab = [];
    bx.forEach((x, i) => { const order = [0, 5, 1, 4, 2, 3][i], k = spring(t - (TT.banners + order * .12), 140, 15); if (k <= 0) return;
      const b = boil(550 + i, t, .6), sway = Math.sin(t * 1.6 + i) * .015 * (1 - .5 * k);
      const y = lerp(PEAK.y - 1800, PEAK.y - 30 + (i % 2) * 60, k);
      g.save(); g.translate(x + b[0], y - 380); g.rotate(sway + b[2]); drawPiece(P.ban[i], 0, 380, 0, 1, 0, 1);
      g.strokeStyle = '#c9a24a'; g.lineWidth = 3; g.beginPath(); g.moveTo(-90, 0); g.lineTo(0, -120); g.lineTo(90, 0); g.stroke();
      if (i === 2 || i === 3) lab.push([i, g.getTransform()]);
      g.restore(); });
    for (const [i, m] of lab) { g.save(); g.setTransform(m);
      if (i === 2) tapeIn(P.nHafiz, t, TT.hafiz, null, 0, 400, -.06, 560, 'pop');
      if (i === 3) { tapeIn(P.tSultan, t, TT.sultan, null, 0, 280, .05, 561, 'pop'); tapeIn(P.nShawqi, t, TT.shawqi, null, 0, 400, .05, 562, 'pop'); }
      g.restore(); }
    g.restore();
    finishFrame(t);
  };
  SECTIONS.push({ id: 's05', from: S.from, to: S.to, init: S.init, draw: S.draw });
})();
