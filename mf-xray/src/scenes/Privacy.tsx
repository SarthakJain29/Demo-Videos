import React from "react";
import { useCurrentFrame } from "remotion";
import { Backdrop, Counter, Fit, KineticText, Pill, ease, useLayout } from "../ui";
import { C, FONT_BODY, FONT_HEAD } from "../theme";
import { LogoMark } from "../Logo";

export const Privacy: React.FC = () => {
  const frame = useCurrentFrame();
  const { vertical, width, height } = useLayout();
  const W = 1000, H = 560;
  const s = Math.min((width - 140) / W, (vertical ? 800 : 480) / H);
  const send = ease(frame, 40, 75);   // data tries to leave
  const block = ease(frame, 75, 90);
  const pills = ["No sign-up", "No server storage", "Works offline (PWA)"];
  return (
    <>
      <Backdrop dark />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: vertical ? 70 : 28, padding: 70, paddingBottom: vertical ? 220 : 150 }}>
        <KineticText text="Your data never leaves your device." size={vertical ? 100 : 82} color="#fff" align="center" hi={["never", "device."]} hiColor={C.teal} />
        <div style={{ width: W * s, height: H * s, opacity: ease(frame, 14, 32) }}>
          <div style={{ width: W, height: H, transform: `scale(${s})`, transformOrigin: "0 0", position: "relative", fontFamily: FONT_BODY }}>
            {/* device */}
            <div style={{ position: "absolute", left: 0, top: 80, width: 520, height: 400, borderRadius: 32, background: "rgba(255,255,255,.08)", border: `3px solid ${C.teal}`, boxShadow: `0 0 80px ${C.teal}44` }}>
              <div style={{ position: "absolute", top: -22, left: 28, background: C.teal, color: C.ink, fontWeight: 800, borderRadius: 99, padding: "6px 20px", fontSize: 22 }}>YOUR BROWSER</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", gap: 26 }}>
                <div style={{ background: "#fff", borderRadius: 14, padding: "14px 18px", fontSize: 22, fontWeight: 700, color: C.ink }}><span style={{ color: C.coral }}>PDF</span> statement</div>
                <div style={{ color: C.teal, fontSize: 40 }}>→</div>
                <div style={{ transform: `rotate(${frame * 3}deg)`, display: "inline-block" }}><LogoMark size={96} scan={0.5 + 0.4 * Math.sin(frame / 6)} /></div>
              </div>
              <div style={{ position: "absolute", bottom: 26, width: "100%", textAlign: "center", color: "#fff", fontSize: 24, fontWeight: 600 }}>Parsed here, in memory 🔒</div>
            </div>
            {/* arrow trying to leave */}
            <div style={{ position: "absolute", left: 540, top: 250, width: 200, height: 4, background: `repeating-linear-gradient(90deg, ${C.saffron} 0 14px, transparent 14px 26px)`, opacity: send > 0 ? 1 : 0, clipPath: `inset(0 ${100 - send * 100 * (1 - block * 0.55)}% 0 0)` }} />
            <div style={{ position: "absolute", left: 580 + 130 * block, top: 205, fontSize: 90, color: C.coral, opacity: block, transform: `scale(${0.5 + 0.5 * block})`, fontWeight: 800, fontFamily: FONT_HEAD }}>✕</div>
            {/* server */}
            <div style={{ position: "absolute", left: 740, top: 110, width: 260, height: 340, borderRadius: 28, border: "3px dashed rgba(255,255,255,.35)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "rgba(255,255,255,.7)", opacity: 0.75 }}>
              <div style={{ fontSize: 80 }}>☁️</div>
              <div style={{ fontSize: 22 }}>Server</div>
              <div style={{ fontSize: 22 }}><Counter to={0} from={0} start={0} size={44} color={C.coral} /> <span style={{ color: C.coral, fontWeight: 700 }}>bytes received</span></div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: vertical ? "column" : "row", gap: 20 }}>
          {pills.map((p, i) => (
            <div key={p} style={{ opacity: ease(frame, 90 + i * 8, 100 + i * 8), transform: `translateY(${(1 - ease(frame, 90 + i * 8, 104 + i * 8)) * 30}px)` }}>
              <Pill bg="rgba(18,181,166,.18)" color="#8FF0E5" size={vertical ? 34 : 28}>✓ {p}</Pill>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
