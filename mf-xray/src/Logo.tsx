import React from "react";
import { C } from "./theme";

// Mark: indigo rounded square, an "X" whose two strokes are teal + white, with a scan line.
export const LogoMark: React.FC<{ size?: number; scan?: number }> = ({ size = 96, scan = 0.5 }) => (
  <svg width={size} height={size} viewBox="0 0 96 96" style={{ display: "block" }}>
    <defs>
      <clipPath id="lm"><rect width="96" height="96" rx="24" /></clipPath>
    </defs>
    <rect width="96" height="96" rx="24" fill={C.ink} />
    <g clipPath="url(#lm)">
      <path d="M28 28 L68 68" stroke="#fff" strokeWidth="12" strokeLinecap="round" />
      <path d="M68 28 L28 68" stroke={C.teal} strokeWidth="12" strokeLinecap="round" />
      <rect x="0" y={8 + scan * 76} width="96" height="3" fill={C.saffron} opacity="0.95" />
    </g>
  </svg>
);

export const Wordmark: React.FC<{ size?: number; dark?: boolean; scan?: number }> = ({ size = 56, dark = false, scan }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}>
    <LogoMark size={size} scan={scan} />
    <div style={{ fontFamily: "inherit", fontWeight: 800, fontSize: size * 0.72, letterSpacing: -1, color: dark ? C.ink : "#fff" }}>
      MF <span style={{ color: C.teal }}>X-ray</span>
    </div>
  </div>
);
