// Generates per-scene narration WAVs with Gemini TTS. Needs GEMINI_API_KEY in env.
import fs from "node:fs";
import {execSync} from "node:child_process";
const key = process.env.GEMINI_API_KEY;
if (!key) { console.error("GEMINI_API_KEY not set; skipping TTS (captions-only)."); process.exit(0); }
const models = (process.env.TTS_MODEL ? [process.env.TTS_MODEL] : ["gemini-3.8-flash-tts","gemini-3.1-flash-tts-preview"]);
const voice = process.env.TTS_VOICE || "Kore";
// A style prefix makes Gemini 3.8 speak ~2x slower, so it is off by default (set TTS_STYLE to try one).
const style = process.env.TTS_STYLE || "";
const scenes = JSON.parse(fs.readFileSync("scripts/narration.json","utf8"));
const timings = {};
fs.mkdirSync("public/audio",{recursive:true});
for (const s of scenes) {
  const wav = `public/audio/${s.id}.wav`;
  if (!fs.existsSync(wav) || process.env.FORCE) {
    let ok=false;
    for (const m of models) for (let a=0;a<4&&!ok;a++) {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`,{
        method:"POST",headers:{"x-goog-api-key":key,"Content-Type":"application/json"},
        body:JSON.stringify({contents:[{parts:[{text:style+s.text}]}],generationConfig:{responseModalities:["AUDIO"],speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:voice}}}}})});
      const j = await r.json();
      const d = j?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!d) { console.error(s.id,m,"attempt",a,JSON.stringify(j).slice(0,200)); await new Promise(r=>setTimeout(r,j?.error?.code===429?25000:3000)); continue; }
      const mime = j.candidates[0].content.parts[0].inlineData.mimeType || "";
      const raw = `public/audio/${s.id}.raw`;
      fs.writeFileSync(raw, Buffer.from(d,"base64"));
      // 3.x models return a WAV container; older models return raw 24kHz PCM
      execSync(mime.includes("wav") ? `ffmpeg -y -loglevel error -i ${raw} -af silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse ${wav} && rm ${raw}`
        : `ffmpeg -y -loglevel error -f s16le -ar 24000 -ac 1 -i ${raw} ${wav} && rm ${raw}`);
      ok=true; console.log("ok",s.id,m); await new Promise(r=>setTimeout(r,8000));
    }
    if(!ok){ console.error("FAILED",s.id); continue; }
  }
  const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 ${wav}`).toString());
  timings[s.id]=Math.round(dur*100)/100;
}
fs.writeFileSync("src/timings.json", JSON.stringify(timings,null,1));
console.log(timings);
