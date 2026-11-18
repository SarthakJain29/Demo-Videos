import React from "react";
import { useCurrentFrame } from "remotion";
import { Card, FUNDS, Fit, Label, Pill, SceneLayout, Window, ease } from "../ui";
import { C, FONT_BODY, FONT_HEAD } from "../theme";

export const Cost: React.FC = () => (
  <SceneLayout kicker="Insight 3 · Hidden costs" headline="Tiny fees. Lakhs lost." hi={["Lakhs", "lost."]} hiColor={C.coral}
    sub="Expense-ratio drag, in rupees, plus a direct vs regular plan check."
    visual={(w, h) => <Fit W={1000} H={720} w={w} h={h}><UI /></Fit>} />
);

const P = 500000, GROSS = 0.12, REG = 0.018, DIR = 0.006;
const fv = (er: number, y: number) => P * Math.pow(1 + GROSS - er, y);

const UI: React.FC = () => {
  const frame = useCurrentFrame();
  const year = ease(frame, 12, 100) * 20;
  const cw = 500, ch = 190;
  const line = (er: number) => Array.from({ length: 41 }, (_, i) => {
    const y = (i / 40) * 20;
    return `${i ? "L" : "M"}${(y / 20) * cw},${ch - (fv(er, y) / fv(DIR, 20)) * (ch - 10)}`;
  }).join(" ");
  const yy = Math.min(20, year);
  const lost = fv(DIR, yy) - fv(REG, yy);
  const t2 = ease(frame, 110, 125);
  return (
    <Window width={1000} height={720}>
      <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 20 }}>
          <Card style={{ flex: 1.2, background: "#FFF3F3", border: `1px solid ${C.coral}55` }}>
            <Label color={C.coral} weight={700}>Lost to expenses in {Math.round(yy)} yrs (on ₹5L)</Label>
            <span style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 64, color: C.coral, fontVariantNumeric: "tabular-nums" }}>₹{(lost / 100000).toFixed(1)} lakh</span>
          </Card>
          <Card style={{ flex: 1 }}><Label>Year</Label><span style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 64, color: C.ink, fontVariantNumeric: "tabular-nums" }}>{Math.round(yy)}</span><Label size={16}>of 20</Label></Card>
        </div>
        <Card>
          <svg width={cw + 280} height={ch + 30} style={{ overflow: "visible" }}>
            {[0, 1, 2, 3].map((i) => <line key={i} x1={0} x2={cw} y1={(i / 3) * ch} y2={(i / 3) * ch} stroke={C.line} />)}
            <clipPath id="cc"><rect x="0" y="-20" width={(yy / 20) * cw} height={ch + 60} /></clipPath>
            <g clipPath="url(#cc)">
              <path d={line(DIR)} stroke={C.teal} strokeWidth={6} fill="none" />
              <path d={line(REG)} stroke={C.coral} strokeWidth={6} fill="none" />
            </g>
            <text x={cw + 16} y={20} fill={C.tealDark} fontFamily={FONT_BODY} fontWeight={700} fontSize={22}>Direct 0.6%</text>
            <text x={cw + 16} y={ch - ((fv(REG, 20) / fv(DIR, 20)) * (ch - 10)) + 8} fill={C.coral} fontFamily={FONT_BODY} fontWeight={700} fontSize={22}>Regular 1.8%</text>
          </svg>
        </Card>
        <Card style={{ display: "flex", alignItems: "center", gap: 18, opacity: t2, transform: `translateY(${(1 - t2) * 30}px)`, border: `2px solid ${C.saffron}` }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: FUNDS[2].color, color: "#fff", fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 20, display: "grid", placeItems: "center" }}>LM</div>
          <div style={{ flex: 1, fontFamily: FONT_BODY }}><div style={{ fontWeight: 700, fontSize: 22, color: C.ink }}>Large & Mid Cap Fund is a Regular plan</div><div style={{ fontSize: 18, color: C.muted }}>Same fund, Direct plan: 1.72% → 0.64% expense ratio</div></div>
          <Pill bg={`${C.saffron}33`} color="#8A5A00" size={18}>Check direct</Pill>
        </Card>
      </div>
    </Window>
  );
};
