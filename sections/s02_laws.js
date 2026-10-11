// ════════════════════════════════════════════════════════════════════
//  S02 · 21.8 – 32.64  «ليس مجرد حروف ترسم، بل هو دولة لها قوانينها الصارمة،
//                     ومن لم يتقن موازينه.. فليس في عرف أهل الصنعة بخطاط!»
//  Idea: the word becomes a territory (a red border like a map), its laws are
//  dot-rulers; a balance weighs a true nuqta against a careless one; the guild rises; stamp.
// ════════════════════════════════════════════════════════════════════
(() => {
  const S = { from: 21.8, to: 32.64 };
  const TT = { crownOff: 22.4, border: 22.95, tapeState: 23.95, base: 24.6, tail: 24.95, lam: 25.3, tapeLaws: 25.85,
    shrink: 26.5, scale: 26.75, tilt: 28.0, guild: 29.0, stamp: 31.8 };
  let P = {};
  S.init = async () => {
    P.tState = makeTape('دولة', 31, 300, 'red', CREAM, 64, 104);
    P.tLaws = makeTape('قوانينها الصارمة', 32, 560, 'dark', CREAM, 52);
    P.tMeasure = makeTape('موازينه', 33, 380, 'cream', INK, 56);
    P.tGuild = makeTape('أهلُ الصنعة', 34, 440, 'cream', INK, 52);
    P.stamp = makeStamp('ليس بخطاط', 77);
    P.border = THULUTH_BORDER;
    const sil = (img, blur) => { const c = mk(img.width + blur * 6, img.height + blur * 6), x = c.getContext('2d');
      x.filter = `blur(${blur}px) brightness(0)`; x.drawImage(img, blur * 3, blur * 3); return c; };
    A.scribeSh = sil(A.scribe, 10);
    // rule tags ١ ٢ ٣
    P.tags = ['١', '٢', '٣'].map((n, i) => piece({ w: 64, h: 64, tex: 'red', seed: 60 + i, rough: 2.5, fiber: .3,
      content: (x, w, h) => { x.fillStyle = CREAM; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '800 40px Kufi'; x.fillText(n, w / 2, h / 2 + 3); } }));
    // balance-scale paper parts
    P.pan = piece({ w: 230, h: 34, tex: 'gold', seed: 70, rough: 3, tint: 'rgba(60,40,10,.15)' });
    P.beam = piece({ w: 640, h: 22, tex: 'gold', seed: 71, rough: 2.5, tint: 'rgba(60,40,10,.2)' });
    P.post = piece({ w: 30, h: 420, tex: 'gold', seed: 72, rough: 2.5, tint: 'rgba(60,40,10,.25)' });
    P.tile = piece({ w: 96, h: 96, tex: 'cream', seed: 74, rough: 3, tint: 'rgba(246,238,218,.7)' });
    P.band = piece({ w: 2200, h: 300, tex: 'kraft', seed: 75, rough: 10 });
    P.foot = piece({ w: 260, h: 40, tex: 'dark', seed: 73, rough: 3, tint: 'rgba(30,26,22,.4)' });
  };

  // malformed blob dot (the careless nuqta)
  function blob(x, y, s, rot) {
    g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = INK; g.beginPath();
    const r = rng(9), n = 14; for (let i = 0; i <= n; i++) { const a = i / n * 6.283, rr = s * (.42 + r() * .28);
      const px = Math.cos(a) * rr * 1.25, py = Math.sin(a) * rr * .8; i ? g.lineTo(px, py) : g.moveTo(px, py); }
    g.closePath(); g.fill(); g.restore();
  }

  S.draw = (t) => {
    // camera: slow push on the word, then release when it shrinks away
    const s = Math.exp(Math.log(1.07) * smooth(22.9, 26.4, t) - Math.log(1.07) * smooth(26.5, 27.6, t));
    const sh = shake(t, TT.stamp + .12, 16) + shake(t, TT.tilt + .1, 4);
    camBegin(t, s, 960, 540, 0, sh);

    // group transform of the sheet: centred → shrinks to the left for the balance
    const kS = spring(t - TT.shrink, 120, 21);
    const gx = lerp(960, 560, kS), gy = lerp(548, 470, kS), gs = lerp(1, .6, kS);
    const crownUp = spring(t - TT.crownOff, 150, 20);
    const C = drawSheetState(t, { x: gx, y: gy, sc: gs, crownLift: crownUp * 1200, crownRot: crownUp * .3, crown: crownUp < .99 ? 1 : 0 });

    // territory border (map line) around the letters
    if (P.border && t > TT.border) {
      const p = smooth(TT.border, TT.border + 1.25, t);
      const pts = P.border.map(([x, y]) => [C.x + x * C.k, C.y + y * C.k]);
      pathReveal(pts, p, { color: RED, width: 4.5 * gs, dash: [14 * gs, 10 * gs], closed: true });
    }
    // law 1: baseline
    const by = C.y + 572 * C.k;
    handLine(C.x + 1240 * C.k, by, C.x + 10 * C.k, by, smooth(TT.base, TT.base + .5, t), RED, 4 * gs, 3);
    // law 2: tail length in nuqtas
    dotRow(C.x + 520 * C.k, C.y + 600 * C.k, -64 * C.k, 0, 8, 40 * C.k, t, TT.tail, .06);
    // law 3: lam height in nuqtas
    dotRow(C.x + 708 * C.k, C.y + 480 * C.k, 0, -66 * C.k, 6, 40 * C.k, t, TT.lam, .07);
    // tags ١ ٢ ٣
    const tagPos = [[C.x + 1268 * C.k + 52 * gs, C.y + 120 * C.k, 24.75], [C.x + 40 * C.k, C.y + 640 * C.k, 25.15], [C.x + 708 * C.k - 50 * gs, C.y + 90 * C.k, 25.55]];
    tagPos.forEach(([x, y, t0], i) => { const k = spring(t - t0, 300, 17); if (k > 0) drawPiece(P.tags[i], x, y, (i - 1) * .12, k * gs, 0, 1); });

    // ── balance (ميزان)
    if (t > TT.scale - .1) {
      const kin = spring(t - TT.scale, 130, 15);
      const bx = 1370, by0 = lerp(-700, 0, kin);
      const tilt = track(t, [[0, 0], [TT.scale + .5, .05], [TT.tilt, .26]], 120, 9) + Math.sin(t * 2.2) * .012;
      g.save(); g.translate(0, by0);
      drawPiece(P.foot, bx, 830, 0, 1, 0, 1);
      drawPiece(P.post, bx, 620, 0, 1, 0, 1);
      // beam pivot at (bx, 410)
      const px = bx, py = 410, half = 300;
      const L = [px - Math.cos(tilt) * half, py - Math.sin(tilt) * half], R = [px + Math.cos(tilt) * half, py + Math.sin(tilt) * half];
      // strings + pans
      const drawPan = (e, content) => {
        g.strokeStyle = 'rgba(232,222,198,.8)'; g.lineWidth = 2;
        const panY = e[1] + 210; g.beginPath(); g.moveTo(e[0], e[1]); g.lineTo(e[0] - 100, panY); g.moveTo(e[0], e[1]); g.lineTo(e[0] + 100, panY); g.stroke();
        content(e[0], panY - 26); drawPiece(P.pan, e[0], panY, 0, 1, 0, 1);
      };
      drawPan(L, (x, y) => { drawPiece(P.tile, x, y - 30, -.05, 1, 0, 1); nuqta(g, x, y - 30, 48, INK, 0); });        // the true nuqta
      drawPan(R, (x, y) => { drawPiece(P.tile, x, y - 30, .06, 1, 0, 1); blob(x, y - 26, 74, .3); });            // the careless one
      g.save(); g.translate(px, py); g.rotate(tilt); drawPiece(P.beam, 0, 0, 0, 1, 0, 1); g.restore();
      nuqta(g, px, py - 4, 34, RED, 0);
      g.restore();
      tapeIn(P.tMeasure, t, 27.95, TT.guild, 1370, 960, .03, 941, 'pop');
    }
    tapeIn(P.tState, t, TT.tapeState, TT.tapeLaws - .1, 520, 880, -.05, 942, 'pop');
    tapeIn(P.tLaws, t, TT.tapeLaws, TT.shrink + .05, 620, 900, .03, 943, 'left');
    g.restore();

    // ── the guild rises, then the verdict stamp
    veil(.55 * smooth(TT.guild, TT.guild + .6, t));
    if (t > TT.guild) {
      { const k = spring(t - TT.guild, 120, 20), b = boil(949, t, .6); drawPiece(P.band, 960 + b[0], lerp(1400, 990, k) + b[1], -.015, 1, 0, 1); }
      for (let i = 0; i < 5; i++) {
        const k = spring(t - (TT.guild + .15 + i * .22), 150, 18);
        const x = 260 + i * 350, y = lerp(1500, 1090, k);
        const b = boil(950 + i, t, .8);
        drawCut(A.scribe, A.scribeSh, x + b[0], y + b[1], 430, b[2], 0, 1, i % 2 === 1, 1);
      }
      tapeIn(P.tGuild, t, 30.7, null, 960, 150, -.03, 944, 'pop');
    }
    if (t > TT.stamp) {
      const k = spring(t - TT.stamp, 420, 24);
      const sc = lerp(2.4, 1, k);
      g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.translate(960 + sh, 470); g.rotate(-0.13); g.scale(sc, sc);
      g.globalAlpha = clamp(k * 3) * .94; g.globalCompositeOperation = 'source-over';
      g.drawImage(P.stamp, -P.stamp.width / 2, -P.stamp.height / 2); g.restore();
    }
    finishFrame(t);
  };
  SECTIONS.push({ id: 's02', from: S.from, to: S.to, init: S.init, draw: S.draw });
})();
