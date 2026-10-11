# خط الثلث — عيّنة موشن جرافيك (00:00–00:20)

- `renders/thuluth_sample_00-20.mp4` — الفيديو النهائي (1920×1080 · 30fps · صوت)
- `renders/contact.png` · `renders/poster.png` — شيت الإطارات والبوستر
- `docs/treatment.md` — فكرة وخطة الفيلم الكامل
- `docs/vo_word_timings.json` — توقيت كلمات التعليق الصوتي
- `index.html` — مصدر الفيلم (window.seek(t))
- `assets/` · `fonts/` — الأصول والخطوط
- `render.mjs` · `sfx2.mjs` · `cues.json` · `prep_assets.py` — أدوات التصيير والصوت

## إعادة التصيير
```bash
npm i -D playwright && npx playwright install chromium
node render.mjs --fps 30 --from 0 --to 20.8 --sub 2 --out out/silent.mp4
node sfx2.mjs cues.json out/sfx.wav 20.8
# ثم ادمج مع التعليق الصوتي عبر ffmpeg
```
