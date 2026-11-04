import React from "react";
import {useCurrentFrame, useVideoConfig, spring} from "remotion";
import {C, F, ease, gradient} from "./theme";
import {Logo, Word, Pill, Window, Cursor, BotAvatar} from "./ui";

const center: React.CSSProperties = {position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center"};

/* 1 — Problem */
export const Problem: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, durationInFrames: d} = useVideoConfig();
  const lines = [["Reviews", "are", "slow."], ["Feedback", "is", "inconsistent."], ["Mistakes", "repeat."]];
  const prs = [
    ["fix: retry on timeout", "3d waiting", C.coral], ["feat: usage export", "2d waiting", C.coral],
    ["chore: bump deps", "19h waiting", C.amber], ["refactor: auth guard", "6h waiting", C.amber],
  ];
  const step = Math.floor(d / 3.6);
  return (
    <div style={center}>
      <div style={{display: "flex", gap: 90, alignItems: "center", width: 1500}}>
        <div style={{flex: 1}}>
          {lines.map((l, i) => (
            <div key={i} style={{whiteSpace: "nowrap", opacity: i < 2 && f > step * (i + 1.7) ? 0.35 : 1, transition: "none"}}>
              {l.map((w, j) => <Word key={j} at={8 + i * step + j * 4} size={84} grad={i === 2 && j === 1 || (i === 2 && j === 0)}>{w}</Word>)}
            </div>
          ))}
        </div>
        <div style={{width: 520}}>
          {prs.map(([t, a, c], i) => {
            const p = ease(f, 14 + i * 9, 18);
            return (
              <div key={t} style={{opacity: p, transform: `translateX(${(1 - p) * 60}px)`, display: "flex", alignItems: "center", gap: 14,
                background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "16px 20px", marginBottom: 14}}>
                <svg width="22" height="22" viewBox="0 0 16 16" fill={C.mint}><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.12v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354Z" /></svg>
                <span style={{fontFamily: F.mono, fontSize: 20, color: C.text, flex: 1}}>{t}</span>
                <Pill color={c as string}>{a}</Pill>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* 2 — Intro */
export const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 13}});
  const name = "Diffwise".split("");
  return (
    <div style={{...center, flexDirection: "column", gap: 36}}>
      <div style={{display: "flex", alignItems: "center", gap: 36}}>
        <div style={{transform: `scale(${0.4 + s * 0.6}) rotate(${(1 - s) * -30}deg)`, filter: `drop-shadow(0 0 ${60 * s}px ${C.violet}88)`}}><Logo size={190} /></div>
        <div style={{display: "flex"}}>
          {name.map((ch, i) => {
            const p = ease(f, 12 + i * 3, 14);
            return <span key={i} style={{fontFamily: F.display, fontWeight: 700, fontSize: 190, letterSpacing: -6, color: C.text,
              opacity: p, transform: `translateY(${(1 - p) * 50}px)`, display: "inline-block"}}>{ch}</span>;
          })}
        </div>
      </div>
      <div style={{fontFamily: F.body, fontSize: 40, color: C.muted, opacity: ease(f, 44, 16), letterSpacing: 1}}>
        AI code review, <span style={{color: C.mint}}>inside GitHub.</span>
      </div>
    </div>
  );
};

/* 3 — Install */
export const Install: React.FC = () => {
  const f = useCurrentFrame();
  const repos = ["acme/payments-api", "acme/web-app", "acme/infra"];
  const click = f >= 130 && f < 140 ? 1 : 0;
  const installed = f >= 140;
  const cx = ease(f, 70, 55, 1500, 1190), cy = ease(f, 70, 55, 760, 705);
  const sel = f > 100 ? 0 : -1;
  return (
    <div style={center}>
      <Window title="github.com/apps/diffwise/installations/new" width={1150} style={{opacity: ease(f, 0, 14), transform: `scale(${0.96 + ease(f, 0, 20) * 0.04})`}}>
        <div style={{padding: "44px 56px", position: "relative", height: 640}}>
          <div style={{display: "flex", alignItems: "center", gap: 22, marginBottom: 34}}>
            <Logo size={76} />
            <div>
              <div style={{fontFamily: F.display, fontSize: 40, fontWeight: 700, color: C.text}}>Install Diffwise</div>
              <div style={{fontFamily: F.body, fontSize: 22, color: C.muted}}>Reviews every pull request, automatically.</div>
            </div>
          </div>
          <div style={{fontFamily: F.body, fontSize: 20, color: C.muted, marginBottom: 14}}>Select repositories</div>
          {repos.map((r, i) => {
            const p = ease(f, 18 + i * 8, 14);
            const on = sel === i;
            return (
              <div key={r} style={{opacity: p, transform: `translateY(${(1 - p) * 20}px)`, display: "flex", alignItems: "center", gap: 16, padding: "18px 22px",
                marginBottom: 12, borderRadius: 14, border: `1px solid ${on ? C.violet : C.line}`, background: on ? C.violet + "18" : C.raised}}>
                <div style={{width: 26, height: 26, borderRadius: 8, border: `2px solid ${on ? C.mint : C.muted}`, background: on ? C.mint : "transparent", display: "flex", alignItems: "center", justifyContent: "center"}}>
                  {on && <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5" stroke="#0A0C12" strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>}
                </div>
                <span style={{fontFamily: F.mono, fontSize: 26, color: C.text}}>{r}</span>
              </div>
            );
          })}
          <div style={{position: "absolute", right: 56, bottom: 44, display: "flex", alignItems: "center", gap: 20}}>
            {installed && <span style={{fontFamily: F.body, fontSize: 24, color: C.mint, opacity: ease(f, 142, 12)}}>✓ Installed on acme/payments-api</span>}
            <div style={{padding: "16px 36px", borderRadius: 12, fontFamily: F.body, fontWeight: 600, fontSize: 26, color: installed ? C.mint : "#0A0C12",
              background: installed ? "transparent" : gradient, border: installed ? `2px solid ${C.mint}` : "none", transform: `scale(${1 - click * 0.05})`}}>
              {installed ? "Installed" : "Install"}
            </div>
          </div>
          <Cursor x={cx - 270} y={cy - 130} click={click} />
        </div>
      </Window>
    </div>
  );
};

/* 4 — PR opened */
export const PROpened: React.FC = () => {
  const f = useCurrentFrame();
  const merged = ease(f, 0, 18);
  const lines: [string, string][] = [
    ["+", "async function retryPayment(id, attempts = 3) {"],
    ["+", "  const res = await db.query(`SELECT * FROM payments WHERE id = ${id}`);"],
    ["+", "  return charge(res.rows[0].card, attempts);"],
    ["+", "}"],
  ];
  return (
    <div style={center}>
      <Window title="github.com/acme/payments-api/pull/482" width={1400} style={{opacity: merged, transform: `scale(${0.97 + merged * 0.03})`}}>
        <div style={{padding: "36px 48px"}}>
          <div style={{display: "flex", alignItems: "center", gap: 18, marginBottom: 10}}>
            <span style={{fontFamily: F.display, fontSize: 44, fontWeight: 700, color: C.text}}>Add payment retry logic</span>
            <span style={{fontFamily: F.display, fontSize: 44, color: C.muted}}>#482</span>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: 16, marginBottom: 30, opacity: ease(f, 10, 12)}}>
            <Pill color={C.mint} style={{fontSize: 22, padding: "6px 18px", background: C.mint + "30"}}>● Open</Pill>
            <span style={{fontFamily: F.body, fontSize: 22, color: C.muted}}>maya wants to merge 1 commit into <span style={{fontFamily: F.mono, color: C.violetSoft}}>main</span> from <span style={{fontFamily: F.mono, color: C.violetSoft}}>feat/retry</span></span>
          </div>
          <div style={{background: C.ghLight, border: `1px solid ${C.line}`, borderRadius: 14, fontFamily: F.mono, fontSize: 24, overflow: "hidden", opacity: ease(f, 16, 14)}}>
            <div style={{padding: "10px 20px", color: C.muted, borderBottom: `1px solid ${C.line}`, fontSize: 20}}>src/payments/retry.ts</div>
            {lines.map(([sign, t], i) => (
              <div key={i} style={{padding: "6px 20px", background: C.mint + "14", color: "#CFFAEB", opacity: ease(f, 24 + i * 6, 10), whiteSpace: "pre"}}>
                <span style={{color: C.mint, marginRight: 18}}>{sign}</span>{t}
              </div>
            ))}
          </div>
          <div style={{marginTop: 30, display: "flex", alignItems: "center", gap: 16, opacity: ease(f, 66, 14), transform: `translateY(${(1 - ease(f, 66, 14)) * 16}px)`,
            padding: "16px 22px", border: `1px solid ${C.violet}66`, background: C.violet + "14", borderRadius: 14}}>
            <BotAvatar size={44} />
            <span style={{fontFamily: F.body, fontSize: 24, color: C.text}}><b style={{fontWeight: 600}}>diffwise[bot]</b> <span style={{color: C.muted}}>was requested for review</span></span>
            <span style={{marginLeft: "auto"}}><Pill color={C.violetSoft}>⏳ Reviewing…</Pill></span>
          </div>
        </div>
      </Window>
    </div>
  );
};
