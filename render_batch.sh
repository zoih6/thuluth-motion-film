#!/usr/bin/env bash
# usage: ./render_batch.sh NAME FROM TO   → renders/NAME.mp4 (silent, CRF 20) then muxes preview audio → segments/NAME.mp4
set -e
N=$1; A=$2; B=$3
node render.mjs --fps 30 --from $A --to $B --sub 2 --crf 20 --out renders/silent_$N.mp4
D=$(python3 -c "print($B-$A)")
ffmpeg -v error -y -i renders/silent_$N.mp4 -ss $A -t $D -i tmp/vo_full.wav -ss $A -t $D -i tmp/sfx_full.wav \
 -filter_complex "[2:a]volume=0.5[s];[s][1:a]sidechaincompress=threshold=0.05:ratio=3[sc];[1:a][sc]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart segments/$N.mp4
echo "DONE $N"
