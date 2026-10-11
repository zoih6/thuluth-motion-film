#!/usr/bin/env bash
# one-shot environment setup (sandbox resets drop system packages)
set -e
command -v ffmpeg >/dev/null || { sudo apt-get update -qq >/dev/null 2>&1; sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq ffmpeg fonts-noto-core fonts-arabeyes fonts-hosny-amiri fonts-lemonada fonts-sil-scheherazade >/tmp/apt.log 2>&1; }
[ -d node_modules/playwright ] || npm i -D playwright >/dev/null 2>&1
[ -d ~/.cache/ms-playwright ] || { npx playwright install chromium >/dev/null 2>&1; sudo npx playwright install-deps chromium >/tmp/deps.log 2>&1; }
echo "setup ok: $(ffmpeg -version | head -1 | cut -c1-30)"
