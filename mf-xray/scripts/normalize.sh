#!/usr/bin/env bash
# Loudness-normalise narration to about -16 LUFS (needs ffmpeg).
set -euo pipefail
cd "$(dirname "$0")/../public/vo"
for f in *.wav; do ffmpeg -loglevel error -y -i "$f" -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 24000 -ac 1 -c:a pcm_s16le "n_$f" && mv "n_$f" "$f"; done
