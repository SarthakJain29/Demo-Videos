import { continueRender, delayRender, staticFile } from "remotion";

// Fonts are self-hosted (public/fonts, SIL OFL) so renders work offline.
const files: [string, string, string][] = [
  ["Plus Jakarta Sans", "PlusJakartaSans-500.woff2", "500"], ["Plus Jakarta Sans", "PlusJakartaSans-700.woff2", "700"], ["Plus Jakarta Sans", "PlusJakartaSans-800.woff2", "800"],
  ["Inter", "Inter-400.woff2", "400"], ["Inter", "Inter-500.woff2", "500"], ["Inter", "Inter-600.woff2", "600"],
];
const handle = delayRender("fonts");
Promise.all(files.map(async ([fam, f, w]) => {
  const ff = new FontFace(fam, `url(${staticFile("fonts/" + f)})`, { weight: w });
  await ff.load();
  document.fonts.add(ff);
})).catch((e) => console.warn("font load failed", e)).finally(() => continueRender(handle));

export const FONT_HEAD = `"Plus Jakarta Sans", system-ui, sans-serif`;
export const FONT_BODY = `Inter, system-ui, sans-serif`;

export const C = {
  ink: "#0E1A3B",      // deep indigo ink: trust
  ink2: "#1E2D5C",
  teal: "#12B5A6",     // clarity / "x-ray" glow
  tealDark: "#0B8C80",
  saffron: "#F5A524",  // warmth, India nod, highlights
  coral: "#EF5B5B",    // costs / warnings
  green: "#1FA463",
  paper: "#F5F8FD",
  card: "#FFFFFF",
  line: "#E3E9F4",
  muted: "#6B7794",
};
export const FPS = 30;
