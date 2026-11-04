import React from "react";
import { useCurrentFrame } from "remotion";
import { Card, Counter, Fit, Label, Pill, SceneLayout, Window, ease } from "../ui";
import { C, FONT_BODY, FONT_HEAD } from "../theme";
import { LogoMark } from "../Logo";

export const Xirr: React.FC = () => (
  <SceneLayout kicker="Insight 1 · True returns" headline="Your real return, not a flattering one." hi={["real"]}
    visual={(w, h) => <Fit W={1000} H={720} w={w} h={h}><UI /></Fit>} />
);

const pts = [0, 6, 9, 8, 14, 18, 17, 24, 29, 27, 35, 41, 46, 44, 52, 58, 61, 66, 73, 80, 88];

const UI: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = ease(frame, 14, 80);
  const max = 90, cw = 560, ch = 230;
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${(i / (pts.length - 1)) * cw},${ch - (p / max) * ch}`).join(" ");
  const badge = ease(frame, 90, 104);
  return (
    <Window width={1000} height={720}>
      <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}><LogoMark size={40} /><div><div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 26, color: C.ink }}>Aarav's portfolio</div><Label size={17}>Sample data · updated today</Label></div></div>
          <Pill bg={`${C.green}22`} color={C.green}>● Parsed on this device</Pill>
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          <Card style={{ flex: 1 }}><Label>Invested</Label><Counter to={840000} start={8} dur={50} size={40} prefix="₹" indian /></Card>
          <Card style={{ flex: 1 }}><Label>Current value</Label><Counter to={1192600} start={12} dur={55} size={40} prefix="₹" indian /></Card>
          <Card style={{ flex: 1, background: C.ink, border: "none" }}>
            <Label color="#9FB0DA">True return (XIRR)</Label>
            <Counter to={14.2} decimals={1} start={30} dur={55} size={46} suffix="% p.a." color={C.teal} />
          </Card>
        </div>
        <Card style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><Label color={C.ink} weight={700}>Portfolio growth</Label><div style={{ display: "flex", gap: 14 }}><Pill bg={`${C.teal}22`} color={C.tealDark} size={16}>— Value</Pill><Pill bg={C.line} color={C.muted} size={16}>— Invested</Pill></div></div>
          <svg width={cw + 20} height={ch + 20} style={{ marginTop: 10, overflow: "visible" }}>
            <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={C.teal} stopOpacity=".35" /><stop offset="1" stopColor={C.teal} stopOpacity="0" /></linearGradient></defs>
            {[0, 1, 2, 3].map((i) => <line key={i} x1={0} x2={cw} y1={(i / 3) * ch} y2={(i / 3) * ch} stroke={C.line} />)}
            <path d={`M0,${ch * 0.72} L${cw},${ch * 0.28}`} stroke="#B7C4DD" strokeWidth={3} strokeDasharray="8 8" fill="none" />
            <clipPath id="c"><rect x="0" y="-10" width={cw * draw} height={ch + 20} /></clipPath>
            <g clipPath="url(#c)"><path d={`${path} L${cw},${ch} L0,${ch} Z`} fill="url(#g)" /><path d={path} stroke={C.teal} strokeWidth={5} fill="none" strokeLinejoin="round" /></g>
            <circle cx={cw * draw} cy={ch - (pts[Math.min(pts.length - 1, Math.round(draw * (pts.length - 1)))] / max) * ch} r={9} fill={C.teal} stroke="#fff" strokeWidth={4} />
          </svg>
          <div style={{ position: "absolute", right: 28, top: 70, width: 280, opacity: badge, transform: `translateY(${(1 - badge) * 20}px)`, background: "#fff", borderRadius: 18, boxShadow: "0 16px 40px rgba(14,26,59,.18)", padding: 20, fontFamily: FONT_BODY }}>
            <div style={{ fontSize: 17, color: C.muted }}>Simple gain looks like</div>
            <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 34, color: C.muted, textDecoration: "line-through" }}>+42%</div>
            <div style={{ fontSize: 17, color: C.muted, marginTop: 6 }}>But timing-adjusted it's</div>
            <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 38, color: C.tealDark }}>14.2% a year</div>
          </div>
        </Card>
      </div>
    </Window>
  );
};
