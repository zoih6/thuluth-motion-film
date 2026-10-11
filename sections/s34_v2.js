// ════════════════════════════════════════════════════════════════════
//  S03+S04 v2 · 32.64 – 67.34   (one continuous camera move across a paper table)
//  «بدأت الحكاية في العصر الأموي؛ يوم اشتقه الخطاط قطبة المحرر من خط الطومار الكبير،
//   حيث قطّت رأس القصبة بمقدار ثلث عرضه، ومن هنا جاء الاسم. وفي القرن الرابع الهجري
//   وصل الوزير العباسي العبقري ابن مقلة فوضع أعظم منظومة للنسب الهندسية في التاريخ.
//   ثم جاء ابن البواب ليهذب هذا البناء ويرسي قواعده بعمق أكبر»
//  Real assets: Birmingham Qur'an (Hijazi), giant-script fragment (WDL 6805) for the Tumar,
//  a real reed qalam (Commons Qalam2.jpg), a real line of giant script (Baysunghur Qur'an,
//  c.1400) whose own rhombic nuqta becomes the measuring unit on its own alif, Ibn al-Bawwab's
//  Qur'an (CBL Is 1431, 1000–01 CE) under a loupe. Portraits: illustrative AI miniatures.
//  Motion language: ONE camera spring (CAMK) over keyed stations; every clipping enters with
//  ENTER (drop + settle), leaves with EXIT (slides to the right = the past, RTL); tapes SNAPPY.
// ════════════════════════════════════════════════════════════════════
(() => {
  const CAMK = [30, 10.6];               // camera spring (critically damped, ~1.3 s)
  const ENTER = [120, 19];               // clippings
  const T = {
    wipe: 32.64, folio: 33.0, folioTag: 34.3, era: 35.06, scribe: 36.78, name: 38.42,
    tumar: 40.3, tumarTape: 40.8, arrow: 41.3, toReed: 41.95, knife: 42.15, cut: 43.10,
    measure: 44.45, third: 45.42, name2: 46.52, write0: 46.9, write1: 48.3,
    pan: 48.64, era2: 49.75, muqla: 51.08, wazir: 52.16, genius: 53.52, name3: 54.22,
    clip: 55.34, lift: 55.9, dots: 56.5, circle: 57.1, geo: 58.38, hist: 59.3,
    bawwab: 60.12, name4: 61.52, refine: 62.42, found: 64.22, deep: 65.75, end: 67.34,
  };
  const P = {};
  // station geometry (world coords; RTL — history starts on the right and travels left)
  const FOLIO = { x: 5980, y: 500, w: 1000, rot: -.025 };
  const QUTBA = { x: 5080, y: 560, w: 560 };
  const TUMAR = { x: 4180, y: 470, w: 920, rot: .02 };
  const REED = { x: 2950, y: 520, len: 1500 };               // horizontal, tip to the left
  const CL = { x: 700, y: 470, w: 1150, rot: -.012 };        // Baysunghur line clipping
  const MUQ = { x: 1580, y: 600, w: 620 };
  const BAW = { x: 1660, y: 640, w: 560 };
  const PAGE = { x: 1215, y: 400, w: 430, rot: .045 };
  // the real alif in baysunghur.jpg (pixels) and its real nuqta
  const ALIF = { x: 689, top: 186, bot: 662 }, RDOT = { x: 644, y: 488, w: 57, h: 53 };
  const KC = CL.w / 2000;                                     // image px → world
  const imL = (ix, iy) => [ix * KC - CL.w / 2, iy * KC - (940 * KC) / 2];   // → clip-local
  const toW = (lx, ly) => { const c = Math.cos(CL.rot), s = Math.sin(CL.rot); return [CL.x + lx * c - ly * s, CL.y + lx * s + ly * c]; };
  const [AWX, AWY] = toW(...imL(ALIF.x, (ALIF.top + ALIF.bot) / 2));

  const sil2 = (img, blur) => { const c = mk(img.width + blur * 6, img.height + blur * 6), x = c.getContext('2d');
    x.filter = `blur(${blur}px) brightness(0)`; x.drawImage(img, blur * 3, blur * 3); return c; };
  // a real scan printed on a torn paper clipping
  function realPiece(img, w, { crop = null, seed = 1, rough = 6, res = 1, tex = 'cream' } = {}) {
    const [sx, sy, sw, sh] = crop || [0, 0, img.width, img.height];
    const h = Math.round(w * sh / sw);
    const p = piece({ w, h, tex, seed, rough, res, fiber: .7, content: (x, w, h) => {
      x.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      x.globalCompositeOperation = 'multiply'; x.globalAlpha = .18; x.drawImage(A.paper_cream, 0, 0, w, h);
      x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1; } });
    p.img = img; p.crop = [sx, sy, sw, sh]; return p;
  }
  const enterK = (t, t0) => spring(t - t0, ...ENTER);
  const exitK = (t, t1) => t1 ? spring(t - t1, ...ENTER) : 0;

  async function init() {
    const L = (k, f) => loadImg(k, 'assets/v2/' + f);
    await Promise.all([L('v2_folio', 'birmingham.jpg'), L('v2_giant', 'giant.jpg'), L('v2_bays', 'baysunghur.jpg'), L('v2_bawwab', 'bawwab.jpg'),
      L('v2_qutba', 'p_qutba.png'), L('v2_muqla', 'p_ibnmuqla.png'), L('v2_bawP', 'p_ibnbawwab.png'),
      L('v2_reed', 'qalam_side.png'), L('v2_kufic', 'kufic.jpg'), L('v2_dot', 'real_dot.png')]);
    for (const k of ['v2_qutba', 'v2_muqla', 'v2_bawP']) A[k + 'Sh'] = sil2(A[k], 14);
    A.v2_reedSh = sil2(A.v2_reed, 10);
    if (!A.knifeSh) A.knifeSh = sil2(A.knife, 8);
    P.folio = realPiece(A.v2_folio, FOLIO.w, { seed: 3101, rough: 7 });
    P.giant = realPiece(A.v2_giant, TUMAR.w, { seed: 3102, rough: 6 });
    P.clip = realPiece(A.v2_bays, CL.w, { seed: 3103, rough: 6, res: 2 });
    P.kufic = realPiece(A.v2_kufic, 800, { seed: 3108, rough: 6 });
    P.page = realPiece(A.v2_bawwab, PAGE.w, { seed: 3104, rough: 5 });
    P.mat = piece({ w: 1900, h: 560, tex: 'kraft', seed: 3105, rough: 9 });
    P.slip = piece({ w: 900, h: 420, tex: 'cream', seed: 88, rough: 8, tint: 'rgba(246,238,218,.72)' });
    P.ruler = piece({ w: 46, h: 300, tex: 'cream', seed: 3106, rough: 2, fiber: .4, tint: 'rgba(246,238,218,.85)' });
    P.roll = piece({ w: 46, h: 580, tex: 'kraft', seed: 3107, rough: 2 });
    P.tEra = makeTape('العصر الأموي', 81, 420, 'cream', INK, 54);
    P.tName = makeTape('قُطبة المحرر', 82, 420, 'red', CREAM, 56);
    P.tTumar = makeTape('خط الطومار الكبير', 83, 520, 'dark', CREAM, 50);
    P.tThird = makeTape('ثُلث', 84, 230, 'red', CREAM, 64, 100);
    P.tName2 = makeTape('ومن هنا جاء الاسم', 85, 560, 'cream', INK, 50);
    P.tEra2 = makeTape('القرن الرابع الهجري', 3110, 640, 'cream', INK, 58, 110);
    P.tWazir = makeTape('الوزير العباسي', 3111, 430, 'dark', CREAM, 48);
    P.tGen = makeTape('العبقري', 406, 250, 'red', CREAM, 44, 80);
    P.nMuqla = makeTape('ابن مقلة', 3112, 400, 'cream', INK, 70, 116);
    P.nBaw = makeTape('ابن البواب', 3113, 430, 'cream', INK, 70, 116);
    P.tGeo = makeTape('النسب الهندسية', 408, 470, 'red', CREAM, 52);
    P.tRef = makeTape('يُهذِّب البناء', 409, 380, 'dark', CREAM, 48);
    P.tFound = makeTape('القواعد', 410, 290, 'cream', INK, 52);
    preTag([['مصحف بالخط الحجازي · القرن الأول الهجري', 'dark', 28], ['ت ٣٢٨ هـ', 'dark', 30], ['ت ٤١٣ هـ', 'dark', 30],
      ['النقطة = وحدة القياس', 'red', 32], ['بعمق أكبر', 'red', 40], ['مصحف ابن البواب · ٣٩١ هـ', 'dark', 26], ['مصحف بالخط الكوفي · عصر العباسيين المبكر', 'dark', 26]]);
    // foundation bricks, each stamped with a nuqta (the unit the rules are built on)
    P.bricks = []; for (let i = 0; i < 8; i++) P.bricks.push(piece({ w: 230, h: 92, tex: i % 3 ? 'kraft' : 'cream', seed: 420 + i, rough: 4,
      content: (x, w, h) => nuqta(x, w / 2, h / 2, 30, i % 3 ? 'rgba(20,17,15,.75)' : RED, 0) }));
    // quiet table scraps for parallax depth (blank paper, no fake content)
    P.scraps = []; const r = rng(3120);
    for (let i = 0; i < 26; i++) P.scraps.push({ p: piece({ w: 180 + r() * 260, h: 120 + r() * 200, tex: r() < .5 ? 'kraft' : 'cream', seed: 3130 + i, rough: 6 }),
      x: -600 + i * 290 + r() * 120, y: r() < .5 ? -300 - r() * 160 : 1240 + r() * 180, rot: (r() - .5) * .5 });
  }

  // ── camera: one spring through all stations ──────────────────────────
  function cam(t) {
    const x = track(t, [[0, 5640], [T.scribe - .2, 5500], [T.tumar - .3, 4800], [T.toReed, 2650], [T.measure - .15, 2730], [T.name2, REED.x],
      [T.pan, 1300], [T.clip - .1, 960], [T.dots - .25, AWX + 40], [T.geo - .1, 760], [T.hist, 990], [T.refine - .1, 1180], [T.found - .1, 960]], ...CAMK);
    const y = track(t, [[0, 540], [T.toReed, 520], [T.measure - .15, 500], [T.name2, 540], [T.dots - .25, AWY], [T.geo - .1, 500], [T.hist, 540], [T.refine - .1, 440], [T.found - .1, 540], [T.deep, 1060]], ...CAMK);
    const ls = track(t, [[0, 0], [T.scribe - .2, Math.log(1.03)], [T.tumar - .3, Math.log(.96)], [T.toReed, 0], [T.measure - .15, Math.log(1.22)], [T.name2, 0],
      [T.pan, Math.log(.95)], [T.clip - .1, 0], [T.dots - .25, Math.log(1.8)], [T.geo - .1, Math.log(1.28)], [T.hist, Math.log(.95)], [T.refine - .1, Math.log(1.25)], [T.found - .1, 0], [T.deep, Math.log(1.04)]], ...CAMK);
    return [x, y, Math.exp(ls)];
  }

  // ── shared table ──────────────────────────────────────────────────────
  function table(t, cx, veilOn = true) {
    // parallax scraps: slower than the world (they sit "below" the table plane)
    for (const s of P.scraps) { const px = s.x + (cx - 960) * .22; if (Math.abs(px - cx) > 1500) continue;
      drawPiece(s.p, px, s.y, s.rot, 1, 0, .3); }
    if (veilOn) { g.save(); g.fillStyle = 'rgba(8,7,6,.28)'; g.fillRect(cx - 2400, -1500, 4800, 4000); g.restore(); }
    // the red thread of time, with nuqta ticks
    g.strokeStyle = RED; g.lineWidth = 3; g.beginPath(); g.moveTo(-800, 1010); g.lineTo(7400, 1010); g.stroke();
    for (let i = 0; i < 56; i++) { const x = -700 + i * 150; if (Math.abs(x - cx) > 1400) continue; nuqta(g, x, 1010, i % 5 === 0 ? 24 : 12, i % 5 === 0 ? CREAM : 'rgba(239,229,207,.5)', 0); }
    const pin = (x, t0) => { const k = spring(t - t0, ...SNAPPY); if (k <= 0) return; nuqta(g, x, 1010, 46 * k, RED, 0);
      g.strokeStyle = 'rgba(232,222,198,.8)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, 1010); g.lineTo(x, lerp(1010, 960, k)); g.stroke(); };
    pin(FOLIO.x, T.era); pin(1100, T.era2);
  }

  // ── station A: Umayyad desk ───────────────────────────────────────────
  function stationA(t) {
    const kf = enterK(t, T.folio); if (kf > 0) { const b = boil(3201, t, .5);
      drawPiece(P.folio, FOLIO.x + b[0], FOLIO.y + (1 - kf) * 760 + b[1], FOLIO.rot + (1 - kf) * .14, 1, (1 - kf) * .8, 1); }
    tag('مصحف بالخط الحجازي · القرن الأول الهجري', t, T.folioTag, FOLIO.x + 150, FOLIO.y + 370, .02, 'dark', 28);
    tapeIn(P.tEra, t, T.era, null, FOLIO.x - 120, 150, -.04, 3202, 'pop');
    // the Tumar: a giant-script fragment unrolls right → left
    const u = smooth(T.tumar, T.tumar + 1.0, t);
    if (u > 0) {
      const hw = TUMAR.w / 2, gh = P.giant.h, xr = TUMAR.x + hw + 30, xl = lerp(xr, TUMAR.x - hw - 30, u);
      g.save(); g.translate(TUMAR.x, TUMAR.y); g.rotate(TUMAR.rot); g.translate(-TUMAR.x, -TUMAR.y);
      g.save(); g.beginPath(); g.rect(xl, TUMAR.y - gh, xr - xl + 40, gh * 2); g.clip();
      drawPiece(P.giant, TUMAR.x, TUMAR.y, 0, 1, 0, 1); g.restore();
      if (u < 1) drawPiece(P.roll, xl, TUMAR.y, 0, 1, .4, 1);
      g.restore();
      tapeIn(P.tTumar, t, T.tumarTape, null, TUMAR.x + 40, TUMAR.y + gh / 2 + 70, -.03, 3203, 'pop');
      // derivation arrow: Tumar → Qutba's scroll
      const ap = smooth(T.arrow, T.arrow + .5, t);
      if (ap > 0) { const pts = []; for (let i = 0; i <= 30; i++) { const v = i / 30; pts.push([lerp(TUMAR.x + 300, QUTBA.x - 40, v), lerp(190, 300, v) - Math.sin(v * Math.PI) * 150]); }
        pathReveal(pts, ap, { color: RED, width: 7 });
        if (ap > .97) { g.save(); g.translate(QUTBA.x - 40, 300); g.rotate(.9); g.fillStyle = RED; g.beginPath(); g.moveTo(8, 0); g.lineTo(-22, -13); g.lineTo(-22, 13); g.fill(); g.restore(); } }
    }
    // Qutba
    const kq = enterK(t, T.scribe);
    if (kq > 0) { const b = boil(3204, t, .6), h = QUTBA.w * A.v2_qutba.height / A.v2_qutba.width;
      drawCut(A.v2_qutba, A.v2_qutbaSh, QUTBA.x + b[0], QUTBA.y + (1 - kq) * 900 + b[1], QUTBA.w, (1 - kq) * .1 + b[2], 0, 1, false, .5);
      tapeIn(P.tName, t, T.name, null, QUTBA.x, QUTBA.y + h / 2 + 30, .03, 3205, 'pop'); }
  }

  // ── station B: the reed on the cutting mat ────────────────────────────
  const RK = () => REED.len / A.v2_reed.height;                    // image px → world
  function stationB(t) {
    const km = enterK(t, T.toReed - .35); if (km <= 0) return;
    const b = boil(3301, t, .4);
    const kx = exitK(t, T.pan + .1); drawPiece(P.mat, REED.x + b[0], REED.y + 40 + (1 - km) * 800 + kx * 1200 + b[1], .01 + kx * .12, 1, kx * .8, 1);
    const k = RK(), thick = A.v2_reed.width * k, tipX = REED.x - REED.len / 2;
    const kin = spring(t - T.toReed, ...ENTER), slideIn = 0, slideOut = exitK(t, T.name2) * 2600;
    const ox = slideIn + slideOut, SL = 34, dropY = (1 - kin) * 900, dropR = (1 - kin) * .12;                            // sliver length (image px)
    const drawReed = (rows0, rows1, dx, dy, rot) => {
      g.save(); g.translate(REED.x + ox + dx + b[0], REED.y + dy + dropY + b[1]); g.rotate(-Math.PI / 2 + rot + dropR);
      const W2 = A.v2_reed.width * k, H2 = REED.len;
      g.globalAlpha = .5; g.drawImage(A.v2_reedSh, 0, rows0, A.v2_reedSh.width, rows1 - rows0, -W2 / 2 - 30 * k - 16, -H2 / 2 + rows0 * k - 10, A.v2_reedSh.width * k, (rows1 - rows0) * k);
      g.globalAlpha = 1; g.drawImage(A.v2_reed, 0, rows0, A.v2_reed.width, rows1 - rows0, -W2 / 2, -H2 / 2 + rows0 * k, W2, (rows1 - rows0) * k); g.restore(); };
    const N = A.v2_reed.height;
    if (t < T.cut) drawReed(0, N, 0, 0, 0);
    else {
      drawReed(SL, N, 0, 0, 0);
      const dt = t - T.cut;                                            // the trimmed sliver falls away
      if (dt < 1.2) { g.save(); const px = tipX + SL * k / 2, py = REED.y;
        g.translate(px - 140 * dt, py + 1100 * dt * dt + 60 * dt); g.rotate(-2.4 * dt); g.translate(-px, -py); drawReed(0, SL, 0, 0, 0); g.restore(); }
      // fresh pale cut face
      const fa = 1 - smooth(T.cut + .4, T.cut + 1.2, t); if (fa > 0) { g.save(); g.globalAlpha = fa; g.strokeStyle = '#f3e2bd'; g.lineWidth = 5;
        g.beginPath(); g.moveTo(tipX + SL * k + ox, REED.y - 22); g.lineTo(tipX + SL * k + ox, REED.y + 22); g.stroke(); g.restore(); }
    }
    // knife (real-looking kalemtraş) comes down onto the nib
    if (t > T.knife - .1 && t < T.cut + .8) {
      const kx = tipX + SL * k, ky = REED.y;
      const u = (t - T.knife) / (T.cut - T.knife);
      const y = u < 1 ? lerp(ky - 1100, ky + 40, 1 - Math.pow(1 - u, 2.4)) : ky + 40 - (t - T.cut) * 1700 * spring(t - T.cut - .12, 200, 26);
      const kw = 640, kk = kw / A.knife.width, kh = A.knife.height * kk, pad = (A.knifeSh.width - A.knife.width) / 2;
      g.save(); g.translate(kx + (ky - y) * .55, y); g.rotate(-Math.PI / 2 + .5);
      g.globalAlpha = .45; g.drawImage(A.knifeSh, -pad * kk + 14, -kh / 2 - pad * kk - 18, A.knifeSh.width * kk, A.knifeSh.height * kk);
      g.globalAlpha = 1; g.drawImage(A.knife, 0, -kh / 2, kw, kh); g.restore();
    }
    // measurement: reed width split in thirds; the nib is cut to one third
    const mp = smooth(T.measure, T.measure + .45, t), mo = exitK(t, T.name2 - .1);
    if (mp > 0 && mo < .99) {
      g.save(); g.globalAlpha = 1 - mo;
      const bx = tipX + 1050 + ox, y0 = REED.y - thick / 2 + 6, y1 = REED.y + thick / 2 - 6, L = y1 - y0;
      g.strokeStyle = CREAM; g.lineWidth = 3; g.lineCap = 'round';
      g.beginPath(); g.moveTo(bx, y0); g.lineTo(bx, lerp(y0, y1, mp)); g.stroke();
      for (const yy of [y0, y1]) { g.beginPath(); g.moveTo(bx - 12, yy); g.lineTo(bx + 12, yy); g.stroke(); }
      for (let i = 1; i <= 2; i++) { const st = spring(t - (T.measure + .3 + i * .14), ...SNAPPY); if (st > 0) nuqta(g, bx, y0 + L * i / 3, 16 * st, RED, 0); }
      const th = spring(t - T.third, ...SNAPPY);
      if (th > 0) { // the red third, projected along dashed guides to the nib
        g.strokeStyle = RED; g.lineWidth = 12 * th; g.lineCap = 'butt'; g.beginPath(); g.moveTo(bx, y0 + L / 3); g.lineTo(bx, y0 + 2 * L / 3); g.stroke();
        const gp = smooth(T.third + .1, T.third + .6, t);
        pathReveal([[bx, y0 + L / 3], [tipX + SL * k + 8 + ox, REED.y - L / 6]], gp, { color: RED, width: 2.5, dash: [9, 8] });
        pathReveal([[bx, y0 + 2 * L / 3], [tipX + SL * k + 8 + ox, REED.y + L / 6]], gp, { color: RED, width: 2.5, dash: [9, 8] });
      }
      g.restore();
      tapeIn(P.tThird, t, T.third + .05, T.name2 - .1, bx - 260, REED.y - thick / 2 - 110, -.05, 3302, 'pop');
    }
    // the name: a slip drops onto the mat and the word writes itself
    const ks = enterK(t, T.name2 + .1), kx2 = exitK(t, T.pan + .1);
    if (ks > 0) { const b2 = boil(3303, t, .5), sy = REED.y + 30 + (1 - ks) * 800 + kx2 * 1200;
      drawPiece(P.slip, REED.x + b2[0], sy + b2[1], -.012 + (1 - ks) * .12, 1, 0, 1);
      const cw = 680, ch = cw * inkH / inkW, ox2 = REED.x - cw / 2, oy = sy - ch / 2 + 6;
      const p = clamp((t - T.write0) / (T.write1 - T.write0)); if (p > 0) g.drawImage(inkFrame(p), ox2, oy, cw, ch);
      const dk = spring(t - (T.write1 + .02), 380, 18); if (dk > 0) { g.globalAlpha = clamp(dk * 3); g.drawImage(A.dot, ox2, oy, cw, ch); g.globalAlpha = 1; }
      tapeIn(P.tName2, t, T.name2 + .35, null, REED.x + 60, sy - 290, .025, 3304, 'pop'); }
  }

  // ── station C/D: Abbasid desk — the real alif measured by its own nuqta ──
  function drawClip(t) {
    const kc = enterK(t, T.clip); if (kc <= 0) return;
    const b = boil(3401, t, .35);
    g.save(); g.translate(CL.x + b[0], CL.y + (1 - kc) * 900 + b[1]); g.rotate(CL.rot + (1 - kc) * .12);
    drawPiece(P.clip, 0, 0, 0, 1, (1 - kc) * .8, 1);
    const at = (ix, iy) => imL(ix, iy);
    // 1) the manuscript's own dot lifts off the page …
    const lift = spring(t - T.lift, 200, 17), [dx, dy] = at(RDOT.x, RDOT.y), dw = RDOT.w * KC, dh = RDOT.h * KC;
    const fly = spring(t - T.dots, 150, 20);
    if (lift > 0) {
      // the hole it leaves: a faint cream patch where the ruler will sit
      handCircle(dx, dy, 36 * (1 + .1 * lift), smooth(T.lift + .05, T.lift + .45, t) * (1 - smooth(T.dots, T.dots + .3, t)), 3402, RED, 3);
      const [ax0, ay0] = at(ALIF.x - 64, ALIF.top), [, ay1] = at(ALIF.x - 64, ALIF.bot), rh = ay1 - ay0;
      // 2) … a cream ruler strip is laid beside the alif
      const kr = spring(t - (T.dots - .15), ...SNAPPY);
      if (kr > 0) { g.save(); g.translate(ax0, ay0 + rh / 2); g.scale(1, (rh + 24) / P.ruler.h * kr); drawPiece(P.ruler, 0, 0, 0, 1, 0, 1); g.restore(); }
      // 3) copies of the real nuqta stack up the alif — the unit of measure
      const n = 11, step = rh / n;
      for (let i = 0; i < n; i++) { const k = spring(t - (T.dots + .12 + i * .085), 300, 20); if (k <= 0) continue;
        const ty = ay1 - step * (i + .5), sx = lerp(dx, ax0, k), sy = lerp(dy - 40 * lift, ty, k), sc = lerp(1.25, step / dh * 1.02, k);
        g.drawImage(A.v2_dot, sx - dw * sc / 2, sy - dh * sc / 2, dw * sc, dh * sc); }
      // the original lifting dot (on top until the stack begins)
      if (fly < .98) { const sc = 1 + .25 * lift; g.globalAlpha = 1 - fly; g.drawImage(A.v2_dot, dx - dw * sc / 2, dy - 40 * lift - dh * sc / 2, dw * sc, dh * sc); g.globalAlpha = 1; }
    }
    // 4) the circle whose diameter is the alif, drawn by a compass
    const [cx, cy] = at(ALIF.x, (ALIF.top + ALIF.bot) / 2), R = (ALIF.bot - ALIF.top) / 2 * KC;
    const cp = smooth(T.circle, T.circle + 1.0, t);
    if (cp > 0) {
      const a0 = -Math.PI / 2, a1 = a0 - cp * Math.PI * 2;
      g.save(); g.strokeStyle = RED; g.lineWidth = 3.4; g.beginPath(); g.arc(cx, cy, R, a0, a1, true); g.stroke(); g.restore();
      if (cp < 1) { const px = cx + Math.cos(a1) * R, py = cy + Math.sin(a1) * R, hy = Math.min(cy, py) - R * .55, hx = (cx + px) / 2;
        g.save(); g.strokeStyle = INK; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx, cy); g.lineTo(hx, hy); g.lineTo(px, py); g.stroke(); nuqta(g, hx, hy, 18, RED, 0); g.restore(); }
    }
    // 5) construction: diameter + the inscribed rhombus (the nuqta again)
    const gp = (i) => smooth(T.geo + i * .2, T.geo + i * .2 + .5, t);
    if (gp(0) > 0) {
      pathReveal([[cx - R, cy], [cx + R, cy]], gp(0), { color: RED, width: 2, dash: [8, 7] });
      pathReveal([[cx, cy - R], [cx + R, cy], [cx, cy + R], [cx - R, cy]], gp(1), { color: RED, width: 2.6, closed: true });
      const p2 = gp(2); if (p2 > 0) for (const oy of [-R / 2, R / 2]) { g.save(); g.strokeStyle = RED; g.lineWidth = 1.8; g.setLineDash([5, 6]);
        g.beginPath(); g.arc(cx, cy + oy, R / 2, -Math.PI / 2, -Math.PI / 2 + p2 * 6.283); g.stroke(); g.restore(); }
    }
    g.restore();
    tag('النقطة = وحدة القياس', t, T.dots + .9, CL.x - 470, CL.y + 330, -.03, 'red', 32, T.found - .1);
    tapeIn(P.tGeo, t, T.geo + .05, T.found - .1, CL.x + 20, CL.y + 335, .02, 3403, 'pop');
  }
  function drawPortraits(t) {
    // Ibn Muqla — steps back (smaller, right) when Ibn al-Bawwab arrives
    const km = enterK(t, T.muqla); if (km > 0) {
      const back = 0, ex = exitK(t, T.bawwab - .15), b = boil(3501, t, .6);
      const x = MUQ.x, y = MUQ.y + (1 - km) * 900 + ex * 1100, w = MUQ.w;
      drawCut(A.v2_muqla, A.v2_muqlaSh, x + b[0], y + b[1], w, (1 - km) * .1 + back * .04 + b[2], 0, 1, false, .5);
      tapeIn(P.tWazir, t, T.wazir, T.bawwab, MUQ.x, MUQ.y - 330, -.03, 3502, 'pop');
      tapeIn(P.tGen, t, T.genius, T.bawwab, MUQ.x + 260, MUQ.y - 200, .12, 3503, 'pop');
      tapeIn(P.nMuqla, t, T.name3, T.bawwab - .15, x + 10, y + 330 * (1 - .3 * back), .03 - .02 * back, 3504, 'pop');
      tag('ت ٣٢٨ هـ', t, T.name3 + .4, x + 230, y + 410, -.06, 'dark', 30, T.bawwab - .15);
    }
    const kb = enterK(t, T.bawwab); if (kb > 0) {
      const b = boil(3505, t, .6), h = BAW.w * A.v2_bawP.height / A.v2_bawP.width;
      drawCut(A.v2_bawP, A.v2_bawPSh, BAW.x - 170 + b[0], BAW.y + (1 - kb) * 900 + b[1], BAW.w, (1 - kb) * .1 + b[2], 0, 1, false, .5);
      tapeIn(P.nBaw, t, T.name4, null, BAW.x - 190, BAW.y + h / 2 + 30, -.03, 3506, 'pop');
      tag('ت ٤١٣ هـ', t, T.name4 + .4, BAW.x + 50, BAW.y + h / 2 + 105, .05, 'dark', 30);
    }
  }
  function drawPage(t) {
    // Ibn al-Bawwab's own Qur'an page, read through a loupe
    const kp = enterK(t, T.refine - .2); if (kp <= 0) return;
    const b = boil(3601, t, .4), x = PAGE.x + b[0] - (1 - kp) * 0, y = PAGE.y + (1 - kp) * 900 + b[1], rot = PAGE.rot + (1 - kp) * .14;
    drawPiece(P.page, x, y, rot, 1, (1 - kp) * .8, 1);
    const w = P.page.w, h = P.page.h;
    // loupe path across a line of text (local coords), RTL
    const lp = smooth(T.refine + .3, T.found + 1.2, t), ko = spring(t - (T.found + 1.3), ...ENTER);
    if (lp > 0 && ko < .99) {
      const lx = lerp(w * .28, -w * .26, lp), ly = lerp(-h * .02, h * .1, lp) + Math.sin(lp * 6) * 6, r = 118, Z = 2.4;
      const sc = spring(t - (T.refine + .2), 260, 19) * (1 - ko);
      g.save(); g.translate(x, y); g.rotate(rot); g.translate(lx, ly); g.scale(sc, sc);
      g.save(); g.globalAlpha = .45; g.fillStyle = '#000'; g.beginPath(); g.arc(10, 16, r + 12, 0, 6.283); g.filter = 'blur(8px)'; g.fill(); g.restore();
      g.save(); g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.clip();
      g.scale(Z, Z); g.translate(-lx, -ly);
      const [sx, sy, sw, sh] = P.page.crop; g.drawImage(P.page.img, sx, sy, sw, sh, -w / 2, -h / 2, w, h); g.restore();
      g.lineWidth = 12; g.strokeStyle = '#b08a3e'; g.beginPath(); g.arc(0, 0, r + 4, 0, 6.283); g.stroke();
      g.lineWidth = 2; g.strokeStyle = 'rgba(255,240,200,.6)'; g.beginPath(); g.arc(0, 0, r - 3, -2.6, -1.2); g.stroke();
      g.save(); g.rotate(.75); g.fillStyle = '#3a2a18'; g.fillRect(r + 8, -11, 120, 22); g.fillStyle = '#b08a3e'; g.fillRect(r + 4, -14, 16, 28); g.restore();
      g.restore();
    }
    tag('مصحف ابن البواب · ٣٩١ هـ', t, T.refine + .5, PAGE.x + 20, PAGE.y + h / 2 + 34, .04, 'dark', 26);
    tapeIn(P.tRef, t, T.refine + .15, null, PAGE.x - 40, PAGE.y - h / 2 - 40, -.05, 3602, 'pop');
  }
  function drawFoundations(t) {
    if (t < T.found - .05) return;
    const rows = 6, bw = 236, bh = 98;
    for (let r = 0; r < rows; r++) for (let i = 0; i < 5; i++) {
      const t0 = T.found + r * .2 + Math.abs(i - 2) * .05, k = spring(t - t0, 260, 20); if (k <= 0) continue;
      const x = CL.x - 2 * bw + i * bw + (r % 2 ? bw / 2 : 0) - 60, y = CL.y + 345 + r * bh;
      const b = boil(3700 + r * 7 + i, t, .5);
      drawPiece(P.bricks[(r * 5 + i) % 8], x + b[0], lerp(y + 700, y, k) + b[1], (hash(r, i) - .5) * .05, 1, 0, 1);
    }
    tapeIn(P.tFound, t, T.found + .5, null, CL.x + 760, CL.y + 520, .04, 3701, 'pop');
    tag('بعمق أكبر', t, 66.14, CL.x + 700, CL.y + 880, -.04, 'red', 40);
  }
  function stationC(t) {
    const kk = enterK(t, T.pan + .25), ko = exitK(t, T.clip - .35);
    if (kk > 0 && ko < .999) { const b = boil(3802, t, .5);
      drawPiece(P.kufic, 860 + b[0], 520 + (1 - kk) * 800 + ko * 1100 + b[1], -.03 + (1 - kk) * .14 + ko * .2, 1, (1 - kk) * .8 + ko * .8, 1);
      tag('مصحف بالخط الكوفي · عصر العباسيين المبكر', t, T.era2 + .8, 900, 840 + ko * 1100, .02, 'dark', 26, T.clip - .35); }
    tapeIn(P.tEra2, t, T.era2, T.clip - .35, 860, 175, -.04, 3801, 'pop');
    drawClip(t); drawPortraits(t); drawPage(t); drawFoundations(t);
  }

  function world(t, cx) {
    table(t, cx);
    if (Math.abs(cx - 5000) < 2600) stationA(t);
    if (Math.abs(cx - REED.x) < 2300) stationB(t);
    if (cx < 2600) stationC(t);
  }

  function draw(t) {
    const [cx, cy, s] = cam(t);
    camBegin(t, s, cx, cy, 0, shake(t, T.cut, 10) + shake(t, T.found + 1.25, 3));
    world(t, cx);
    g.restore(); finishFrame(t);
  }

  SECTIONS.push({ id: 's03', from: 32.64, to: 48.64, init,
    draw: (t) => {
      if (t < T.wipe + .7 && !wipeCovered(t, T.wipe)) SECTIONS.find(q => q.id === 's02').draw(t); else draw(t);
      paperWipe(t, T.wipe);
    } });
  SECTIONS.push({ id: 's04', from: 48.64, to: 67.34, draw, world: (t) => { table(t, 960, false); stationC(t); } });
})();
