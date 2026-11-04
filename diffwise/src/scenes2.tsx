import React from "react";
import {useCurrentFrame, useVideoConfig, spring} from "remotion";
import {C, F, ease, gradient} from "./theme";
import {Logo, Word, Pill, Window, BotAvatar} from "./ui";

const center: React.CSSProperties = {position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center"};

/* 5 — Pipeline */
const NODES = [
  {t: "GitHub", s: "pull_request.opened", code: "POST /api/webhook", c: C.text},
  {t: "Webhook", s: "verify signature", code: "HMAC-SHA256 ✓", c: C.violetSoft},
  {t: "Queue", s: "review job enqueued", code: "review-jobs · 1", c: C.amber},
  {t: "Worker", s: "fetch the diff", code: "3 files · +84 −12", c: C.mint},
  {t: "LLM", s: "review every hunk", code: "7 findings", c: C.coral},
];
const Icon: React.FC<{i: number; c: string}> = ({i, c}) => {
  const p = {stroke: c, strokeWidth: 3, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const};
  return (
    <svg width="54" height="54" viewBox="0 0 48 48">
      {i === 0 && <><circle cx="14" cy="12" r="5" {...p} /><circle cx="14" cy="36" r="5" {...p} /><circle cx="36" cy="30" r="5" {...p} /><path d="M14 17v14M36 25V20a8 8 0 0 0-8-8h-3" {...p} /></>}
      {i === 1 && <path d="M26 5L12 27h10l-2 16 16-24H26z" {...p} />}
      {i === 2 && <><rect x="6" y="10" width="36" height="8" rx="3" {...p} /><rect x="6" y="22" width="36" height="8" rx="3" {...p} /><rect x="6" y="34" width="36" height="8" rx="3" {...p} /></>}
      {i === 3 && <><circle cx="24" cy="24" r="7" {...p} /><path d="M24 5v6M24 37v6M5 24h6M37 24h6M10.5 10.5l4.2 4.2M33.3 33.3l4.2 4.2M10.5 37.5l4.2-4.2M33.3 14.7l4.2-4.2" {...p} /></>}
      {i === 4 && <><path d="M24 6l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" {...p} /></>}
    </svg>
  );
};
export const Pipeline: React.FC = () => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const W = 1520, gap = W / 5;
  const t = Math.max(0, Math.min(1, (f - 20) / (d - 60)));
  const px = t * 4 * gap; // packet position along centers
  return (
    <div style={center}>
      <div style={{position: "relative", width: W, height: 520}}>
        <div style={{position: "absolute", top: -30, left: 0, right: 0, textAlign: "center", fontFamily: F.display, fontSize: 58, fontWeight: 700, color: C.text, opacity: ease(f, 0, 14)}}>
          From <span style={{color: C.mint}}>PR</span> to <span style={{color: C.violetSoft}}>review</span>, hands-free.
        </div>
        {/* connector rail */}
        <div style={{position: "absolute", left: gap / 2, top: 262, width: 4 * gap, height: 4, background: C.line, borderRadius: 2}} />
        <div style={{position: "absolute", left: gap / 2, top: 262, width: px, height: 4, background: gradient, borderRadius: 2, boxShadow: `0 0 20px ${C.violet}`}} />
        <div style={{position: "absolute", left: gap / 2 + px - 14, top: 252, width: 28, height: 28, borderRadius: 14, background: "#fff", boxShadow: `0 0 40px 12px ${C.violet}`}} />
        {NODES.map((n, i) => {
          const reach = (f - 20) / (d - 60) * 4 >= i - 0.05;
          const p = ease(f, 6 + i * 5, 16);
          const lit = ease(f, 20 + (i / 4) * (d - 60) - 4, 8);
          return (
            <div key={n.t} style={{position: "absolute", left: i * gap, width: gap, top: 150, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
              <div style={{margin: "0 auto", width: 190, height: 190, borderRadius: 44, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center",
                border: `2px solid ${reach ? n.c : C.line}`, boxShadow: reach ? `0 0 ${50 * lit}px ${n.c}55` : "none", transform: `scale(${1 + lit * 0.05})`}}>
                <Icon i={i} c={reach ? n.c : C.muted} />
              </div>
              <div style={{fontFamily: F.display, fontSize: 36, fontWeight: 700, color: C.text, marginTop: 26}}>{n.t}</div>
              <div style={{fontFamily: F.body, fontSize: 21, color: C.muted, marginTop: 4}}>{n.s}</div>
              <div style={{fontFamily: F.mono, fontSize: 20, color: n.c, marginTop: 14, opacity: lit, background: n.c + "14", display: "inline-block", padding: "6px 14px", borderRadius: 8}}>{n.code}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* 6 — Comments land */
type Cm = {line: number; sev: string; col: string; title: string; body: string; fix?: [string, string]; at: number};
export const Comments: React.FC = () => {
  const f = useCurrentFrame();
  const {durationInFrames: d} = useVideoConfig();
  const k = d / 300;
  const code = [
    "async function retryPayment(id, attempts = 3) {",
    "  const res = await db.query(`SELECT * FROM payments WHERE id = ${id}`);",
    "  const card = res.rows[0].card;",
    "  return charge(card, attempts);",
    "}",
  ];
  const cms: Cm[] = [
    {line: 1, sev: "Critical", col: C.coral, title: "SQL injection risk", body: "`id` is interpolated into the query. Use a parameterized statement.", fix: ["db.query(`… WHERE id = ${id}`)", "db.query(\"… WHERE id = $1\", [id])"], at: 40 * k},
    {line: 2, sev: "Bug", col: C.amber, title: "Possible null dereference", body: "`rows[0]` is undefined when no payment matches. Guard before reading `.card`.", at: 120 * k},
  ];
  const summaryP = ease(f, 195 * k, 16);
  return (
    <div style={center}>
      <Window title="github.com/acme/payments-api/pull/482/files" width={1420} style={{opacity: ease(f, 0, 12)}}>
        <div style={{padding: "26px 36px 30px"}}>
          <div style={{fontFamily: F.mono, fontSize: 20, color: C.muted, marginBottom: 14}}>src/payments/retry.ts</div>
          <div style={{background: C.ghLight, border: `1px solid ${C.line}`, borderRadius: 12, fontFamily: F.mono, fontSize: 22}}>
            {code.map((l, i) => {
              const cm = cms.find((c) => c.line === i);
              const p = cm ? ease(f, cm.at, 18) : 0;
              const hl = cm ? p : 0;
              return (
                <React.Fragment key={i}>
                  <div style={{display: "flex", padding: "5px 18px", background: `rgba(55,242,176,${0.07 + hl * 0.05})`, color: "#CFFAEB", whiteSpace: "pre", position: "relative",
                    boxShadow: cm ? `inset 4px 0 0 ${cm.col}${Math.round(hl * 255).toString(16).padStart(2, "0")}` : undefined}}>
                    <span style={{color: C.mint, width: 50}}>+ {i + 1}</span>{l}
                  </div>
                  {cm && (
                    <div style={{margin: "10px 18px 14px 56px", overflow: "hidden", height: p * (cm.fix ? 196 : 112), opacity: p}}>
                      <div style={{background: C.surface, border: `1px solid ${cm.col}66`, borderRadius: 12, padding: "14px 20px", fontFamily: F.body, boxShadow: `0 0 36px ${cm.col}22`}}>
                        <div style={{display: "flex", alignItems: "center", gap: 12}}>
                          <BotAvatar size={30} />
                          <span style={{fontWeight: 600, fontSize: 20, color: C.text}}>diffwise</span>
                          <Pill color={cm.col} style={{fontSize: 15, padding: "2px 10px"}}>{cm.sev}</Pill>
                          <span style={{fontWeight: 600, fontSize: 20, color: C.text}}>{cm.title}</span>
                        </div>
                        <div style={{fontSize: 19, color: C.muted, marginTop: 8}}>{cm.body.replace(/`/g, "")}</div>
                        {cm.fix && (
                          <div style={{marginTop: 10, fontFamily: F.mono, fontSize: 17, borderRadius: 8, overflow: "hidden"}}>
                            <div style={{background: C.coral + "1F", color: "#FFC9D1", padding: "3px 12px"}}>− {cm.fix[0]}</div>
                            <div style={{background: C.mint + "1F", color: "#CFFAEB", padding: "3px 12px"}}>+ {cm.fix[1]}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <div style={{marginTop: 22, display: "flex", alignItems: "center", gap: 18, opacity: summaryP, transform: `translateY(${(1 - summaryP) * 14}px)`}}>
            <Pill color={C.mint} style={{fontSize: 20}}>✓ Review complete</Pill>
            <span style={{fontFamily: F.body, fontSize: 22, color: C.muted}}>3 files · 7 comments · <span style={{color: C.text}}>4.2s</span></span>
          </div>
        </div>
      </Window>
    </div>
  );
};

/* 7 — Dashboard */
const Count: React.FC<{to: number; at: number; dec?: number; suffix?: string}> = ({to, at, dec = 0, suffix = ""}) => {
  const f = useCurrentFrame();
  const v = to * ease(f, at, 50);
  return <>{v.toLocaleString("en-US", {minimumFractionDigits: dec, maximumFractionDigits: dec})}{suffix}</>;
};
export const Dashboard: React.FC = () => {
  const f = useCurrentFrame();
  const bars = [38, 52, 44, 66, 58, 74, 62, 88, 70, 96, 84, 110, 92, 120];
  const rows = [["#482 Add payment retry logic", "acme/payments-api", "7", "4.2s", C.coral], ["#479 Fix webhook timeout", "acme/web-app", "2", "2.9s", C.amber], ["#477 Bump deps", "acme/infra", "0", "1.4s", C.mint], ["#474 Refactor auth guard", "acme/web-app", "4", "3.8s", C.amber]];
  const stats = [["Reviews this month", 1284, 0, ""], ["Issues caught", 3902, 0, ""], ["Avg review time", 6.4, 1, "s"]] as const;
  return (
    <div style={center}>
      <Window title="app.diffwise.dev/dashboard" width={1560} style={{opacity: ease(f, 0, 12), transform: `scale(${0.97 + ease(f, 0, 20) * 0.03})`}}>
        <div style={{display: "flex", height: 700}}>
          <div style={{width: 250, borderRight: `1px solid ${C.line}`, padding: "28px 20px", background: C.surface}}>
            <div style={{display: "flex", alignItems: "center", gap: 12, marginBottom: 34}}><Logo size={38} /><span style={{fontFamily: F.display, fontWeight: 700, fontSize: 26, color: C.text}}>Diffwise</span></div>
            {["History", "Settings", "Usage"].map((n, i) => (
              <div key={n} style={{padding: "12px 16px", borderRadius: 10, fontFamily: F.body, fontSize: 21, marginBottom: 6, color: i === 0 ? C.text : C.muted, background: i === 0 ? C.violet + "30" : "transparent"}}>{n}</div>
            ))}
          </div>
          <div style={{flex: 1, padding: "28px 36px", background: C.ink}}>
            <div style={{display: "flex", gap: 20, marginBottom: 24}}>
              {stats.map(([l, v, dec, suf], i) => {
                const p = ease(f, 10 + i * 8, 16);
                return (
                  <div key={l} style={{flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "18px 22px", opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
                    <div style={{fontFamily: F.body, fontSize: 18, color: C.muted}}>{l}</div>
                    <div style={{fontFamily: F.display, fontSize: 52, fontWeight: 700, color: C.text}}><Count to={v} at={14 + i * 8} dec={dec} suffix={suf} /></div>
                  </div>
                );
              })}
            </div>
            <div style={{display: "flex", gap: 20}}>
              <div style={{flex: 1.1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "18px 22px"}}>
                <div style={{fontFamily: F.body, fontSize: 18, color: C.muted, marginBottom: 12}}>Reviews per day</div>
                <svg width="100%" height="190" viewBox="0 0 560 190">
                  {bars.map((b, i) => {
                    const h = b * 1.45 * ease(f, 30 + i * 2, 24);
                    return <rect key={i} x={i * 40 + 6} y={185 - h} width={28} height={h} rx={6} fill={i === bars.length - 1 ? C.mint : C.violet} opacity={i === bars.length - 1 ? 1 : 0.75} />;
                  })}
                </svg>
              </div>
              <div style={{flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderRadius: 14, padding: "18px 22px"}}>
                <div style={{fontFamily: F.body, fontSize: 18, color: C.muted, marginBottom: 8}}>Recent reviews</div>
                {rows.map(([t, r, n, s, c], i) => {
                  const p = ease(f, 60 + i * 10, 14);
                  return (
                    <div key={t as string} style={{display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < 3 ? `1px solid ${C.line}` : "none", opacity: p, transform: `translateX(${(1 - p) * 30}px)`}}>
                      <div style={{flex: 1}}>
                        <div style={{fontFamily: F.body, fontSize: 18, color: C.text, fontWeight: 500}}>{t}</div>
                        <div style={{fontFamily: F.mono, fontSize: 14, color: C.muted}}>{r}</div>
                      </div>
                      <Pill color={c as string} style={{fontSize: 15, padding: "2px 10px"}}>{n} issues</Pill>
                      <span style={{fontFamily: F.mono, fontSize: 15, color: C.muted, width: 40, textAlign: "right"}}>{s}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Window>
    </div>
  );
};

/* 8 — Roadmap */
export const Roadmap: React.FC = () => {
  const f = useCurrentFrame();
  const items = [
    ["Repo context", "Embeddings in pgvector so reviews know your codebase.", C.violetSoft],
    ["Rate limits & quotas", "Per-tenant limits keep every team fair and fast.", C.mint],
    ["Cost tracking", "Tokens and dollars per repo, per review.", C.amber],
    ["Monitoring & scale", "Metrics, alerts and queues that grow with you.", C.coral],
  ];
  return (
    <div style={{...center, flexDirection: "column"}}>
      <div style={{width: 1560, marginBottom: 56, whiteSpace: "nowrap"}}>
        <Word at={0} size={96}>On</Word><Word at={4} size={96}>the</Word><Word at={8} size={96} grad>roadmap</Word>
      </div>
      <div style={{display: "flex", gap: 24, width: 1560, position: "relative"}}>
        {items.map(([t, b, c], i) => {
          const p = ease(f, 22 + i * 14, 20);
          return (
            <div key={t} style={{flex: 1, background: C.surface, border: `1px solid ${C.line}`, borderTop: `4px solid ${c}`, borderRadius: 18, padding: "32px 28px", minHeight: 300,
              opacity: p, transform: `translateY(${(1 - p) * 50}px)`}}>
              <div style={{fontFamily: F.mono, fontSize: 20, color: c, marginBottom: 18}}>0{i + 1}</div>
              <div style={{fontFamily: F.display, fontSize: 36, fontWeight: 700, color: C.text, lineHeight: 1.1, marginBottom: 16}}>{t}</div>
              <div style={{fontFamily: F.body, fontSize: 22, color: C.muted, lineHeight: 1.4}}>{b}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* 9 — CTA */
export const CTA: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f, fps, config: {damping: 14}});
  return (
    <div style={{...center, flexDirection: "column", gap: 20}}>
      <div style={{transform: `scale(${0.5 + s * 0.5})`, filter: `drop-shadow(0 0 50px ${C.violet}99)`}}><Logo size={130} /></div>
      <div style={{whiteSpace: "nowrap", marginTop: 14}}>
        <Word at={8} size={130}>Reviews</Word><Word at={12} size={130}>that</Word><Word at={16} size={130} grad>never</Word><Word at={20} size={130} grad>wait.</Word>
      </div>
      <div style={{marginTop: 30, padding: "20px 50px", borderRadius: 16, background: gradient, fontFamily: F.display, fontWeight: 700, fontSize: 36, color: "#0A0C12",
        opacity: ease(f, 40, 16), transform: `translateY(${(1 - ease(f, 40, 16)) * 20}px)`}}>
        Join the early access list
      </div>
      <div style={{fontFamily: F.mono, fontSize: 26, color: C.muted, opacity: ease(f, 54, 16)}}>diffwise.dev</div>
    </div>
  );
};
