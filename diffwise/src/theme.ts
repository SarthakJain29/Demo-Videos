import {interpolate, Easing, staticFile, delayRender, continueRender} from "remotion";

// Fonts are bundled locally (OFL, via @fontsource) so renders work offline.
const faces: [string, string, string][] = [
  ["Space Grotesk", "500", "space-grotesk-latin-500-normal"], ["Space Grotesk", "700", "space-grotesk-latin-700-normal"],
  ["Inter", "400", "inter-latin-400-normal"], ["Inter", "500", "inter-latin-500-normal"], ["Inter", "600", "inter-latin-600-normal"],
  ["JetBrains Mono", "400", "jetbrains-mono-latin-400-normal"], ["JetBrains Mono", "500", "jetbrains-mono-latin-500-normal"],
];
if (typeof document !== "undefined") {
  const h = delayRender("fonts");
  Promise.all(faces.map(([fam, w, file]) => {
    const ff = new FontFace(fam, `url(${staticFile(`fonts/${file}.woff2`)})`, {weight: w});
    return ff.load().then(() => document.fonts.add(ff));
  })).then(() => continueRender(h)).catch(() => continueRender(h));
}

export const C = {
  ink: "#0A0C12", surface: "#11141C", raised: "#171B26", line: "#262C3C",
  text: "#EEF0F8", muted: "#8B93A8",
  violet: "#7B5CFF", violetSoft: "#A58BFF", mint: "#37F2B0", coral: "#FF6B7F", amber: "#FFC857",
  ghLight: "#0D1017",
};
export const F = {display: "Space Grotesk, sans-serif", body: "Inter, sans-serif", mono: "JetBrains Mono, monospace"};

export const ease = (f: number, start: number, dur: number, from = 0, to = 1) =>
  interpolate(f, [start, start + dur], [from, to], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
export const gradient = `linear-gradient(135deg, ${C.violet} 0%, ${C.mint} 100%)`;
