# MF X-ray — voiceover script (~72 s)

Voice: local Kokoro-82M, voice **af_heart** (`npm run voice`). Optional alternative: Gemini TTS (`npm run voice:gemini`). Source of truth: `src/script.json` (captions are generated from it; the optional `tts` field holds phonetic spellings).

| # | Scene | Narration | On screen |
|---|---|---|---|
| 1 | Hook | You own five mutual funds. But do you know what you actually own? | Five fund cards float in, kinetic question, teal x-ray scan sweep |
| 2 | Upload | Meet MF X-ray. Just drop in your CAMS or KFintech statement. | PDF drops onto the drop-zone, transactions counter, ✓ |
| 3 | Privacy | It's read right inside your browser. Nothing is uploaded. Nothing is stored. Your data never leaves your device. | Browser box parses PDF; arrow to server blocked ✕; "0 bytes received" |
| 4 | XIRR | First, your true return. XIRR accounts for when you invested, so it's the honest number. | Dashboard: invested/current counters, XIRR 14.2%, growth line draws |
| 5 | Overlap | Then, overlap. Your five funds may secretly hold the same stocks. Now you can see it. | Heatmap of fund overlap, repeat-stock bars |
| 6 | Cost | And hidden costs. A small expense ratio can quietly eat lakhs over twenty years. We even check if you're in a regular plan, when direct would do. | Two growth curves diverge, ₹ lost counter, regular→direct flag |
| 7 | Explain | Every term is explained in plain language, and your goals are tracked, too. | XIRR tooltip, goal rings |
| 8 | Chat | Still curious? Just ask. Chat about your own portfolio, in your own words. | Typed question, streamed answer |
| 9 | CTA | MF X-ray. Know what you own. Educational, not investment advice. | Logo, tagline, button, disclaimer |

Pronunciation notes: "MF X-ray" and "XIRR" are spelled out phonetically in `script.json` ("M F X-ray", "X I R R") so TTS reads them letter by letter; captions restore the real spelling.
