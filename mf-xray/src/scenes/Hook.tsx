import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { Backdrop, FUNDS, KineticText, ease, useLayout } from "../ui";
import { C, FONT_BODY, FONT_HEAD } from "../theme";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { vertical, width, height } = useLayout();
  const q = ease(frame, 55, 70);
  const scan = ease(frame, 95, 140);
  return (
    <>
      <Backdrop dark />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: vertical ? 80 : 60, padding: 80 }}>
        <div style={{ display: "flex", flexDirection: vertical ? "column" : "row", gap: 22, alignItems: "center" }}>
          {FUNDS.map((f, i) => {
            const s = spring({ frame: frame - 6 - i * 5, fps, config: { damping: 13 } });
            const floatY = Math.sin((frame + i * 14) / 18) * 6;
            return (
              <div key={f.short} style={{ opacity: s, transform: `translateY(${(1 - s) * 80 + floatY}px) rotate(${(i - 2) * 1.5 * s}deg)`, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.18)", borderRadius: 22, padding: "20px 26px", display: "flex", alignItems: "center", gap: 16, width: vertical ? 620 : 330, backdropFilter: "blur(6px)" }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: f.color, color: "#fff", fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 22, display: "grid", placeItems: "center" }}>{f.short}</div>
                <div style={{ fontFamily: FONT_BODY, color: "#fff", fontSize: vertical ? 30 : 24, fontWeight: 600, lineHeight: 1.2 }}>{f.name}</div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "center", position: "relative" }}>
          <KineticText text="You own 5 funds." size={vertical ? 110 : 96} color="#fff" align="center" delay={10} />
          <div style={{ height: 22 }} />
          <KineticText text="Do you know what you actually own?" size={vertical ? 96 : 84} color="#fff" align="center" delay={50} hi={["actually", "own?"]} hiColor={C.saffron} />
        </div>
      </div>
      {/* x-ray scan sweep */}
      <div style={{ position: "absolute", left: 0, right: 0, top: `${scan * 100}%`, height: 6, background: C.teal, boxShadow: `0 0 60px 20px ${C.teal}88`, opacity: scan > 0 && scan < 1 ? 1 : 0 }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(transparent, ${C.teal}22)`, opacity: q * 0.5 }} />
    </>
  );
};
