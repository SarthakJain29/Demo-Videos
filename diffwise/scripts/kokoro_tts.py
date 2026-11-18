"""Local narration with Kokoro-82M (Apache-2.0). No API keys.
  python scripts/kokoro_tts.py                 # all scenes with KOKORO_VOICE (default af_heart)
  python scripts/kokoro_tts.py --sample af_heart af_bella bm_george   # first line in several voices -> out/voice-samples/
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
from kokoro import KPipeline

SR = 24000
voice = os.environ.get("KOKORO_VOICE", "af_heart")
speed = float(os.environ.get("KOKORO_SPEED", "1.0"))
scenes = json.load(open("scripts/narration.json"))

def synth(pipe, text, v):
    parts = [a for _, _, a in pipe(text, voice=v, speed=speed)]
    a = np.concatenate([np.asarray(p) for p in parts])
    idx = np.where(np.abs(a) > 0.01)[0]
    return a[max(idx[0] - 600, 0): idx[-1] + 1200] if len(idx) else a

def pipe_for(v):
    return KPipeline(lang_code=v[0], repo_id="hexgrad/Kokoro-82M")

if len(sys.argv) > 1 and sys.argv[1] == "--sample":
    os.makedirs("out/voice-samples", exist_ok=True)
    for v in sys.argv[2:]:
        a = synth(pipe_for(v), scenes[0]["text"], v)
        sf.write(f"out/voice-samples/{v}.wav", a, SR)
        print(v, round(len(a) / SR, 2), "s")
    sys.exit()

pipe = pipe_for(voice)
os.makedirs("public/audio", exist_ok=True)
timings = {}
for s in scenes:
    a = synth(pipe, s["text"], voice)
    out = f"public/audio/{s['id']}.wav"
    sf.write(out + ".tmp.wav", a, SR)
    # normalize loudness (Kokoro output is quiet) to ~-16 LUFS
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", out + ".tmp.wav", "-af", "loudnorm=I=-16:TP=-1.5:LRA=7", "-ar", str(SR), out], check=True)
    os.remove(out + ".tmp.wav")
    timings[s["id"]] = round(sf.info(out).duration, 2)
    print(s["id"], timings[s["id"]])
json.dump(timings, open("src/timings.json", "w"), indent=1)
print("total", round(sum(timings.values()), 1), "s of speech; voice", voice)
