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

---
## v3 — Sepia Manuscript Cinema (branch `v3`, release `v3.0`)
Page: `v3.html` (engine `v3/core3.js`, scenes `v3/sc12.js sc34.js sc57.js sc89.js`), style rules `docs/STYLE_v3.md`, SFX cues `cues_v3.json`.
```bash
PAGE=v3.html ./cs.sh NAME 4 t1 t2 ...          # contact sheet of stills
PAGE=v3.html python3 render_seg.py NAME F0 F1  # chunked render + preview mux
node sfx2.mjs cues_v3.json tmp/sfx_full.wav 236.1
```
| part | frames | time | release `segments` |
|---|---|---|---|
| v3p1 | 0–2020 | 0:00–1:07.3 | sample_v3.mp4 |
| v3p2 | 2020–3104 | 1:07.3–1:43.5 | v3p2.mp4 |
| v3p3 | 3104–4544 | 1:43.5–2:31.5 | v3p3.mp4 |
| v3p4 | 4544–5668 | 2:31.5–3:08.9 | v3p4.mp4 |
| v3p5 | 5668–7080 | 3:08.9–3:56.0 | v3p5.mp4 |
Final: concat the video streams of the 5 parts → `dl/master_silent.mp4`, then rebuild the audio with cues_v3 and run `final_assemble.sh` (it reads tmp/sfx_full.wav).

## ✅ DONE — release `v3.0`: final_1080p.mp4 (100MB), final_720p.mp4 (47MB), poster.jpg, contact.jpg — 236.0 s, -14.3 LUFS, 7080 frames
