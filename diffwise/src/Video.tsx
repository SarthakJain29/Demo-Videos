import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile} from "remotion";
import narration from "../scripts/narration.json";
import timings from "./timings.json";
import {Background, SceneFrame, Caption, Logo} from "./ui";
import {Problem, Intro, Install, PROpened} from "./scenes1";
import {Pipeline, Comments, Dashboard, Roadmap, CTA} from "./scenes2";
import {C, F} from "./theme";

export const FPS = 30;
const T = timings as Record<string, number>;
const comp: Record<string, React.FC> = {problem: Problem, intro: Intro, install: Install, pr: PROpened, pipeline: Pipeline, comments: Comments, dashboard: Dashboard, roadmap: Roadmap, cta: CTA};
const FALLBACK: Record<string, number> = {problem: 9, intro: 5, install: 8, pr: 5, pipeline: 8, comments: 10, dashboard: 8, roadmap: 7, cta: 5};
const HAS_AUDIO = Object.keys(T).length > 0;
const LEAD = 6; // frames before narration starts

export const scenes = narration.map((n) => {
  const secs = T[n.id] ?? FALLBACK[n.id];
  return {...n, secs, frames: Math.round((secs + 0.7) * FPS) + LEAD, hasAudio: T[n.id] !== undefined};
});
export const TOTAL = scenes.reduce((a, s) => a + s.frames, 0);

export const Diffwise: React.FC<{vertical?: boolean}> = ({vertical}) => {
  let from = 0;
  const scale = vertical ? 0.68 : 1;
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Background />
      <AbsoluteFill style={vertical ? {overflow: "hidden", alignItems: "center", justifyContent: "center"} : undefined}>
        <div style={{width: 1920, height: 1080, position: "relative", transform: `scale(${scale})`, flexShrink: 0}}>
          {scenes.map((s) => {
            const start = from; from += s.frames;
            const Scene = comp[s.id];
            return (
              <Sequence key={s.id} from={start} durationInFrames={s.frames}>
                <SceneFrame><Scene /></SceneFrame>
              </Sequence>
            );
          })}
        </div>
      </AbsoluteFill>
      {(() => {
        let st = 0;
        return scenes.map((s) => {
          const start = st; st += s.frames;
          return (
            <Sequence key={s.id} from={start} durationInFrames={s.frames}>
              {s.hasAudio && HAS_AUDIO && <Sequence from={LEAD}><Audio src={staticFile(`audio/${s.id}.wav`)} /></Sequence>}
              <AbsoluteFill style={{justifyContent: "flex-end", alignItems: "center", paddingBottom: vertical ? 300 : 56, ...(vertical ? {justifyContent: "flex-start", paddingTop: 1380} : {})}}>
                <Caption text={s.text} dur={s.frames - LEAD - 15} start={LEAD} vertical={vertical} />
              </AbsoluteFill>
            </Sequence>
          );
        });
      })()}
      {vertical && (
        <AbsoluteFill style={{paddingTop: 150, flexDirection: "row", justifyContent: "center", alignItems: "flex-start", gap: 20, height: 260}}>
          <Logo size={64} /><span style={{fontFamily: F.display, fontWeight: 700, fontSize: 56, color: C.text}}>Diffwise</span>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
