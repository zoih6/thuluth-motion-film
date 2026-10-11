// ════════════════════════════════════════════════════════════════════
//  S04 · 48.64 – 67.34  «وفي القرن الرابع الهجري وصل الوزير العباسي العبقري ابن مقلة،
//  فوضع أعظم منظومة للنسب الهندسية في التاريخ. ثم جاء ابن البواب ليهذب هذا البناء
//  ويرسي قواعده بعمق أكبر»
//  Idea: the name-sheet flips → its back is the date card. Two master cards are dealt
//  while a blueprint sheet builds Ibn Muqla's system (alif = N nuqtas = circle diameter);
//  Ibn al-Bawwab refines it (polygon → smooth curve, alif gets its head) and lays
//  foundations under it — the camera sinks into them (hand-off to s05's rise).
// ════════════════════════════════════════════════════════════════════
(() => {
  const S = { from: 48.64, to: 67.34 };
  const TT = { off: 48.7, flip: 48.85, era: 49.75, park: 51.0, card1: 51.1, genius: 53.5, name1: 54.2, sheet: 55.3, alif: 55.6,
    dots: 56.2, circle: 57.05, geo: 58.35, tapeGeo: 58.45, hist: 59.3, card2: 60.1, name2: 61.65, refine: 62.4, tapeRef: 62.6,
    found: 64.2, deep: 65.9 };
  const P = {};
  const SX = 620, SY = 520;          // blueprint sheet centre
  const AL = { x: SX + 150, top: SY - 250, n: 7, d: 64 };   // alif: n nuqtas of size d
  S.init = async () => {
    P.small = piece({ w: 900, h: 470, tex: 'cream', seed: 88, rough: 8, tint: 'rgba(246,238,218,.7)' });
    P.back = piece({ w: 900, h: 470, tex: 'kraft', seed: 401, rough: 8, content: (x, w, h) => {
      x.direction = 'rtl'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = INK;
      x.font = '900 150px Kufi'; x.fillText('٤ هـ', w / 2, h / 2 - 40);
      x.font = '800 54px Kufi'; x.fillStyle = RED; x.fillText('القرن الرابع الهجري', w / 2, h / 2 + 105); } });
    P.tName2 = makeTape('ومن هنا جاء الاسم', 85, 560, 'cream', INK, 50);
    P.tThird = makeTape('ثُلث', 84, 230, 'red', CREAM, 64, 100);
    const card = (seed, label, name) => ({
      base: piece({ w: 500, h: 640, tex: 'dark', seed, rough: 7, content: (x, w, h) => {
        x.strokeStyle = 'rgba(239,229,207,.35)'; x.lineWidth = 2; x.setLineDash([8, 10]); x.strokeRect(28, 28, w - 56, h - 56); x.setLineDash([]);
        nuqta(x, w / 2, 190, 150, RED, 0); nuqta(x, w / 2, 190, 52, CREAM, 0);
        x.direction = 'rtl'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = 'rgba(239,229,207,.55)'; x.font = '800 30px Kufi'; x.fillText(label, w / 2, h - 80); } }),
      name: makeTape(name, seed + 1, 440, 'cream', INK, 76, 120) });
    P.c1 = card(402, 'الوزير العباسي', 'ابن مقلة');
    P.c2 = card(404, 'المُهذِّب', 'ابن البواب');
    P.tGen = makeTape('العبقري', 406, 250, 'red', CREAM, 44, 80);
    P.sheet = piece({ w: 760, h: 820, tex: 'cream', seed: 407, rough: 7, tint: 'rgba(246,238,218,.68)' });
    P.tGeo = makeTape('النسب الهندسية', 408, 470, 'red', CREAM, 52);
    P.tRef = makeTape('يُهذِّب', 409, 250, 'dark', CREAM, 52);
    P.tFound = makeTape('القواعد', 410, 290, 'cream', INK, 52);
    P.bricks = []; for (let i = 0; i < 8; i++) P.bricks.push(piece({ w: 230, h: 92, tex: i % 3 ? 'kraft' : 'cream', seed: 420 + i, rough: 4 }));
  };

  // calligraphy sheet as s03 left it
  function drawNameSheet(t, x, y, sc, rot, sxs) {
    if (sxs >= 0) {
      drawPiece(P.small, x, y, rot, sc, 0, 1, Math.max(.001, sxs));
      g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc * Math.max(.001, sxs), sc);
      const cw = 680, ch = cw * inkH / inkW; g.drawImage(inkFrame(1), -cw / 2, -ch / 2 + 6, cw, ch); g.drawImage(A.dot, -cw / 2, -ch / 2 + 6, cw, ch); g.restore();
    } else drawPiece(P.back, x, y, rot, sc, 0, 1, Math.max(.001, -sxs));
  }

  function drawBlueprint(t) {
    const k = spring(t - TT.sheet, 140, 19); if (k <= 0) return;
    const b = boil(440, t, .5), lift = spring(t - TT.found, 110, 18) * -40;
    g.save(); g.translate(0, lerp(1300, 0, k) + lift);
    drawPiece(P.sheet, SX + b[0], SY + b[1], -.015, 1, 0, 1);
    const ref = smooth(TT.refine, TT.refine + 1.1, t);
    // alif: drawn top → bottom, gains its head (tarwis) when refined
    const ap = smooth(TT.alif, TT.alif + .5, t), H = AL.n * AL.d, x0 = AL.x;
    if (ap > 0) {
      g.save(); g.fillStyle = INK; g.beginPath();
      const y0 = AL.top, y1 = AL.top + H * ap, w = 44;
      g.moveTo(x0 - w / 2 + 6, y0); g.lineTo(x0 + w / 2 + 6, y0); g.lineTo(x0 + w / 2 - 4 * ap, y1); g.lineTo(x0 - w / 2 - 4 * ap, y1); g.closePath(); g.fill();
      if (ref > 0) { g.beginPath(); g.moveTo(x0 - w / 2 + 6, y0 + 4); g.quadraticCurveTo(x0 - w / 2 - 30 * ref, y0 - 10 * ref, x0 - w / 2 - 52 * ref, y0 + 22 * ref); g.lineTo(x0 - w / 2 + 6, y0 + 40); g.fill(); }
      g.restore();
    }
    // nuqta stack = the unit
    for (let i = 0; i < AL.n; i++) { const s = spring(t - (TT.dots + i * .1), 340, 17); if (s <= 0) continue;
      const yy = AL.top + AL.d * (i + .5); nuqta(g, x0 + 72, yy, AL.d * .82 * s, INK, 0);
      g.save(); g.globalAlpha = clamp(s); g.fillStyle = RED; g.font = '800 26px Kufi'; g.direction = 'rtl'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('١٢٣٤٥٦٧'[i], x0 + 124, yy + 2); g.restore(); }
    // circle with the alif as diameter, drawn by a compass
    const cx = x0 - 18, cy = AL.top + H / 2, R = H / 2;
    const cp = smooth(TT.circle, TT.circle + 1.0, t);
    if (cp > 0) {
      const a0 = -Math.PI / 2, a1 = a0 - cp * Math.PI * 2;
      g.save(); g.strokeStyle = RED; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, R, a0, a1, true); g.stroke(); g.restore();
      if (cp < 1) { const px = cx + Math.cos(a1) * R, py = cy + Math.sin(a1) * R; // compass arms
        g.save(); g.strokeStyle = INK; g.lineWidth = 7; g.lineCap = 'round'; const hx = (cx + px) / 2 + Math.cos(a1 + Math.PI / 2) * 0, hy = Math.min(cy, py) - 120;
        g.beginPath(); g.moveTo(cx, cy); g.lineTo(hx, hy); g.lineTo(px, py); g.stroke(); nuqta(g, hx, hy, 26, RED, 0); g.restore(); }
    }
    // construction geometry: diameters, inscribed rhombus (the nuqta again), small circles
    const gp = (i) => smooth(TT.geo + i * .18, TT.geo + i * .18 + .45, t);
    if (gp(0) > 0) {
      pathReveal([[cx - R, cy], [cx + R, cy]], gp(0), { color: RED, width: 2, dash: [10, 8] });
      pathReveal([[cx, cy - R], [cx + R, cy], [cx, cy + R], [cx - R, cy]], gp(1), { color: RED, width: 3, closed: true });
      for (const [ox, oy, i] of [[cx, cy - R / 2, 2], [cx, cy + R / 2, 3]]) { const p = gp(i); if (p > 0) { g.save(); g.strokeStyle = RED; g.lineWidth = 2; g.setLineDash([6, 7]); g.beginPath(); g.arc(ox, oy, R / 2, -Math.PI / 2, -Math.PI / 2 + p * 6.283); g.stroke(); g.restore(); } }
    }
    // the bowl: angular polygon (Ibn Muqla's construction) → refined smooth curve (Ibn al-Bawwab)
    const bp = smooth(TT.geo + .6, TT.geo + 1.3, t);
    if (bp > 0) {
      const pts = [];
      for (let i = 0; i <= 40; i++) { const u = i / 40, a = Math.PI * (.15 + .8 * u);
        const sharp = Math.round(u * 5) / 5, as = Math.PI * (.15 + .8 * sharp);           // 5-gon approximation
        const xa = cx - 330 + Math.cos(a) * 150, ya = cy + 20 + Math.sin(a) * 130;
        const lin = (() => { const j = Math.floor(u * 5), f = u * 5 - j, aa = Math.PI * (.15 + .8 * j / 5), ab = Math.PI * (.15 + .8 * Math.min(1, (j + 1) / 5));
          return [lerp(Math.cos(aa), Math.cos(ab), f), lerp(Math.sin(aa), Math.sin(ab), f)]; })();
        const xl = cx - 330 + lin[0] * 150, yl = cy + 20 + lin[1] * 130;
        pts.push([lerp(xl, xa, ref), lerp(yl, ya, ref)]); }
      pathReveal(pts, bp, { color: INK, width: lerp(10, 26, ref) });
    }
    tapeIn(P.tGeo, t, TT.tapeGeo, null, SX, SY + 440, .02, 441, 'pop');
    tapeIn(P.tRef, t, TT.tapeRef, null, SX - 250, SY - 330, -.05, 442, 'pop');
    g.restore();
  }

  function drawCards(t) {
    const deal = (c, t0, tn, x, y, rot, id) => {
      const k = spring(t - t0, 150, 18); if (k <= 0) return;
      const b = boil(id, t, .7);
      drawPiece(c.base, lerp(2400, x, k) + b[0], y + b[1], lerp(.4, rot, k) + b[2], 1, 0, 1);
      tapeIn(c.name, t, tn, null, x + b[0], y + 120 + b[1], rot * .6, id + 1, 'pop');
    };
    // card 1 slides back when card 2 arrives
    const push = spring(t - TT.card2, 160, 22);
    deal(P.c1, TT.card1, TT.name1, 1420 - 170 * push, 540 - 30 * push, .04 - .06 * push, 450);
    if (t > TT.genius) { const p = smooth(TT.genius, TT.genius + .35, t);
      tapeIn(P.tGen, t, TT.genius, null, 1420 - 170 * push + 150, 260 - 30 * push, .12, 452, 'pop'); }
    deal(P.c2, TT.card2, TT.name2, 1480, 580, -.035, 454);
  }

  function drawFoundations(t) {
    if (t < TT.found - .05) return;
    const rows = 6, bw = 236, bh = 98;
    for (let r = 0; r < rows; r++) for (let i = 0; i < 5; i++) {
      const t0 = TT.found + r * .22 + i * .045, k = spring(t - t0, 260, 20); if (k <= 0) continue;
      const x = SX - 2 * bw + i * bw + (r % 2 ? bw / 2 : 0) - 60, y = SY + 470 + r * bh;
      const b = boil(470 + r * 7 + i, t, .5);
      drawPiece(P.bricks[(r * 5 + i) % 8], x + b[0], lerp(y + 700, y, k) + b[1], (hash(r, i) - .5) * .05, 1, 0, 1);
    }
    tapeIn(P.tFound, t, TT.found + .5, null, SX + 520, SY + 640, .04, 471, 'pop');
  }

  S.draw = (t) => {
    const deep = spring(t - TT.deep, 70, 16);
    const camY = 540 + deep * 520, s = 1 + .04 * deep;
    camBegin(t, s, 960, camY, 0, shake(t, TT.found + 1.3, 3));
    // the name sheet: tapes fly, sheet flips to the date, then parks as a small tag
    const fk = smooth(TT.flip, TT.flip + .55, t), pk = spring(t - TT.park, 150, 20);
    const nx = lerp(960, 560, pk), ny = lerp(470, 500, pk), nsc = lerp(1, .66, pk), nrot = lerp(-.012, -.05, pk);
    if (t < TT.flip + .2) { tapeIn(P.tName2, t, -9, TT.off, 960, 150, .025, 832, 'pop'); tapeIn(P.tThird, t, -9, TT.off + .06, 960, 880, 0, 833, 'pop'); }
    // the date card parks only until the blueprint arrives
    const gone = spring(t - (TT.sheet - .2), 170, 24);
    if (gone < .999) drawNameSheet(t, nx - gone * 900, ny, nsc * (1 + .15 * shake(t, TT.flip + .55, 1, 30)), nrot, Math.cos(Math.PI * fk));
    drawCards(t);
    drawBlueprint(t);
    drawFoundations(t);
    g.restore();
    finishFrame(t);
  };
  S.world = (t) => { drawCards(t); drawBlueprint(t); drawFoundations(t); };
  SECTIONS.push({ id: 's04', from: S.from, to: S.to, init: S.init, draw: S.draw, world: S.world });
})();
