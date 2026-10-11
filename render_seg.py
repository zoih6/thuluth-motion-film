#!/usr/bin/env python3
"""Robust segment render: python3 render_seg.py NAME F0 F1  (frame numbers @30fps)
Renders 6-second chunks in fresh browsers (retry on crash), concatenates by stream copy,
then muxes preview audio (VO + SFX, -14 LUFS) -> segments/NAME.mp4"""
import sys, subprocess, os
name, f0, f1 = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
CH = 180; os.makedirs('tmp/chunks', exist_ok=True); os.makedirs('segments', exist_ok=True); os.makedirs('renders', exist_ok=True); parts = []
for a in range(f0, f1, CH):
    b = min(a + CH, f1); out = f'tmp/chunks/{name}_{a:05d}.mp4'; parts.append(out)
    if os.path.exists(out) and os.path.getsize(out) > 1000: continue
    for attempt in range(4):
        r = subprocess.run(['node', 'render.mjs', '--fps', '30', '--from', f'{a/30:.6f}', '--to', f'{b/30:.6f}', '--sub', '2', '--crf', '20', '--out', out + '.part.mp4'])
        if r.returncode == 0: os.rename(out + '.part.mp4', out); break
        print('retry', out, attempt, flush=True)
    else: sys.exit('chunk failed ' + out)
with open(f'tmp/chunks/{name}.txt', 'w') as f: f.writelines(f"file '{os.path.basename(p)}'\n" for p in parts)
sil = f'renders/silent_{name}.mp4'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'tmp/chunks/{name}.txt', '-c', 'copy', sil], check=True)
A, D = f0 / 30, (f1 - f0) / 30
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', sil, '-ss', f'{A}', '-t', f'{D}', '-i', 'tmp/vo_full.wav', '-ss', f'{A}', '-t', f'{D}', '-i', 'tmp/sfx_full.wav',
  '-filter_complex', '[2:a]volume=0.5[s];[s][1:a]sidechaincompress=threshold=0.05:ratio=3[sc];[1:a][sc]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5[a]',
  '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-movflags', '+faststart', f'segments/{name}.mp4'], check=True)
for p in parts: os.remove(p)
print('DONE', name, flush=True)
