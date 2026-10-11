#!/usr/bin/env bash
# ./upload.sh NAME  → uploads segments/NAME.mp4 to release 'segments' (replacing same-name asset), deletes local
TOK=$(cat /tmp/.ghtok); R=409680796; N=$1
old=$(curl -s -H "Authorization: Bearer $TOK" https://api.github.com/repos/zoih6/thuluth-motion-film/releases/$R/assets | python3 -c "import sys,json;print(' '.join(str(a['id']) for a in json.load(sys.stdin) if a['name']=='$N.mp4'))")
for id in $old; do curl -s -X DELETE -H "Authorization: Bearer $TOK" https://api.github.com/repos/zoih6/thuluth-motion-film/releases/assets/$id; done
r=$(curl -s -X POST -H "Authorization: Bearer $TOK" -H "Content-Type: video/mp4" --data-binary @segments/$N.mp4 "https://uploads.github.com/repos/zoih6/thuluth-motion-film/releases/$R/assets?name=$N.mp4" | python3 -c "import sys,json;d=json.load(sys.stdin);print(d.get('state'),d.get('size'))")
echo "$N $r"; case "$r" in uploaded*) rm -f segments/$N.mp4 renders/silent_$N.mp4;; esac
