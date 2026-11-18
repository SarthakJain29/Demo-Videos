"""Local narration with Kokoro-82M (Apache-2.0). Writes public/vo/<id>.wav (24 kHz mono).
Usage: .venv-tts/bin/python scripts/tts_kokoro.py [--voice af_heart] [--speed 1.0] [--only id,id] [--out DIR]
"""
import argparse, json, os, sys
import numpy as np, soundfile as sf
from kokoro import KPipeline

ap = argparse.ArgumentParser()
ap.add_argument("--voice", default=os.environ.get("KOKORO_VOICE", "af_heart"))
ap.add_argument("--speed", type=float, default=float(os.environ.get("KOKORO_SPEED", "1.0")))
ap.add_argument("--only", default="")
ap.add_argument("--out", default="public/vo")
ap.add_argument("--text", default="")
a = ap.parse_args()
os.makedirs(a.out, exist_ok=True)
scenes = json.load(open("src/script.json"))
only = [x for x in a.only.split(",") if x]
pipe = KPipeline(lang_code=a.voice[0], repo_id="hexgrad/Kokoro-82M")
gap = np.zeros(int(24000 * 0.12), dtype=np.float32)
for s in scenes:
    if only and s["id"] not in only:
        continue
    text = a.text or s.get("tts", s["text"])
    parts = [r.audio.numpy() if hasattr(r.audio, "numpy") else r.audio for r in pipe(text, voice=a.voice, speed=a.speed, split_pattern=r"(?<=[.?!])\s+")]
    audio = np.concatenate([np.concatenate([p, gap]) for p in parts])
    sf.write(os.path.join(a.out, f"{s['id']}.wav"), audio, 24000, subtype="PCM_16")
    print(s["id"], round(len(audio) / 24000, 2), "s", a.voice)
    if a.text:
        break
