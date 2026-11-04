// Generates per-scene narration with Gemini TTS -> public/vo/<id>.wav and src/audio.json (durations).
// Usage: GEMINI_API_KEY=... npm run voice
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const key = process.env.GEMINI_API_KEY;
if (!key) { console.error("GEMINI_API_KEY not set; captions-only build."); process.exit(0); }
const models = [process.env.GEMINI_TTS_MODEL, "gemini-2.5-flash-preview-tts", "gemini-3.1-flash-tts-preview", "gemini-2.5-pro-preview-tts"].filter(Boolean);
const voice = process.env.GEMINI_TTS_VOICE || "Kore";
const scenes = JSON.parse(readFileSync(join(root, "src/script.json"), "utf8"));
mkdirSync(join(root, "public/vo"), { recursive: true });
const durations = {};
const prefix = "Read this as a warm, upbeat product-demo narrator with a clear, friendly pace: ";

for (const s of scenes) {
  let done = false;
  for (const model of models) {
    for (let attempt = 0; attempt < 5 && !done; attempt++) {
      try {
        const body = JSON.stringify({
          contents: [{ parts: [{ text: prefix + s.text }] }],
          generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } } },
        });
        const out = execFileSync("curl", ["-sS", "-m", "90", "-H", "Content-Type: application/json", "-d", body,
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`], { maxBuffer: 1 << 28 }).toString();
        const j = JSON.parse(out);
        const b64 = j?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!b64) throw new Error(out.slice(0, 200).replace(key, "***"));
        const pcm = Buffer.from(b64, "base64"); // 24kHz 16-bit mono
        const h = Buffer.alloc(44);
        h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVEfmt ", 8);
        h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
        h.writeUInt32LE(24000, 24); h.writeUInt32LE(48000, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34);
        h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
        writeFileSync(join(root, `public/vo/${s.id}.wav`), Buffer.concat([h, pcm]));
        durations[s.id] = +(pcm.length / 48000).toFixed(2);
        console.log(s.id, durations[s.id] + "s", model);
        done = true;
      } catch (e) { console.error(`${s.id} ${model} attempt ${attempt}:`, String(e.message).slice(0, 120).replace(/\s+/g, " ")); execFileSync("sleep", ["22"]); }
    }
    if (done) break;
  }
}
writeFileSync(join(root, "src/audio.json"), JSON.stringify(durations, null, 2));
console.log(Object.keys(durations).length + "/" + scenes.length + " scenes voiced");
