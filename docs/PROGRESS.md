# حالة العمل · Progress

المشروع كله على GitHub — مساحة العمل المحلية تُعتبر مؤقتة ويمكن حذفها في أي وقت.

## Resume from zero
```bash
git clone --depth 1 https://github.com/zoih6/thuluth-motion-film.git && cd thuluth-motion-film
./setup.sh                                   # ffmpeg + Arabic fonts + playwright/chromium
mkdir -p tmp && ffmpeg -i assets/vo.mp3 -ar 48000 -ac 2 tmp/vo_full.wav
node sfx2.mjs cues.json tmp/sfx_full.wav 236.1
node still.mjs 50 60 70                      # test stills -> tmp/still_*.png
python3 render_seg.py segNN F0 F1            # frames @30fps; chunked, crash-safe -> segments/segNN.mp4
```
Never run stills while a render is running (2 GB RAM sandbox → OOM).
After rendering: upload `segments/segNN.mp4` to release `segments` (id 409680796), then delete local mp4/wav.

## Segments (release: `segments`)
| seg | frames | time | section |
|---|---|---|---|
| seg01 | 0–654 | 0:00–0:21.8 | s01 hook / word wall / الثلث |
| seg02 | 654–979 | 0:21.8–0:32.63 | s02 laws, balance, guild, stamp |
| seg03 | 979–1459 | 0:32.63–0:48.63 | s03 Umayyad timeline, Tumar, reed cut in thirds |
| seg04 | 1459–2020 | 0:48.63–1:07.33 | s04 Ibn Muqla / Ibn al-Bawwab geometry + foundations |
| seg05 | 2020–2453 | 1:07.33–1:21.77 | s05 summit, crown, Ottoman skyline, banners |
| seg06 | 2453–4006 | 1:21.77–2:13.53 | s06 hardest (error, loupe, cracks, stems) + s07 harakat pen ¼ / void-fill / الحمل |
| seg07 | 4006–5668 | 2:13.53–3:08.93 | s08 nine worlds grid |
| seg08 | 5668–7080 | 3:08.93–3:56.0 | s09 cage → reed → scan → vector → mosque → tablet/AI → laser → crown/throne |

## ✅ DONE — release `v1.0`: final_1080p.mp4 (95MB), final_720p.mp4 (42MB), poster.jpg

Final: concat all segments video by stream copy + one global audio mix (VO + full cues.json) → release `v1.0` `final.mp4`.
`sample_v1_0000-0020.mp4` (the first approved sample) is also in the `segments` release.

## v3.1 — closing credits (2026-10-12)
- Scene 46 `v3/sc10_credits.js` (film 236.2–250.5), plate `assets/v3/plate_archive.jpg`.
- `assets/vo.mp3` is now the 12.3 s credits VO (placed at 237.0). Phrase onsets: 0.17 بحث الطالبات · 2.04 رهف · 3.26 رغد · 4.46 سالي · 5.74 سمية · 7.06 شذى · 8.72 مونتاج · 10.15 شذى ياسر.
- Build: `PAGE=v3.html node render.mjs --from 236 --to 250.5 --sub 2 --out out/credits_silent.mp4`;
  SFX `node sfx2.mjs cues_credits.json tmp/sfx_credits.wav 14.5`; mix VO(+1.0 s) + SFX (sidechain) → loudnorm −14 LUFS;
  final = v3.0 final_1080p.mp4 + credits clip (pc→tv range), concat re-encode → release `v3.1`.
