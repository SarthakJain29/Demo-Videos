import React from "react";
import { useCurrentFrame } from "remotion";
import { Card, FUNDS, Fit, Label, Pill, SceneLayout, Window, ease } from "../ui";
import { C, FONT_BODY, FONT_HEAD } from "../theme";

export const Overlap: React.FC = () => (
  <SceneLayout kicker="Insight 2 · Overlap" headline="Five funds. Same stocks, again and again." hi={["Same", "stocks,"]}
    visual={(w, h) => <Fit W={1000} H={720} w={w} h={h}><UI /></Fit>} />
);

const M = [
  [100, 68, 41, 52, 33],
  [68, 100, 38, 47, 29],
  [41, 38, 100, 58, 36],
  [52, 47, 58, 100, 31],
  [33, 29, 36, 31, 100],
];
const stocks = [["HDFC Bank", 4], ["Reliance", 4], ["ICICI Bank", 5], ["Infosys", 3]] as const;

const UI: React.FC = () => {
  const frame = useCurrentFrame();
  const cell = 70;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 6);
  return (
    <Window width={1000} height={720}>
      <div style={{ padding: 32, display: "flex", gap: 26 }}>
        <Card style={{ width: 540, padding: 24 }}>
          <Label color={C.ink} weight={700} size={24}>Fund overlap</Label>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: `44px repeat(5, ${cell}px)`, gap: 6 }}>
            <div />
            {FUNDS.map((f) => <div key={f.short} style={{ fontFamily: FONT_HEAD, fontWeight: 800, color: f.color, textAlign: "center", fontSize: 24 }}>{f.short}</div>)}
            {M.map((row, r) => (
              <React.Fragment key={r}>
                <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, color: FUNDS[r].color, fontSize: 24, display: "grid", placeItems: "center" }}>{FUNDS[r].short}</div>
                {row.map((v, c) => {
                  const t = ease(frame, 14 + (r + c) * 3, 30 + (r + c) * 3);
                  const hot = v >= 50 && v < 100;
                  return (
                    <div key={c} style={{ height: 64, borderRadius: 14, display: "grid", placeItems: "center", fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 21,
                      background: r === c ? C.line : hot ? `rgba(239,91,91,${(0.25 + v / 160) * t})` : `rgba(18,181,166,${(0.1 + v / 200) * t})`,
                      color: r === c ? C.muted : hot ? "#7A1414" : C.tealDark, opacity: t, transform: `scale(${0.7 + 0.3 * t})`,
                      boxShadow: hot && frame > 80 ? `0 0 0 ${3 * pulse}px ${C.coral}66` : "none" }}>
                      {r === c ? "—" : `${v}%`}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </Card>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ padding: 22 }}>
            <Label color={C.ink} weight={700} size={22}>Stocks you own many times</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
              {stocks.map(([n, k], i) => {
                const t = ease(frame, 70 + i * 8, 90 + i * 8);
                return (
                  <div key={n} style={{ opacity: t, transform: `translateX(${(1 - t) * 40}px)`, fontFamily: FONT_BODY }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 19, fontWeight: 600, color: C.ink }}><span>{n}</span><span style={{ color: C.coral }}>in {k} funds</span></div>
                    <div style={{ height: 8, borderRadius: 4, background: C.line, marginTop: 6 }}><div style={{ width: `${(k / 5) * 100 * t}%`, height: "100%", borderRadius: 4, background: C.coral }} /></div>
                  </div>
                );
              })}
            </div>
          </Card>
          <div style={{ opacity: ease(frame, 110, 125) }}><Pill bg={`${C.saffron}33`} color="#8A5A00" size={20}>⚠ Bluechip + Nifty 50: 68% overlap</Pill></div>
        </div>
      </div>
    </Window>
  );
};
