// Writes src/audio.json from the actual durations of public/vo/*.wav (uses ffprobe).
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
const scenes = JSON.parse(readFileSync("src/script.json", "utf8"));
const out = {};
for (const s of scenes) {
  const f = `public/vo/${s.id}.wav`;
  if (existsSync(f)) out[s.id] = +(+execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString()).toFixed(2);
}
writeFileSync("src/audio.json", JSON.stringify(out, null, 2));
console.log(out);
