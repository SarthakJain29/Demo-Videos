# Developer notes

## Preview / edit / render
```bash
cd mf-xray && npm install
npm run studio            # live preview (Remotion Studio)
npm run voice             # (optional) regenerate narration; needs GEMINI_API_KEY
npm run render            # -> out/mf-xray-demo-1920x1080.mp4
npm run render:vertical   # -> out/mf-xray-demo-1080x1920.mp4
```
- Narration text + minimum scene lengths: `src/script.json`. `npm run voice` writes `public/vo/*.wav` and `src/audio.json` (measured durations); scene lengths = max(min, narration + 0.9 s), so the video re-times itself.
- Scenes: `src/scenes/*.tsx`; shared UI/kinetic text/fit-scaler: `src/ui.tsx`; tokens: `src/theme.ts`; logo: `src/Logo.tsx`.
- Both compositions (wide + vertical) share the same scene components; `useLayout()` switches layout.

## Env vars
See `.env.example`: `GEMINI_API_KEY` (only for `npm run voice`), optional `GEMINI_TTS_MODEL`, `GEMINI_TTS_VOICE`. `.env` is git-ignored.

## Decisions
- Fake persona "Aarav" and fictional fund names/numbers; never real AMC/fund names.
- Video name stays "MF X-ray"; alternative name proposed in BRAND.md.
- Fonts self-hosted (Plus Jakarta Sans, Inter; OFL) because headless Chromium here can't fetch Google Fonts through the sandbox proxy.
- TTS: `gemini-2.5-flash-preview-tts`, voice Kore, one model for the whole film for voice consistency (retry with backoff on 429 quota errors).
- No background music (avoids licensing); narration + burned-in captions only.
- Mock UI is drawn at a fixed 1000x720 design size and scaled to fit, so wide and vertical share code.
- Expense-drag numbers are computed live: ₹5L lump sum, 12% gross, 1.8% vs 0.6% expense ratio over 20 years.
- Rendered with CRF 26 to keep files well under 50 MB.

## Blockers & workarounds
- Google Fonts blocked in headless Chromium (TLS via proxy) -> self-hosted fonts.
- Gemini TTS free tier allows only 10 requests/day per model. The quota ran out mid-way, so the committed narration mixes `gemini-2.5-flash-preview-tts` (hook/upload/privacy/xirr/cost/cta) and `gemini-3.1-flash-tts-preview` (overlap/explain/chat) with the same voice (Kore). Fix: after the daily quota resets, run `npm run voice` (single model) and `node scripts/measure.mjs`, then re-render.
- `gemini-3.8-flash-lite-tts` read the style prefix aloud, so the prefix is now empty by default.

## Progress
**Done:** scaffold, brand, 9 scenes (wide + vertical), script, Gemini narration, wide MP4 render, README.
**Known:** narration mixes two Gemini TTS models (free daily quota hit); same voice name, slight prosody difference. Regenerate with `npm run voice` when quota resets for a uniform take.
**In progress:** vertical render + PR.
**Next:** PR.
