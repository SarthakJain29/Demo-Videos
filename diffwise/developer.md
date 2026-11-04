# Developer notes

## Preview / edit / render
```bash
cd diffwise && npm install
npm run dev               # Remotion Studio
npm run render            # 1080p  → out/diffwise-1080p.mp4
npm run render:vertical   # 1080x1920 → out/diffwise-vertical.mp4
npm run tts               # generate narration (needs GEMINI_API_KEY), writes public/audio/*.wav + src/timings.json
```
Layout: `src/Video.tsx` (timeline, captions, audio, vertical wrapper) · `src/scenes1.tsx` / `scenes2.tsx` (the 9 scenes) · `src/ui.tsx` (logo, shared pieces) · `src/theme.ts` (palette, fonts) · `scripts/narration.json` (narration text, source of truth).
Scene lengths come from `src/timings.json` (audio length + 0.7 s); if empty, fallback lengths in `Video.tsx` are used. Edit narration → `npm run tts` (skips existing wavs; delete a wav or `FORCE=1` to regenerate) → render.

## Env vars
`GEMINI_API_KEY` (required for TTS), `TTS_MODEL` (default `gemini-3.8-flash-tts`, fallback `gemini-3.1-flash-tts-preview`), `TTS_VOICE` (default `Kore`), `TTS_STYLE` (optional prefix; makes 3.8 speak ~2× slower). See `.env.example`. Never commit `.env`.

## Decisions
- 30 fps, ~73 s; 9 scenes; captions are always burned in (kinetic word highlight), so the video works muted.
- Vertical cut reuses the same scenes scaled to 0.68 in a 1080×1920 frame with logo on top and captions below (not a re-layout).
- Fonts bundled from `@fontsource` into `public/fonts` because Google Fonts is unreachable from the render sandbox.
- No music (avoids licensing); silence between narration beats is intentional.
- Placeholder domain `diffwise.dev` and "early access" CTA are fictional.
- Gemini 3.8 TTS returns a WAV container (not raw PCM); script handles both. Default voice has no style prefix because the prefix slowed speech ~2×.
- H.264 CRF 24 keeps files ~6 MB, far under the 50 MB limit.

## Blockers & workarounds
- **Gemini TTS quota:** the key works (models listed: `gemini-2.5-flash-preview-tts`, `gemini-3.1-flash-tts-preview`, `gemini-3.8-flash-tts`, …) but the free tier allows only **10 requests/day per model**; I burned them while debugging a style-prompt/WAV-format issue. All narration wavs were lost to that, so the committed MP4s are **captions-only**. **To do:** after the quota resets, run `npm run tts` (≈9 requests, resumable), then `npm run render` and `npm run render:vertical`, and commit. Scene timing will adapt automatically (video may land ~1.5–2 min if speech is slower than expected — check `src/timings.json`; trim the narration text if over 75 s).
- Google Fonts download failed in the sandbox → bundled local fonts (see Decisions).

## Progress
**Done:** brand + BRAND.md, script.md, 9 scenes, 1080p render, vertical render, README, TTS pipeline code.
**In progress:** —
**Next:** generate narration once quota resets; re-render both cuts; optional light ambient music (royalty-free, note license).
