import React from "react";
import { useCurrentFrame } from "remotion";
import { Card, Fit, Label, Pill, SceneLayout, Window, ease } from "../ui";
import { C, FONT_BODY, FONT_HEAD } from "../theme";

export const Explain: React.FC = () => (
  <SceneLayout kicker="Made for beginners" headline="Every term, explained like a friend would." hi={["explained"]}
    sub="Tap any word. Track goals. No jargon."
    visual={(w, h) => <Fit W={1000} H={720} w={w} h={h}><UI /></Fit>} />
);

const Ring: React.FC<{ pct: number; label: string; amt: string; color: string; t: number }> = ({ pct, label, amt, color, t }) => {
  const r = 52, c = 2 * Math.PI * r;
  return (
    <Card style={{ flex: 1, display: "flex", alignItems: "center", gap: 18, padding: 20 }}>
      <svg width={120} height={120}><circle cx={60} cy={60} r={r} stroke={C.line} strokeWidth={13} fill="none" />
        <circle cx={60} cy={60} r={r} stroke={color} strokeWidth={13} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - (pct / 100) * t)} transform="rotate(-90 60 60)" />
        <text x={60} y={68} textAnchor="middle" fontFamily={FONT_HEAD} fontWeight={800} fontSize={28} fill={C.ink}>{Math.round(pct * t)}%</text></svg>
      <div style={{ fontFamily: FONT_BODY }}><div style={{ fontWeight: 700, fontSize: 22, color: C.ink }}>{label}</div><div style={{ color: C.muted, fontSize: 18 }}>{amt}</div></div>
    </Card>
  );
};

const UI: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = ease(frame, 24, 38);
  const g = ease(frame, 50, 100);
  return (
    <Window width={1000} height={720}>
      <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
        <Card style={{ padding: 30, position: "relative", height: 300 }}>
          <Label size={20}>Your portfolio at a glance</Label>
          <div style={{ fontFamily: FONT_BODY, fontSize: 30, color: C.ink, marginTop: 14, lineHeight: 1.6 }}>
            Your <span style={{ background: `${C.saffron}55`, borderRadius: 8, padding: "2px 10px", fontWeight: 700 }}>XIRR ⓘ</span> is <b style={{ color: C.tealDark }}>14.2%</b>, and your <span style={{ borderBottom: `3px dotted ${C.teal}`, fontWeight: 600 }}>expense ratio</span> averages 0.9%.
          </div>
          <div style={{ position: "absolute", left: 120, top: 150, width: 560, background: C.ink, color: "#fff", borderRadius: 20, padding: "20px 24px", fontFamily: FONT_BODY, boxShadow: "0 20px 50px rgba(14,26,59,.35)", opacity: pop, transform: `translateY(${(1 - pop) * 24}px) scale(${0.95 + 0.05 * pop})` }}>
            <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, color: C.saffron, fontSize: 22 }}>XIRR in plain words</div>
            <div style={{ fontSize: 22, lineHeight: 1.4, marginTop: 6 }}>Your yearly return, adjusted for <i>when</i> each rupee went in. Like a speedometer for your money.</div>
          </div>
        </Card>
        <Label color={C.ink} weight={700} size={24}>Goals</Label>
        <div style={{ display: "flex", gap: 18 }}>
          <Ring pct={62} label="Dream home" amt="₹14.9L of ₹24L" color={C.teal} t={g} />
          <Ring pct={38} label="Retirement" amt="₹38L of ₹1Cr" color={C.saffron} t={g} />
        </div>
        <div style={{ display: "flex", gap: 12, opacity: ease(frame, 100, 114) }}>{["Educational", "Not investment advice", "Sample data"].map((t) => <Pill key={t} bg={C.line} color={C.muted} size={17}>{t}</Pill>)}</div>
      </div>
    </Window>
  );
};
