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
- Gemini TTS free-tier quota (429) hit intermittently -> backoff + retry in `scripts/tts.mjs`; first pass had mixed models so it was re-run with a single model.

## Progress
**Done:** project scaffold, brand, all 9 scenes (wide+vertical compositions), script, TTS.
**In progress:** final render, vertical cut check.
**Next:** PR.
