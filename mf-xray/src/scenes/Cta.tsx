import React from "react";
import { useCurrentFrame } from "remotion";
import { Backdrop, KineticText, Pill, ease, useLayout } from "../ui";
import { C, FONT_BODY, FONT_HEAD } from "../theme";
import { LogoMark } from "../Logo";

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { vertical } = useLayout();
  const logo = ease(frame, 0, 20);
  return (
    <>
      <Backdrop dark />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: vertical ? 56 : 40, padding: 70 }}>
        <div style={{ transform: `scale(${0.6 + 0.4 * logo}) rotate(${(1 - logo) * -20}deg)`, opacity: logo }}><LogoMark size={vertical ? 220 : 170} scan={0.5 + 0.45 * Math.sin(frame / 12)} /></div>
        <KineticText text="Know what you own." size={vertical ? 120 : 110} color="#fff" align="center" delay={12} hi={["own."]} hiColor={C.teal} />
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", opacity: ease(frame, 45, 60) }}>
          {["Free", "Private by design", "Installable app"].map((t) => <Pill key={t} bg="rgba(255,255,255,.12)" color="#fff" size={vertical ? 32 : 26}>{t}</Pill>)}
        </div>
        <div style={{ opacity: ease(frame, 62, 78), transform: `scale(${0.9 + 0.1 * ease(frame, 62, 78)})`, background: C.saffron, color: C.ink, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: vertical ? 52 : 44, borderRadius: 99, padding: "20px 56px" }}>Try MF X-ray →</div>
        <div style={{ opacity: ease(frame, 80, 95), fontFamily: FONT_BODY, color: "rgba(255,255,255,.65)", fontSize: vertical ? 28 : 22, textAlign: "center" }}>Educational, not investment advice · Sample data shown in this video</div>
      </div>
    </>
  );
};
