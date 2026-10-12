// ════════════════════════════════════════════════════════════════════
//  46 · end credits (236.2 – 250.5)
//  VO: assets/vo.mp3 starts at film t = 237.0 (CR.vo). Phrase onsets measured from the file:
//  بحث الطالبات 0.17 · رهف 2.04 · رغد 3.26 · سالي 4.46 · سمية 5.74 · شذى 7.06 · مونتاج 8.72 · شذى ياسر 10.15
// ════════════════════════════════════════════════════════════════════
const CR = { t0: 236.0, vo: 237.0, end: 250.5 };
(() => {
  const P = {}, V = (s) => CR.vo + s;
  const NAMES = [['رهف', 2.04], ['رغد', 3.26], ['سالي', 4.46], ['سمية', 5.74], ['شذى', 7.06]];
  const XS = [1560, 1260, 960, 660, 360], Y = 585;   // RTL: first name on the right
  INITS.push(async () => {
    await loadImg('pl_archive', 'assets/v3/plate_archive.jpg');
    P.title = card([{ t: 'بحث الطالبات', size: 72, color: PAL.ink }, { t: '', size: 22, divider: 420, color: PAL.goldD }], { seed: 4601, padX: 110, padY: 44, minW: 700 });
    P.names = NAMES.map(([n], i) => card([{ t: n, size: 56, color: PAL.ink }], { seed: 4610 + i, padX: 56, padY: 30, minW: 240, rough: 5 }));
    // montage card: paper sized for two lines, text written on in two beats
    P.mLabel = textImg([{ t: 'مونتاج', size: 36, font: UI, weight: 600, color: PAL.goldD }]);
    P.mName = textImg([{ t: 'شذى ياسر', size: 70, color: PAL.ink }]);
    P.mPaper = paper({ w: 680, h: 280, seed: 4620, rough: 6, burn: .5 });
  });
  SHOTS.push({ a: 236.2, b: 260, tin: 'cut', draw: (t) => {
    // the archive lights up out of the finale's black
    plate(A.pl_archive, t, CR.t0, CR.end, { s0: 1.0, s1: 1.08, fx0: .5, fy0: .5, fx1: .52, fy1: .44, dim: .58 });
    rays(t, { x: 820, y: -220, ang: 1.25, int: .1 + .06 * ease(V(0), V(2), t) });
    const veil = 1 - ease(CR.t0 + .2, V(.4), t);
    if (veil > 0) { g.fillStyle = `rgba(0,0,0,${veil})`; g.fillRect(0, 0, W, H); }

    // title — lands with the first phrase
    drawCard(P.title, t, V(.05), 960, 310, { rot: -.008, wdur: .7 });

    // gold thread under the names, growing right→left as each name lands
    const reach = NAMES.reduce((x, [, s], i) => t > V(s) ? lerp(x, XS[i] - 120, clamp(sp(t, V(s), 'soft'))) : x, XS[0] + 150);
    if (t > V(1.95)) line([[XS[0] + 150, Y + 4], [reach, Y + 4]], 1, { color: PAL.gold, width: 2, alpha: .85 });
    NAMES.forEach(([, s], i) => { if (i && t > V(s)) { const k = sp(t, V(s) + .1, 'snap'); if (k > 0) nuqta(g, (XS[i - 1] + XS[i]) / 2, Y + 4, 13 * k, PAL.gold); } });

    // the five names drop onto the thread, each on its spoken word
    NAMES.forEach(([, s], i) => drawCard(P.names[i], t, V(s) - .06, XS[i], Y, { rot: (i % 2 ? .025 : -.02), wdur: .32 }));

    // montage
    const km = sp(t, V(8.66), 'card');
    if (km > .001) {
      const b = breathe(7, t, .6), x = 960 + b[0], y = 850 - (1 - km) * 120 + b[1], r = -.012 + (1 - km) * .08 + b[2];
      drawP(P.mPaper, x, y, { rot: r, sc: lerp(1.06, 1, km), alpha: clamp(km * 3), lift: (1 - km) * .9 });
      g.save(); g.translate(x, y); g.rotate(r);
      writeOn(P.mLabel, 0, -70, easeOut(V(8.78), V(9.25), t));
      writeOn(P.mName, 0, 30, easeOut(V(10.1), V(10.9), t));
      g.restore();
    }

    // close to black
    const out = ease(V(12.0), CR.end - .2, t);
    if (out > 0) { g.fillStyle = `rgba(0,0,0,${out})`; g.fillRect(0, 0, W, H); }
  } });
})();
