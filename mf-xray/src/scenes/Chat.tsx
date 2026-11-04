import React from "react";
import { useCurrentFrame } from "remotion";
import { Fit, Pill, SceneLayout, Window, ease } from "../ui";
import { C, FONT_BODY, FONT_HEAD } from "../theme";
import { LogoMark } from "../Logo";

export const Chat: React.FC = () => (
  <SceneLayout kicker="Ask anything" headline="Chat with your own portfolio." hi={["your", "own"]}
    visual={(w, h) => <Fit W={1000} H={720} w={w} h={h}><UI /></Fit>} />
);

const Q = "Which of my funds overlap the most?";
const A = "Bluechip Growth and Nifty 50 Index share about 68% of their holdings, mainly HDFC Bank, Reliance and ICICI Bank. Holding both adds little extra diversification.";

const UI: React.FC = () => {
  const frame = useCurrentFrame();
  const q = Q.slice(0, Math.floor(ease(frame, 12, 50) * Q.length));
  const think = frame > 56 && frame < 80;
  const a = A.slice(0, Math.floor(ease(frame, 80, 170) * A.length));
  return (
    <Window width={1000} height={720}>
      <div style={{ padding: 36, height: "100%", display: "flex", flexDirection: "column", gap: 22, fontFamily: FONT_BODY, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><LogoMark size={36} /><span style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 24, color: C.ink }}>Ask X-ray</span><Pill bg={`${C.green}22`} color={C.green} size={15}>runs on your data only</Pill></div>
        {q && <div style={{ alignSelf: "flex-end", maxWidth: 600, background: C.ink, color: "#fff", borderRadius: "24px 24px 6px 24px", padding: "18px 26px", fontSize: 28 }}>{q}</div>}
        {think && <div style={{ background: "#fff", borderRadius: 24, padding: "18px 26px", alignSelf: "flex-start", display: "flex", gap: 8 }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: C.teal, opacity: 0.4 + 0.6 * Math.abs(Math.sin((frame + i * 5) / 6)) }} />)}</div>}
        {frame >= 80 && <div style={{ alignSelf: "flex-start", maxWidth: 740, background: "#fff", border: `1px solid ${C.line}`, borderRadius: "24px 24px 24px 6px", padding: "22px 28px", fontSize: 26, lineHeight: 1.45, color: C.ink, boxShadow: "0 6px 20px rgba(14,26,59,.06)" }}>{a}</div>}
        <div style={{ marginTop: "auto", display: "flex", gap: 12, flexWrap: "wrap", opacity: ease(frame, 150, 165) }}>
          {["Am I paying too much?", "Am I on track for my goal?"].map((s) => <Pill key={s} bg={`${C.teal}18`} color={C.tealDark} size={20}>{s}</Pill>)}
        </div>
        <div style={{ fontSize: 16, color: C.muted }}>Educational information, not investment advice.</div>
      </div>
    </Window>
  );
};
