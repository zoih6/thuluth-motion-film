#!/usr/bin/env bash
# ./cs.sh NAME COLS t1 t2 ...  → /var/tmp/cs_NAME.png contact sheet of stills
N=$1; C=$2; shift 2; mkdir -p tmp; rm -f tmp/still_*.png
timeout 300 node still.mjs "$@" 2>&1 | grep -E "ERR|rror" | head -5
ffmpeg -v error -y -pattern_type glob -i 'tmp/still_*.png' -vf "scale=640:-1,tile=${C}x$(( ($# + C - 1) / C ))" -frames:v 1 /var/tmp/cs_$N.png && echo ok
