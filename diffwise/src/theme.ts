import {loadFont as loadDisplay} from "@remotion/google-fonts/SpaceGrotesk";
import {loadFont as loadBody} from "@remotion/google-fonts/Inter";
import {loadFont as loadMono} from "@remotion/google-fonts/JetBrainsMono";
import {interpolate, Easing} from "remotion";

const d = loadDisplay("normal", {weights: ["500", "700"], subsets: ["latin"]});
const b = loadBody("normal", {weights: ["400", "500", "600"], subsets: ["latin"]});
const m = loadMono("normal", {weights: ["400", "500"], subsets: ["latin"]});

export const C = {
  ink: "#0A0C12", surface: "#11141C", raised: "#171B26", line: "#262C3C",
  text: "#EEF0F8", muted: "#8B93A8",
  violet: "#7B5CFF", violetSoft: "#A58BFF", mint: "#37F2B0", coral: "#FF6B7F", amber: "#FFC857",
  ghLight: "#0D1017",
};
export const F = {display: d.fontFamily, body: b.fontFamily, mono: m.fontFamily};

export const ease = (f: number, start: number, dur: number, from = 0, to = 1) =>
  interpolate(f, [start, start + dur], [from, to], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic),
  });
export const gradient = `linear-gradient(135deg, ${C.violet} 0%, ${C.mint} 100%)`;
