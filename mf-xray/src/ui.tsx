import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, FONT_BODY, FONT_HEAD } from "./theme";

export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  return { vertical, width, height };
};

export const useSpring = (delay = 0, damping = 18) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness: 120 } });
};

export const ease = (frame: number, from: number, to: number, a = 0, b = 1) =>
  interpolate(frame, [from, to], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

/** Kinetic headline: words spring up one by one. `hi` words get the accent colour. */
export const KineticText: React.FC<{ text: string; size: number; delay?: number; color?: string; hi?: string[]; hiColor?: string; align?: "left" | "center"; stagger?: number }> = ({
  text, size, delay = 0, color = C.ink, hi = [], hiColor = C.teal, align = "left", stagger = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: size, lineHeight: 1.08, letterSpacing: -size * 0.025, color, display: "flex", flexWrap: "wrap", gap: `0 ${size * 0.26}px`, justifyContent: align === "center" ? "center" : "flex-start", textAlign: align }}>
      {words.map((w, i) => {
        const s = spring({ frame: frame - delay - i * stagger, fps, config: { damping: 14, stiffness: 140 } });
        const clean = w.replace(/[.,?!]/g, "");
        return (
          <span key={i} style={{ display: "inline-block", opacity: s, transform: `translateY(${(1 - s) * size * 0.5}px) scale(${0.9 + 0.1 * s})`, color: hi.includes(clean) ? hiColor : color }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** App window chrome used by every mock scene. */
export const Window: React.FC<{ children: React.ReactNode; width: number; height: number; title?: string; style?: React.CSSProperties }> = ({ children, width, height, title = "mfxray.app", style }) => (
  <div style={{ width, height, borderRadius: 28, background: C.paper, boxShadow: "0 40px 100px rgba(14,26,59,.28), 0 0 0 1px rgba(14,26,59,.08)", overflow: "hidden", display: "flex", flexDirection: "column", fontFamily: FONT_BODY, ...style }}>
    <div style={{ height: 54, background: "#fff", borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", padding: "0 22px", gap: 10, flexShrink: 0 }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />)}
      <div style={{ marginLeft: 20, padding: "6px 18px", borderRadius: 14, background: C.paper, color: C.muted, fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: C.green }}>🔒</span>{title}
      </div>
    </div>
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>{children}</div>
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: C.card, borderRadius: 22, border: `1px solid ${C.line}`, boxShadow: "0 6px 20px rgba(14,26,59,.06)", padding: 24, ...style }}>{children}</div>
);

export const Counter: React.FC<{ to: number; from?: number; start: number; dur?: number; decimals?: number; prefix?: string; suffix?: string; size: number; color?: string; indian?: boolean }> = ({
  to, from = 0, start, dur = 40, decimals = 0, prefix = "", suffix = "", size, color = C.ink, indian = false,
}) => {
  const frame = useCurrentFrame();
  const v = from + (to - from) * ease(frame, start, start + dur);
  const txt = indian ? Math.round(v).toLocaleString("en-IN") : v.toFixed(decimals);
  return <span style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: size, color, fontVariantNumeric: "tabular-nums", letterSpacing: -size * 0.02 }}>{prefix}{txt}{suffix}</span>;
};

export const Label: React.FC<{ children: React.ReactNode; size?: number; color?: string; weight?: number }> = ({ children, size = 20, color = C.muted, weight = 500 }) => (
  <div style={{ fontFamily: FONT_BODY, fontSize: size, color, fontWeight: weight }}>{children}</div>
);

export const Pill: React.FC<{ children: React.ReactNode; bg: string; color: string; size?: number }> = ({ children, bg, color, size = 18 }) => (
  <span style={{ background: bg, color, borderRadius: 99, padding: `${size * 0.3}px ${size * 0.7}px`, fontSize: size, fontWeight: 600, fontFamily: FONT_BODY, whiteSpace: "nowrap" }}>{children}</span>
);

/** Soft background used behind every scene. */
export const Backdrop: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const drift = Math.sin(frame / 60) * 30;
  return (
    <div style={{ position: "absolute", inset: 0, background: dark ? `linear-gradient(160deg, ${C.ink}, ${C.ink2})` : `linear-gradient(160deg, #EAF1FC, #F8FBFF)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: width * 0.55 + drift, top: -height * 0.15, width: width * 0.5, height: width * 0.5, borderRadius: "50%", background: `radial-gradient(${C.teal}${dark ? "55" : "30"}, transparent 65%)` }} />
      <div style={{ position: "absolute", left: -width * 0.1, top: height * 0.55 - drift, width: width * 0.45, height: width * 0.45, borderRadius: "50%", background: `radial-gradient(${C.saffron}${dark ? "33" : "22"}, transparent 65%)` }} />
    </div>
  );
};

/** Side-by-side (wide) or stacked (vertical) scene layout with a headline + visual. */
export const SceneLayout: React.FC<{ kicker?: string; headline: string; hi?: string[]; hiColor?: string; sub?: string; visual: (w: number, h: number) => React.ReactNode }> = ({ kicker, headline, hi, hiColor, sub, visual }) => {
  const { vertical, width, height } = useLayout();
  const frame = useCurrentFrame();
  const pad = vertical ? 70 : 110;
  const textW = vertical ? width - pad * 2 : 700;
  const vw = vertical ? width - pad * 2 : width - pad * 2 - textW - 70;
  const vh = vertical ? height - 960 : height - 330;
  return (
    <>
    <Backdrop />
    <div style={{ position: "absolute", inset: 0, padding: pad, paddingBottom: vertical ? 200 : 150, display: "flex", flexDirection: vertical ? "column" : "row", alignItems: vertical ? "stretch" : "center", gap: vertical ? 50 : 70 }}>
      <div style={{ width: textW, flexShrink: 0, display: "flex", flexDirection: "column", gap: 22, paddingTop: vertical ? 40 : 0 }}>
        {kicker && <div style={{ opacity: ease(frame, 0, 10), fontFamily: FONT_BODY, fontWeight: 700, letterSpacing: 4, fontSize: vertical ? 26 : 22, color: C.tealDark, textTransform: "uppercase" }}>{kicker}</div>}
        <KineticText text={headline} size={vertical ? 92 : 76} hi={hi} hiColor={hiColor} delay={4} />
        {sub && <div style={{ opacity: ease(frame, 24, 40), fontFamily: FONT_BODY, fontSize: vertical ? 34 : 28, color: C.muted, lineHeight: 1.4 }}>{sub}</div>}
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0, transform: `translateY(${(1 - ease(frame, 8, 30)) * 60}px)`, opacity: ease(frame, 8, 26) }}>
        {visual(vw, vh)}
      </div>
    </div>
    </>
  );
};

/** Renders a fixed-size design and scales it to fit the available box. */
export const Fit: React.FC<{ W: number; H: number; w: number; h: number; children: React.ReactNode }> = ({ W, H, w, h, children }) => {
  const s = Math.min(w / W, h / H);
  return (
    <div style={{ width: W * s, height: H * s }}>
      <div style={{ width: W, height: H, transform: `scale(${s})`, transformOrigin: "0 0" }}>{children}</div>
    </div>
  );
};

export const FUNDS = [
  { short: "BG", name: "Bluechip Growth Fund", color: "#12B5A6", plan: "Direct", er: 0.55, value: 312400 },
  { short: "N5", name: "Nifty 50 Index Fund", color: "#4F6BED", plan: "Direct", er: 0.2, value: 248900 },
  { short: "LM", name: "Large & Mid Cap Fund", color: "#F5A524", plan: "Regular", er: 1.72, value: 226300 },
  { short: "FC", name: "Flexi Cap Opportunities", color: "#EF5B5B", plan: "Regular", er: 1.65, value: 241800 },
  { short: "TS", name: "Tax Saver ELSS", color: "#9B6BF2", plan: "Direct", er: 0.78, value: 163200 },
];
