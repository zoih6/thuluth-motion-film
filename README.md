# خط الثلث — فيلم موشن جرافيك

## ⬇️ النسخة الأحدث v3.1 (مع المشهد الختامي)
- [**الفيديو النهائي 1080p**](https://github.com/zoih6/thuluth-motion-film/releases/download/v3.1/final_1080p.mp4) · [نسخة 720p](https://github.com/zoih6/thuluth-motion-film/releases/download/v3.1/final_720p.mp4) · المدة 4:10
- **المشهد الختامي (3:56–4:10):** «بحث الطالبات: رهف · رغد · سالي · سمية · شذى» و«مونتاج: شذى ياسر»
  مكتبة مخطوطات تضيء من السواد، وكل اسم يسقط على بطاقة رقّ في لحظة نطقه في التعليق الصوتي، ثم بطاقة المونتاج.
- الكود: `v3/sc10_credits.js` · المؤثرات: `cues_credits.json` · التعليق الختامي: `assets/vo.mp3` (يبدأ عند 237.0 ث)

---

## أرشيف: العيّنة الأولى (00:00–00:20)

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
