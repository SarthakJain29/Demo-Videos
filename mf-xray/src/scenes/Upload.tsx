import React from "react";
import { useCurrentFrame } from "remotion";
import { Counter, Fit, SceneLayout, Window, ease } from "../ui";
import { C, FONT_BODY, FONT_HEAD } from "../theme";
import { Wordmark } from "../Logo";

const PdfIcon: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div style={{ width: 150 * scale, background: "#fff", borderRadius: 18, boxShadow: "0 18px 40px rgba(14,26,59,.25)", padding: 16 * scale, fontFamily: FONT_BODY }}>
    <div style={{ background: C.coral, color: "#fff", fontWeight: 800, fontSize: 18 * scale, borderRadius: 8, padding: `${4 * scale}px ${10 * scale}px`, display: "inline-block" }}>PDF</div>
    <div style={{ marginTop: 10 * scale, fontSize: 15 * scale, fontWeight: 600, color: C.ink }}>CAS_Statement</div>
    <div style={{ fontSize: 13 * scale, color: C.muted }}>CAMS · KFintech</div>
  </div>
);

export const Upload: React.FC = () => (
  <SceneLayout kicker="Step 1" headline="Drop in your CAS statement." hi={["CAS"]} sub="One PDF from CAMS or KFintech. That's it."
    visual={(w, h) => (
      <Fit W={1000} H={720} w={w} h={h}><UploadUI /></Fit>
    )} />
);

const UploadUI: React.FC = () => {
  const frame = useCurrentFrame();
  const drop = ease(frame, 20, 55);
  const progress = ease(frame, 62, 120);
  const done = frame > 122;
  return (
    <Window width={1000} height={720}>
      <div style={{ padding: 40, display: "flex", flexDirection: "column", gap: 28, height: "100%" }}>
        <div style={{ color: C.ink, fontSize: 30 }}><div style={{ fontFamily: FONT_HEAD, fontWeight: 800 }}><Wordmark size={44} dark /></div></div>
        <div style={{ flex: 1, borderRadius: 28, border: `3px dashed ${drop > 0.9 ? C.teal : "#B7C4DD"}`, background: drop > 0.9 ? `${C.teal}12` : "#fff", position: "relative", display: "grid", placeItems: "center" }}>
          <div style={{ textAlign: "center", fontFamily: FONT_BODY, color: C.muted, fontSize: 28, opacity: 1 - drop }}>
            <div style={{ fontSize: 60 }}>⬆️</div>Drop your CAS PDF here
          </div>
          <div style={{ position: "absolute", left: 500 - 75 + (1 - drop) * 330, top: 250 - 70 - (1 - drop) * 480 + (done ? -30 : 0), transform: `rotate(${(1 - drop) * 14}deg) scale(${done ? 0.8 : 1})`, opacity: done ? 0 : 1 }}>
            <PdfIcon />
          </div>
          {frame > 58 && (
            <div style={{ position: "absolute", left: 90, right: 90, top: 190, textAlign: "center", fontFamily: FONT_BODY }}>
              <div style={{ fontSize: 28, color: C.ink, fontWeight: 600, opacity: done ? 0 : 1 }}>Reading transactions… <Counter to={214} from={0} start={62} dur={58} size={28} color={C.tealDark} /></div>
              <div style={{ height: 14, borderRadius: 7, background: C.line, marginTop: 24, overflow: "hidden", opacity: done ? 0 : 1 }}>
                <div style={{ width: `${progress * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.teal}, ${C.saffron})` }} />
              </div>
            </div>
          )}
          {done && (
            <div style={{ textAlign: "center", fontFamily: FONT_HEAD, transform: `scale(${0.7 + 0.3 * ease(frame, 122, 134)})`, opacity: ease(frame, 122, 132) }}>
              <div style={{ width: 120, height: 120, borderRadius: 60, background: C.green, color: "#fff", fontSize: 70, display: "grid", placeItems: "center", margin: "0 auto" }}>✓</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: C.ink, marginTop: 20 }}>5 funds · 214 transactions</div>
            </div>
          )}
        </div>
      </div>
    </Window>
  );
};
