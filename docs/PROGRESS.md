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
| — | 2453–4000 | 1:21.8–2:13.3 | batch 4: why hardest / error cracks / harakat pen ¼ / void-fill (الحمل) |
| — | 4000–5667 | 2:13.3–3:08.9 | batch 5: nine worlds |
| — | 5667–7080 | 3:08.9–3:56 | batch 6: today → laser/vector/AI → ending |

Final: concat all segments video by stream copy + one global audio mix (VO + full cues.json) → release `v1.0` `final.mp4`.
`sample_v1_0000-0020.mp4` (the first approved sample) is also in the `segments` release.
