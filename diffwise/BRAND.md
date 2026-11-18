# Diffwise — Brand

**Idea:** a calm, precise reviewer. Dark "editor" surfaces, one confident violet→mint gradient (the move from *diff* to *approved*).

## Logo mark
A gradient squircle containing three rounded bars of different lengths (a diff gutter / lines of code). A small check badge sits on the top bar's end — the "reviewed" comment marker. Drawn in SVG in `src/ui.tsx` (`<Logo />`). Wordmark: "Diffwise" in Space Grotesk Bold, tight tracking (−3%).
Clear space: ≥ ½ the mark height. Min size: 32px. On light backgrounds use the ink-colored bars on the gradient square as-is.

## Palette
| Token | Hex | Use |
|---|---|---|
| Ink | `#0A0C12` | Background, text on gradient |
| Surface | `#11141C` | Cards, windows |
| Raised | `#171B26` | Title bars, inputs |
| Line | `#262C3C` | Borders, grid |
| Text | `#EEF0F8` | Primary text |
| Muted | `#8B93A8` | Secondary text |
| Violet | `#7B5CFF` | Brand, bot, links |
| Mint | `#37F2B0` | Additions, success, approved |
| Coral | `#FF6B7F` | Critical findings, deletions |
| Amber | `#FFC857` | Warnings, queue |
| Brand gradient | `135° #7B5CFF → #37F2B0` | Logo, key words, CTA |

## Typography
- **Display:** Space Grotesk 500/700 — headlines, kinetic type, numbers.
- **Body/UI:** Inter 400/500/600.
- **Code:** JetBrains Mono 400/500.
All three are SIL OFL 1.1 (bundled from `@fontsource`, in `public/fonts/`).

## Motion
Ease-out cubic / spring (damping 12–16). Words rise from a mask; cards slide 20–50px and fade; glows pulse on activation. Scene transitions are 10-frame fade + slight slide. No bounce on UI chrome, no stock effects.

## Voice
Plain, confident, short sentences. No hype words.
