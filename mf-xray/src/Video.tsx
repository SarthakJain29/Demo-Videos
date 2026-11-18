import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import script from "./script.json";
import audio from "./audio.json";
import { FPS, C, FONT_BODY } from "./theme";
import { useLayout } from "./ui";
import { Hook } from "./scenes/Hook";
import { Upload } from "./scenes/Upload";
import { Privacy } from "./scenes/Privacy";
import { Xirr } from "./scenes/Xirr";
import { Overlap } from "./scenes/Overlap";
import { Cost } from "./scenes/Cost";
import { Explain } from "./scenes/Explain";
import { Chat } from "./scenes/Chat";
import { Cta } from "./scenes/Cta";

const COMPONENTS: Record<string, React.FC> = { hook: Hook, upload: Upload, privacy: Privacy, xirr: Xirr, overlap: Overlap, cost: Cost, explain: Explain, chat: Chat, cta: Cta };
const AUDIO_DELAY = 8; // frames before narration starts in each scene
const dur = audio as Record<string, number>;

export const scenes = script.map((s) => {
  const voiced = dur[s.id] !== undefined;
  const frames = Math.ceil(Math.max(s.min, voiced ? dur[s.id] + 0.9 : 0) * FPS);
  return { ...s, voiced, frames, audioFrames: voiced ? Math.ceil(dur[s.id] * FPS) : Math.ceil(s.text.length / 15 * FPS) };
});
export const TOTAL_FRAMES = scenes.reduce((a, s) => a + s.frames, 0);

const Captions: React.FC<{ text: string; audioFrames: number }> = ({ text, audioFrames }) => {
  const frame = useCurrentFrame();
  const { vertical } = useLayout();
  const parts = text.match(/[^.?!]+[.?!]*/g)!.map((p) => p.trim());
  const total = parts.reduce((a, p) => a + p.length, 0);
  let acc = 0;
  const t = frame - AUDIO_DELAY;
  const cur = parts.find((p) => { const a = acc / total * audioFrames; acc += p.length; return t >= a && t < acc / total * audioFrames + 6; });
  if (!cur || t < 0) return null;
  const clean = cur.replace(/M F X-ray/g, "MF X-ray").replace(/X I R R/g, "XIRR");
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: vertical ? 150 : 46, display: "flex", justifyContent: "center", padding: "0 80px" }}>
      <div style={{ background: "rgba(14,26,59,.82)", color: "#fff", fontFamily: FONT_BODY, fontWeight: 600, fontSize: vertical ? 44 : 36, lineHeight: 1.3, padding: "14px 32px", borderRadius: 20, textAlign: "center", maxWidth: vertical ? 940 : 1400 }}>{clean}</div>
    </div>
  );
};

const SceneFrame: React.FC<{ s: (typeof scenes)[number]; Comp: React.FC }> = ({ s, Comp }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [s.frames - 8, s.frames], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut), background: C.ink }}>
      <Comp />
      <Captions text={s.text} audioFrames={s.audioFrames} />
      {s.voiced && <Sequence from={AUDIO_DELAY}><Audio src={staticFile(`vo/${s.id}.wav`)} /></Sequence>}
    </AbsoluteFill>
  );
};

export const MFXray: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      {scenes.map((s) => {
        const el = <Sequence key={s.id} from={from} durationInFrames={s.frames}><SceneFrame s={s} Comp={COMPONENTS[s.id]} /></Sequence>;
        from += s.frames;
        return el;
      })}
    </AbsoluteFill>
  );
};
