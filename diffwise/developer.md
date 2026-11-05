# Developer notes

## Preview / edit / render
```bash
cd diffwise && npm install
npm run dev               # Remotion Studio
npm run render            # 1080p  → out/diffwise-1080p.mp4
npm run render:vertical   # 1080x1920 → out/diffwise-vertical.mp4
npm run tts:setup         # once: Python 3.12 venv + Kokoro (needs uv, network for model download)
npm run tts               # local Kokoro narration -> public/audio/*.wav + src/timings.json
npm run tts:samples       # first line in several voices -> out/voice-samples/ (gitignored)
npm run tts:gemini        # optional alternative: Gemini TTS (needs GEMINI_API_KEY)
```
Layout: `src/Video.tsx` (timeline, captions, audio, vertical wrapper) · `src/scenes1.tsx` / `scenes2.tsx` (the 9 scenes) · `src/ui.tsx` (logo, shared pieces) · `src/theme.ts` (palette, fonts) · `scripts/narration.json` (narration text, source of truth).
Scene lengths come from `src/timings.json` (audio length + 0.7 s); if empty, fallback lengths in `Video.tsx` are used. Edit narration → `npm run tts` (skips existing wavs; delete a wav or `FORCE=1` to regenerate) → render.

## Env vars
`KOKORO_VOICE` (default `af_heart`), `KOKORO_SPEED` (default 1.0). Optional Gemini path only: `GEMINI_API_KEY`, `TTS_MODEL` (default `gemini-3.8-flash-tts`, fallback `gemini-3.1-flash-tts-preview`), `TTS_VOICE` (default `Kore`), `TTS_STYLE` (optional prefix; makes 3.8 speak ~2× slower). See `.env.example`. Never commit `.env`.

## Decisions
- 30 fps, ~73 s; 9 scenes; captions are always burned in (kinetic word highlight), so the video works muted.
- Vertical cut reuses the same scenes scaled to 0.68 in a 1080×1920 frame with logo on top and captions below (not a re-layout).
- Fonts bundled from `@fontsource` into `public/fonts` because Google Fonts is unreachable from the render sandbox.
- No music (avoids licensing).
- Placeholder domain `diffwise.dev` and "early access" CTA are fictional.
- (Gemini path) 3.8 TTS returns a WAV container (not raw PCM); script handles both. Default voice has no style prefix because the prefix slowed speech ~2×.
- H.264 CRF 24 keeps files ~6 MB, far under the 50 MB limit.

## Narration
- **Engine:** Kokoro-82M (Apache-2.0) via the `kokoro` Python package, run locally on CPU in a `.venv` (Python 3.12; the package does not support 3.13). Model weights download from Hugging Face on first run. No keys.
- **Voice:** `af_heart` (American English female). I rendered `af_heart`, `af_bella` and `bm_george` for the first line (~9 s each). I can't listen in this environment, so the pick is by Kokoro's published voice-quality grades (af_heart is rated highest), not by ear. Compare with `npm run tts:samples` and change `KOKORO_VOICE` if you prefer another.
- Total speech 52 s; scene lengths = speech + 0.7 s, so the video is ~60 s. No script tightening was needed.
- **Gemini TTS (optional):** `scripts/tts.mjs`, `npm run tts:gemini`. Free tier is 10 requests/day/model, so it is unreliable. It overwrites `public/audio` and `src/timings.json` in the same format.

## Blockers & workarounds
- Gemini TTS free-tier quota (10/day/model) -> replaced by local Kokoro; Gemini kept as optional.
- Google Fonts download failed in the sandbox -> bundled local fonts (see Decisions).
- Voice choice not auditioned by ear (see Narration). Please listen once and swap `KOKORO_VOICE` if needed.

## Progress
**Done:** brand + BRAND.md, script.md, 9 scenes, local Kokoro narration synced to scenes, 1080p and vertical renders, README, preview/thumbnail.
**In progress:** —
**Next:** audition the voice by ear; optional light ambient music (royalty-free, note license).
