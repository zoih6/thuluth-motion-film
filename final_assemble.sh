set -e
cd "$(dirname "$0")/dl"   # dl/ must hold master_silent.mp4 (concat of seg01..08, see docs/PROGRESS.md)
ffmpeg -v error -y -i ../tmp/vo_full.wav -i ../tmp/sfx_full.wav -filter_complex "[1:a]volume=0.5[s];[s][0:a]sidechaincompress=threshold=0.05:ratio=3[sc];[0:a][sc]amix=inputs=2:normalize=0,atrim=0:236.0,loudnorm=I=-14:TP=-1.5:LRA=11[a]" -map "[a]" -ar 48000 -c:a pcm_s16le mix.wav
VF="scale=in_range=pc:out_range=tv:flags=lanczos,format=yuv420p"
ffmpeg -v error -y -i master_silent.mp4 -i mix.wav -map 0:v -map 1:a -vf "$VF" -c:v libx264 -preset medium -crf 23 -maxrate 3400k -bufsize 6800k -profile:v high -level 4.1 -g 60 -c:a aac -b:a 160k -t 236.0 -movflags +faststart final_1080p.mp4
echo "1080 done"
ffmpeg -v error -y -i master_silent.mp4 -i mix.wav -map 0:v -map 1:a -vf "scale=1280:720:in_range=pc:out_range=tv:flags=lanczos,format=yuv420p" -c:v libx264 -preset medium -crf 24 -maxrate 1700k -bufsize 3400k -profile:v high -g 60 -c:a aac -b:a 128k -t 236.0 -movflags +faststart final_720p.mp4
echo "ALL DONE"
