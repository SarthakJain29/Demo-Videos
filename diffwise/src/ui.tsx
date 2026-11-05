import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from "remotion";
import {C, F, ease, gradient} from "./theme";

export const Logo: React.FC<{size?: number; draw?: number}> = ({size = 120, draw = 1}) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={C.violet} /><stop offset="1" stopColor={C.mint} />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="112" height="112" rx="30" fill="url(#lg)" opacity={draw} />
    <g fill="#0A0C12" opacity={draw}>
      <rect x="28" y="30" width="34" height="11" rx="5.5" />
      <rect x="28" y="54.5" width="64" height="11" rx="5.5" />
      <rect x="28" y="79" width="44" height="11" rx="5.5" />
    </g>
    <circle cx="88" cy="35.5" r={9 * draw} fill="#0A0C12" />
    <path d="M83.5 35.5l3.2 3.3 6-6.6" stroke="#37F2B0" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const drift = Math.sin(f / 140) * 60;
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <div style={{position: "absolute", width: 1100, height: 1100, left: 100 + drift, top: -500, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.violet}33 0%, transparent 65%)`}} />
      <div style={{position: "absolute", width: 900, height: 900, right: -100 - drift, bottom: -450, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.mint}22 0%, transparent 65%)`}} />
      <div style={{position: "absolute", inset: 0, opacity: 0.5,
        backgroundImage: `linear-gradient(${C.line}55 1px, transparent 1px), linear-gradient(90deg, ${C.line}55 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)"}} />
    </AbsoluteFill>
  );
};

/** Fade/slide wrapper used by every scene. */
export const SceneFrame: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const o = Math.min(ease(f, 0, 10), 1 - ease(f, d - 10, 10));
  const y = ease(f, 0, 14, 14, 0) + ease(f, d - 10, 10, 0, -10);
  return <AbsoluteFill style={{opacity: o, transform: `translateY(${y}px)`}}>{children}</AbsoluteFill>;
};

export const Word: React.FC<{children: string; at: number; size?: number; color?: string; grad?: boolean; weight?: number}> = ({children, at, size = 140, color = C.text, grad, weight = 700}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 16, stiffness: 120}});
  return (
    <span style={{display: "inline-block", overflow: "hidden", verticalAlign: "bottom", paddingBottom: size * 0.12, marginRight: size * 0.22}}>
      <span style={{display: "inline-block", transform: `translateY(${(1 - s) * 110}%)`, opacity: Math.min(1, s * 2),
        fontFamily: F.display, fontWeight: weight, fontSize: size, letterSpacing: -size * 0.03, lineHeight: 1.05,
        color: grad ? "transparent" : color, background: grad ? gradient : undefined, WebkitBackgroundClip: grad ? "text" : undefined}}>
        {children}
      </span>
    </span>
  );
};

export const Pill: React.FC<{children: React.ReactNode; color: string; style?: React.CSSProperties}> = ({children, color, style}) => (
  <span style={{fontFamily: F.body, fontWeight: 600, fontSize: 18, color, background: color + "1F", border: `1px solid ${color}55`,
    padding: "4px 12px", borderRadius: 999, whiteSpace: "nowrap", ...style}}>{children}</span>
);

export const Window: React.FC<{title: string; width: number; height?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({title, width, height, children, style}) => (
  <div style={{width, height, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 20, overflow: "hidden",
    boxShadow: "0 40px 120px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.02)", ...style}}>
    <div style={{height: 52, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", borderBottom: `1px solid ${C.line}`, background: C.raised}}>
      {["#FF6B7F", "#FFC857", "#37F2B0"].map((c) => <span key={c} style={{width: 12, height: 12, borderRadius: 6, background: c, opacity: .8}} />)}
      <span style={{marginLeft: 16, fontFamily: F.mono, fontSize: 17, color: C.muted}}>{title}</span>
    </div>
    {children}
  </div>
);

export const Caption: React.FC<{text: string; dur: number; start?: number; vertical?: boolean}> = ({text, dur, start = 4, vertical}) => {
  const f = useCurrentFrame();
  const words = text.split(" ");
  const span = Math.max(dur - start - 10, 30);
  const idx = Math.floor(((f - start) / span) * words.length);
  // show a rolling window of ~7 words
  const lo = Math.max(0, Math.floor(idx / 7) * 7);
  const chunk = words.slice(lo, lo + 7);
  return (
    <div style={{display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0 14px", maxWidth: vertical ? 940 : 1400, textAlign: "center"}}>
      {chunk.map((w, i) => {
        const on = lo + i <= idx;
        const cur = lo + i === idx;
        return <span key={lo + i} style={{fontFamily: F.display, fontWeight: 500, fontSize: vertical ? 54 : 44,
          color: cur ? C.text : on ? "#C9CEDD" : "#4B5265", transition: "none",
          transform: `translateY(${cur ? -3 : 0}px)`, textShadow: "0 2px 20px rgba(0,0,0,.6)"}}>{w}</span>;
      })}
    </div>
  );
};

export const Cursor: React.FC<{x: number; y: number; click?: number}> = ({x, y, click = 0}) => (
  <svg width="34" height="34" viewBox="0 0 24 24" style={{position: "absolute", left: x, top: y, transform: `scale(${1 - click * 0.15})`, filter: "drop-shadow(0 4px 8px rgba(0,0,0,.5))", zIndex: 50}}>
    <path d="M3 2l7 19 2.8-7.6L21 10.6z" fill="#fff" stroke="#000" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

export const BotAvatar: React.FC<{size?: number}> = ({size = 40}) => (
  <div style={{width: size, height: size, borderRadius: size * 0.3, background: gradient, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0}}>
    <Logo size={size * 0.85} draw={0} />
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 120 120" style={{position: "absolute"}}>
      <g fill="#0A0C12"><rect x="12" y="22" width="50" height="14" rx="7" /><rect x="12" y="53" width="96" height="14" rx="7" /><rect x="12" y="84" width="66" height="14" rx="7" /></g>
    </svg>
  </div>
);
export {interpolate};
