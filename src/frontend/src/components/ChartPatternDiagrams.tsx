import type { ReactElement } from "react";
// ─── Chart Pattern SVG Diagrams ──────────────────────────────────────────────
// 30+ inline SVG diagrams for all major chart patterns used in lessons
// Each pattern has: SVG diagram, name, signal type, category, description

export type PatternSignal = "Bullish" | "Bearish" | "Continuation" | "Neutral";
export type PatternCategory = "Reversal" | "Continuation" | "Candlestick";

export interface ChartPattern {
  id: string;
  name: string;
  signal: PatternSignal;
  category: PatternCategory;
  description: string;
  SVG: () => ReactElement;
}

// ─── Shared style constants ───────────────────────────────────────────────────
const BG = "oklch(0.16 0.01 260)";
const GREEN = "oklch(0.65 0.18 145)";
const RED = "oklch(0.55 0.22 25)";
const BLUE = "oklch(0.65 0.15 190)";
const MUTED = "oklch(0.55 0.01 260)";
const DASHED = "5,3";

// ─── 1. Head & Shoulders ─────────────────────────────────────────────────────
export function HeadAndShouldersSVG() {
  return (
    <svg
      viewBox="0 0 320 160"
      className="w-full h-auto"
      role="img"
      aria-label="Head and Shoulders"
    >
      <rect width="320" height="160" rx="8" fill={BG} />
      <polyline
        points="10,130 55,90 90,110"
        fill="none"
        stroke={BLUE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <polyline
        points="90,110 130,50 170,110"
        fill="none"
        stroke={BLUE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <polyline
        points="170,110 210,90 250,130"
        fill="none"
        stroke={BLUE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line
        x1="60"
        y1="112"
        x2="245"
        y2="112"
        stroke={RED}
        strokeWidth="1.5"
        strokeDasharray={DASHED}
      />
      <polyline
        points="250,130 278,150"
        fill="none"
        stroke={RED}
        strokeWidth="2"
      />
      <polygon points="278,150 271,140 285,140" fill={RED} />
      <text x="55" y="85" textAnchor="middle" fontSize="9" fill={MUTED}>
        LS
      </text>
      <text x="130" y="43" textAnchor="middle" fontSize="9" fill={BLUE}>
        Head
      </text>
      <text x="210" y="85" textAnchor="middle" fontSize="9" fill={MUTED}>
        RS
      </text>
      <text x="152" y="108" textAnchor="middle" fontSize="8" fill={RED}>
        Neckline
      </text>
      <text x="280" y="158" fontSize="9" fill={RED}>
        Bearish
      </text>
    </svg>
  );
}

// ─── 2. Inverse Head & Shoulders ─────────────────────────────────────────────
export function InverseHeadAndShouldersSVG() {
  return (
    <svg
      viewBox="0 0 320 160"
      className="w-full h-auto"
      role="img"
      aria-label="Inverse Head and Shoulders"
    >
      <rect width="320" height="160" rx="8" fill={BG} />
      <polyline
        points="10,30 55,70 90,50"
        fill="none"
        stroke={BLUE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <polyline
        points="90,50 130,110 170,50"
        fill="none"
        stroke={BLUE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <polyline
        points="170,50 210,70 250,30"
        fill="none"
        stroke={BLUE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line
        x1="60"
        y1="48"
        x2="245"
        y2="48"
        stroke={GREEN}
        strokeWidth="1.5"
        strokeDasharray={DASHED}
      />
      <polyline
        points="250,30 278,12"
        fill="none"
        stroke={GREEN}
        strokeWidth="2"
      />
      <polygon points="278,12 271,22 285,22" fill={GREEN} />
      <text x="55" y="82" textAnchor="middle" fontSize="9" fill={MUTED}>
        LS
      </text>
      <text x="130" y="120" textAnchor="middle" fontSize="9" fill={BLUE}>
        Head
      </text>
      <text x="210" y="82" textAnchor="middle" fontSize="9" fill={MUTED}>
        RS
      </text>
      <text x="152" y="44" textAnchor="middle" fontSize="8" fill={GREEN}>
        Neckline
      </text>
      <text x="275" y="10" fontSize="9" fill={GREEN}>
        Bullish
      </text>
    </svg>
  );
}

// ─── 3. Double Top ────────────────────────────────────────────────────────────
export function DoubleTopSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Double Top"
    >
      <rect width="280" height="140" rx="8" fill={BG} />
      <polyline
        points="10,120 50,55 80,80 115,55 145,120 220,120"
        fill="none"
        stroke={RED}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line
        x1="40"
        y1="82"
        x2="150"
        y2="82"
        stroke={RED}
        strokeWidth="1.5"
        strokeDasharray={DASHED}
      />
      <text x="50" y="48" textAnchor="middle" fontSize="9" fill={MUTED}>
        Peak 1
      </text>
      <text x="115" y="48" textAnchor="middle" fontSize="9" fill={MUTED}>
        Peak 2
      </text>
      <text x="95" y="78" fontSize="8" fill={RED}>
        Neckline
      </text>
      <text x="185" y="135" fontSize="9" fill={RED}>
        ↓ Bearish Reversal
      </text>
    </svg>
  );
}

// ─── 4. Double Bottom ─────────────────────────────────────────────────────────
export function DoubleBottomSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Double Bottom"
    >
      <rect width="280" height="140" rx="8" fill={BG} />
      <polyline
        points="10,20 50,85 80,60 115,85 145,20 220,20"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line
        x1="40"
        y1="58"
        x2="150"
        y2="58"
        stroke={GREEN}
        strokeWidth="1.5"
        strokeDasharray={DASHED}
      />
      <text x="50" y="100" textAnchor="middle" fontSize="9" fill={MUTED}>
        Trough 1
      </text>
      <text x="115" y="100" textAnchor="middle" fontSize="9" fill={MUTED}>
        Trough 2
      </text>
      <text x="90" y="54" fontSize="8" fill={GREEN}>
        Resistance
      </text>
      <text x="185" y="15" fontSize="9" fill={GREEN}>
        ↑ Bullish Reversal
      </text>
    </svg>
  );
}

// ─── 5. Triple Top ────────────────────────────────────────────────────────────
export function TripleTopSVG() {
  return (
    <svg
      viewBox="0 0 320 150"
      className="w-full h-auto"
      role="img"
      aria-label="Triple Top"
    >
      <rect width="320" height="150" rx="8" fill={BG} />
      <polyline
        points="10,130 40,55 65,85 95,55 120,85 150,55 175,130 280,130"
        fill="none"
        stroke={RED}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line
        x1="30"
        y1="85"
        x2="185"
        y2="85"
        stroke={RED}
        strokeWidth="1.5"
        strokeDasharray={DASHED}
      />
      <text x="40" y="48" textAnchor="middle" fontSize="8" fill={MUTED}>
        P1
      </text>
      <text x="95" y="48" textAnchor="middle" fontSize="8" fill={MUTED}>
        P2
      </text>
      <text x="150" y="48" textAnchor="middle" fontSize="8" fill={MUTED}>
        P3
      </text>
      <text x="100" y="80" fontSize="8" fill={RED}>
        Support line
      </text>
      <text x="210" y="144" fontSize="9" fill={RED}>
        ↓ Bearish
      </text>
    </svg>
  );
}

// ─── 6. Triple Bottom ─────────────────────────────────────────────────────────
export function TripleBottomSVG() {
  return (
    <svg
      viewBox="0 0 320 150"
      className="w-full h-auto"
      role="img"
      aria-label="Triple Bottom"
    >
      <rect width="320" height="150" rx="8" fill={BG} />
      <polyline
        points="10,20 40,95 65,65 95,95 120,65 150,95 175,20 280,20"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line
        x1="30"
        y1="65"
        x2="185"
        y2="65"
        stroke={GREEN}
        strokeWidth="1.5"
        strokeDasharray={DASHED}
      />
      <text x="40" y="110" textAnchor="middle" fontSize="8" fill={MUTED}>
        T1
      </text>
      <text x="95" y="110" textAnchor="middle" fontSize="8" fill={MUTED}>
        T2
      </text>
      <text x="150" y="110" textAnchor="middle" fontSize="8" fill={MUTED}>
        T3
      </text>
      <text x="90" y="60" fontSize="8" fill={GREEN}>
        Resistance
      </text>
      <text x="210" y="15" fontSize="9" fill={GREEN}>
        ↑ Bullish
      </text>
    </svg>
  );
}

// ─── 7. Ascending Triangle ────────────────────────────────────────────────────
export function AscendingTriangleSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Ascending Triangle"
    >
      <rect width="280" height="140" rx="8" fill={BG} />
      <line x1="30" y1="45" x2="200" y2="45" stroke={RED} strokeWidth="2" />
      <line x1="30" y1="110" x2="200" y2="50" stroke={GREEN} strokeWidth="2" />
      <polyline
        points="200,45 240,25"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
      />
      <polygon points="240,25 232,35 245,38" fill={GREEN} />
      <text x="105" y="35" textAnchor="middle" fontSize="9" fill={RED}>
        Flat Resistance
      </text>
      <text x="60" y="128" fontSize="9" fill={GREEN}>
        Rising Support
      </text>
      <text x="245" y="20" fontSize="9" fill={GREEN}>
        Break!
      </text>
    </svg>
  );
}

// ─── 8. Descending Triangle ───────────────────────────────────────────────────
export function DescendingTriangleSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Descending Triangle"
    >
      <rect width="280" height="140" rx="8" fill={BG} />
      <line x1="30" y1="100" x2="200" y2="100" stroke={GREEN} strokeWidth="2" />
      <line x1="30" y1="30" x2="200" y2="95" stroke={RED} strokeWidth="2" />
      <polyline
        points="200,100 240,125"
        fill="none"
        stroke={RED}
        strokeWidth="2.5"
      />
      <polygon points="240,125 232,116 246,114" fill={RED} />
      <text x="60" y="22" fontSize="9" fill={RED}>
        Falling Resistance
      </text>
      <text x="100" y="118" textAnchor="middle" fontSize="9" fill={GREEN}>
        Flat Support
      </text>
      <text x="245" y="135" fontSize="9" fill={RED}>
        Break↓
      </text>
    </svg>
  );
}

// ─── 9. Symmetric Triangle ────────────────────────────────────────────────────
export function SymmetricTriangleSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Symmetric Triangle"
    >
      <rect width="280" height="140" rx="8" fill={BG} />
      <line x1="20" y1="25" x2="190" y2="68" stroke={RED} strokeWidth="2" />
      <line x1="20" y1="115" x2="190" y2="72" stroke={GREEN} strokeWidth="2" />
      <polyline
        points="190,70 240,40"
        fill="none"
        stroke={BLUE}
        strokeWidth="2.5"
      />
      <polygon points="240,40 232,50 245,53" fill={BLUE} />
      <text x="100" y="18" textAnchor="middle" fontSize="9" fill={RED}>
        Lower Highs
      </text>
      <text x="100" y="128" textAnchor="middle" fontSize="9" fill={GREEN}>
        Higher Lows
      </text>
      <text x="200" y="70" fontSize="9" fill={MUTED}>
        Apex
      </text>
    </svg>
  );
}

// ─── 10. Bull Flag ────────────────────────────────────────────────────────────
export function BullFlagSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Bull Flag"
    >
      <rect width="280" height="140" rx="8" fill={BG} />
      <line x1="50" y1="120" x2="100" y2="40" stroke={GREEN} strokeWidth="3" />
      <polyline
        points="100,40 130,55 160,45 190,60"
        fill="none"
        stroke={GREEN}
        strokeWidth="2"
      />
      <polyline
        points="100,55 130,70 160,60 190,75"
        fill="none"
        stroke={GREEN}
        strokeWidth="2"
      />
      <polyline
        points="190,60 240,25"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
      />
      <polygon points="240,25 230,36 243,40" fill={GREEN} />
      <text x="50" y="135" fontSize="9" fill={GREEN}>
        Pole
      </text>
      <text x="145" y="85" textAnchor="middle" fontSize="9" fill={GREEN}>
        Flag
      </text>
      <text x="245" y="20" fontSize="9" fill={GREEN}>
        Breakout↑
      </text>
    </svg>
  );
}

// ─── 11. Bearish Flag ─────────────────────────────────────────────────────────
export function BearishFlagSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Bearish Flag"
    >
      <rect width="280" height="140" rx="8" fill={BG} />
      {/* Pole down */}
      <line x1="50" y1="20" x2="100" y2="100" stroke={RED} strokeWidth="3" />
      {/* Flag (sideways/slightly up) */}
      <polyline
        points="100,100 130,85 160,95 190,80"
        fill="none"
        stroke={RED}
        strokeWidth="2"
      />
      <polyline
        points="100,115 130,100 160,110 190,95"
        fill="none"
        stroke={RED}
        strokeWidth="2"
      />
      {/* Continuation down */}
      <polyline
        points="190,90 240,130"
        fill="none"
        stroke={RED}
        strokeWidth="2.5"
      />
      <polygon points="240,130 232,120 245,118" fill={RED} />
      <text x="50" y="18" fontSize="9" fill={RED}>
        Pole↓
      </text>
      <text x="145" y="75" textAnchor="middle" fontSize="9" fill={RED}>
        Flag
      </text>
      <text x="242" y="144" fontSize="9" fill={RED}>
        Continue↓
      </text>
    </svg>
  );
}

// ─── 12. Bull Pennant ─────────────────────────────────────────────────────────
export function BullPennantSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Bull Pennant"
    >
      <rect width="280" height="140" rx="8" fill={BG} />
      {/* Pole up */}
      <line x1="50" y1="120" x2="100" y2="40" stroke={GREEN} strokeWidth="3" />
      {/* Pennant (converging triangle) */}
      <line x1="100" y1="40" x2="180" y2="55" stroke={GREEN} strokeWidth="2" />
      <line x1="100" y1="60" x2="180" y2="52" stroke={GREEN} strokeWidth="2" />
      {/* Breakout up */}
      <polyline
        points="180,54 235,20"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
      />
      <polygon points="235,20 225,30 238,33" fill={GREEN} />
      <text x="60" y="134" fontSize="9" fill={GREEN}>
        Pole
      </text>
      <text x="140" y="72" textAnchor="middle" fontSize="9" fill={GREEN}>
        Pennant
      </text>
      <text x="240" y="16" fontSize="9" fill={GREEN}>
        ↑
      </text>
    </svg>
  );
}

// ─── 13. Bear Pennant ─────────────────────────────────────────────────────────
export function BearPennantSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Bear Pennant"
    >
      <rect width="280" height="140" rx="8" fill={BG} />
      {/* Pole down */}
      <line x1="50" y1="20" x2="100" y2="100" stroke={RED} strokeWidth="3" />
      {/* Pennant (converging) */}
      <line x1="100" y1="100" x2="180" y2="85" stroke={RED} strokeWidth="2" />
      <line x1="100" y1="80" x2="180" y2="88" stroke={RED} strokeWidth="2" />
      {/* Breakout down */}
      <polyline
        points="180,86 235,120"
        fill="none"
        stroke={RED}
        strokeWidth="2.5"
      />
      <polygon points="235,120 226,112 239,110" fill={RED} />
      <text x="50" y="14" fontSize="9" fill={RED}>
        Pole↓
      </text>
      <text x="140" y="70" textAnchor="middle" fontSize="9" fill={RED}>
        Pennant
      </text>
      <text x="240" y="136" fontSize="9" fill={RED}>
        ↓
      </text>
    </svg>
  );
}

// ─── 14. Cup & Handle ─────────────────────────────────────────────────────────
export function CupHandleSVG() {
  return (
    <svg
      viewBox="0 0 300 150"
      className="w-full h-auto"
      role="img"
      aria-label="Cup and Handle"
    >
      <rect width="300" height="150" rx="8" fill={BG} />
      <path
        d="M 20,40 Q 80,120 140,40"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
      />
      <polyline
        points="140,40 160,55 180,45 200,50 220,40"
        fill="none"
        stroke={GREEN}
        strokeWidth="2"
      />
      <polyline
        points="220,40 270,15"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
      />
      <polygon points="270,15 260,26 273,29" fill={GREEN} />
      <line
        x1="20"
        y1="40"
        x2="220"
        y2="40"
        stroke={MUTED}
        strokeWidth="1"
        strokeDasharray={DASHED}
      />
      <text x="80" y="135" textAnchor="middle" fontSize="9" fill={GREEN}>
        Cup (rounded)
      </text>
      <text x="180" y="70" fontSize="9" fill={GREEN}>
        Handle
      </text>
      <text x="275" y="12" fontSize="9" fill={GREEN}>
        ↑
      </text>
    </svg>
  );
}

// ─── 15. Inverse Cup & Handle ─────────────────────────────────────────────────
export function InverseCupHandleSVG() {
  return (
    <svg
      viewBox="0 0 300 150"
      className="w-full h-auto"
      role="img"
      aria-label="Inverse Cup and Handle"
    >
      <rect width="300" height="150" rx="8" fill={BG} />
      <path
        d="M 20,110 Q 80,30 140,110"
        fill="none"
        stroke={RED}
        strokeWidth="2.5"
      />
      <polyline
        points="140,110 160,95 180,105 200,100 220,110"
        fill="none"
        stroke={RED}
        strokeWidth="2"
      />
      <polyline
        points="220,110 270,135"
        fill="none"
        stroke={RED}
        strokeWidth="2.5"
      />
      <polygon points="270,135 260,126 274,123" fill={RED} />
      <line
        x1="20"
        y1="110"
        x2="220"
        y2="110"
        stroke={MUTED}
        strokeWidth="1"
        strokeDasharray={DASHED}
      />
      <text x="80" y="20" textAnchor="middle" fontSize="9" fill={RED}>
        Inv. Cup
      </text>
      <text x="180" y="85" fontSize="9" fill={RED}>
        Handle
      </text>
      <text x="275" y="148" fontSize="9" fill={RED}>
        ↓
      </text>
    </svg>
  );
}

// ─── 16. Rising Wedge ─────────────────────────────────────────────────────────
export function RisingWedgeSVG() {
  return (
    <svg
      viewBox="0 0 280 150"
      className="w-full h-auto"
      role="img"
      aria-label="Rising Wedge"
    >
      <rect width="280" height="150" rx="8" fill={BG} />
      {/* Upper boundary (steeper) */}
      <line x1="20" y1="120" x2="200" y2="30" stroke={RED} strokeWidth="2" />
      {/* Lower boundary (less steep) */}
      <line x1="20" y1="130" x2="200" y2="60" stroke={RED} strokeWidth="2" />
      {/* Price bouncing inside */}
      <polyline
        points="20,128 50,105 80,95 110,80 140,68 165,58 200,45"
        fill="none"
        stroke={BLUE}
        strokeWidth="1.5"
        strokeDasharray="3,2"
      />
      {/* Breakdown */}
      <polyline
        points="200,50 245,100"
        fill="none"
        stroke={RED}
        strokeWidth="2.5"
      />
      <polygon points="245,100 236,90 248,88" fill={RED} />
      <text x="100" y="148" textAnchor="middle" fontSize="9" fill={RED}>
        Rising Wedge = Bearish
      </text>
      <text x="248" y="114" fontSize="9" fill={RED}>
        ↓
      </text>
    </svg>
  );
}

// ─── 17. Falling Wedge ────────────────────────────────────────────────────────
export function FallingWedgeSVG() {
  return (
    <svg
      viewBox="0 0 280 150"
      className="w-full h-auto"
      role="img"
      aria-label="Falling Wedge"
    >
      <rect width="280" height="150" rx="8" fill={BG} />
      {/* Upper boundary */}
      <line x1="20" y1="30" x2="200" y2="90" stroke={GREEN} strokeWidth="2" />
      {/* Lower boundary (steeper) */}
      <line x1="20" y1="60" x2="200" y2="110" stroke={GREEN} strokeWidth="2" />
      {/* Price bouncing inside */}
      <polyline
        points="20,45 50,65 80,75 110,82 140,88 165,95 200,100"
        fill="none"
        stroke={BLUE}
        strokeWidth="1.5"
        strokeDasharray="3,2"
      />
      {/* Breakout up */}
      <polyline
        points="200,95 245,55"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
      />
      <polygon points="245,55 237,66 250,69" fill={GREEN} />
      <text x="100" y="130" textAnchor="middle" fontSize="9" fill={GREEN}>
        Falling Wedge = Bullish
      </text>
      <text x="248" y="50" fontSize="9" fill={GREEN}>
        ↑
      </text>
    </svg>
  );
}

// ─── 18. Rounding Bottom / Saucer ─────────────────────────────────────────────
export function RoundingBottomSVG() {
  return (
    <svg
      viewBox="0 0 300 150"
      className="w-full h-auto"
      role="img"
      aria-label="Rounding Bottom"
    >
      <rect width="300" height="150" rx="8" fill={BG} />
      <path
        d="M 20,35 Q 150,130 280,35"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
      />
      <polyline
        points="280,35 295,15"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
      />
      <polygon points="295,15 286,25 299,28" fill={GREEN} />
      <line
        x1="20"
        y1="35"
        x2="280"
        y2="35"
        stroke={MUTED}
        strokeWidth="1"
        strokeDasharray={DASHED}
      />
      <text x="150" y="145" textAnchor="middle" fontSize="9" fill={GREEN}>
        Slow saucer recovery
      </text>
      <text x="145" y="80" textAnchor="middle" fontSize="9" fill={MUTED}>
        Bowl
      </text>
    </svg>
  );
}

// ─── 19. V-Shape Recovery ─────────────────────────────────────────────────────
export function VShapeRecoverySVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="V-Shape Recovery"
    >
      <rect width="280" height="140" rx="8" fill={BG} />
      <polyline
        points="20,25 140,120 260,25"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <text x="140" y="135" textAnchor="middle" fontSize="9" fill={GREEN}>
        Sharp V reversal
      </text>
      <text x="20" y="18" fontSize="9" fill={MUTED}>
        High
      </text>
      <text x="140" y="118" textAnchor="middle" fontSize="9" fill={RED}>
        Bottom
      </text>
      <text x="240" y="18" fontSize="9" fill={GREEN}>
        Recovery
      </text>
    </svg>
  );
}

// ─── 20. Rectangle Breakout ───────────────────────────────────────────────────
export function RectangleBreakoutSVG() {
  return (
    <svg
      viewBox="0 0 300 140"
      className="w-full h-auto"
      role="img"
      aria-label="Rectangle Breakout"
    >
      <rect width="300" height="140" rx="8" fill={BG} />
      {/* Rectangle range */}
      <rect
        x="40"
        y="55"
        width="160"
        height="50"
        rx="3"
        fill="none"
        stroke={BLUE}
        strokeWidth="1.5"
        strokeDasharray={DASHED}
      />
      {/* Price bouncing inside */}
      <polyline
        points="40,80 70,60 100,95 130,60 160,90 200,80"
        fill="none"
        stroke={BLUE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Breakout */}
      <polyline
        points="200,70 255,30"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
      />
      <polygon points="255,30 246,40 259,43" fill={GREEN} />
      <text x="120" y="50" textAnchor="middle" fontSize="9" fill={BLUE}>
        Resistance
      </text>
      <text x="120" y="120" textAnchor="middle" fontSize="9" fill={BLUE}>
        Support
      </text>
      <text x="258" y="25" fontSize="9" fill={GREEN}>
        Breakout!
      </text>
    </svg>
  );
}

// ─── 21. Diamond Top ──────────────────────────────────────────────────────────
export function DiamondTopSVG() {
  return (
    <svg
      viewBox="0 0 300 150"
      className="w-full h-auto"
      role="img"
      aria-label="Diamond Top"
    >
      <rect width="300" height="150" rx="8" fill={BG} />
      {/* Diamond shape */}
      <polyline
        points="30,75 90,30 150,75 90,120 30,75"
        fill="none"
        stroke={RED}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <polyline
        points="150,75 210,30 270,75 210,120 150,75"
        fill="none"
        stroke={RED}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Breakdown */}
      <polyline
        points="270,75 300,120"
        fill="none"
        stroke={RED}
        strokeWidth="2.5"
      />
      <polygon points="300,120 291,110 304,108" fill={RED} />
      <text x="150" y="145" textAnchor="middle" fontSize="9" fill={RED}>
        Diamond Top — Bearish Reversal
      </text>
    </svg>
  );
}

// ─── 22. Broadening Formation ─────────────────────────────────────────────────
export function BroadeningFormationSVG() {
  return (
    <svg
      viewBox="0 0 280 150"
      className="w-full h-auto"
      role="img"
      aria-label="Broadening Formation"
    >
      <rect width="280" height="150" rx="8" fill={BG} />
      {/* Expanding upper boundary */}
      <line x1="30" y1="60" x2="220" y2="20" stroke={RED} strokeWidth="2" />
      {/* Expanding lower boundary */}
      <line x1="30" y1="90" x2="220" y2="130" stroke={GREEN} strokeWidth="2" />
      {/* Volatile price action */}
      <polyline
        points="30,75 60,55 90,100 120,45 150,115 180,35 220,125"
        fill="none"
        stroke={BLUE}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <text x="140" y="145" textAnchor="middle" fontSize="9" fill={BLUE}>
        Expanding = High Volatility
      </text>
    </svg>
  );
}

// ─── 23. Bump and Run ─────────────────────────────────────────────────────────
export function BumpAndRunSVG() {
  return (
    <svg
      viewBox="0 0 300 150"
      className="w-full h-auto"
      role="img"
      aria-label="Bump and Run"
    >
      <rect width="300" height="150" rx="8" fill={BG} />
      {/* Lead-in (gentle rise) */}
      <line
        x1="20"
        y1="110"
        x2="100"
        y2="80"
        stroke={MUTED}
        strokeWidth="1.5"
        strokeDasharray={DASHED}
      />
      {/* Bump (sharp parabolic top) */}
      <path
        d="M 100,80 Q 140,10 180,80"
        fill="none"
        stroke={RED}
        strokeWidth="2.5"
      />
      {/* Run (selloff below lead-in) */}
      <polyline
        points="180,80 240,120 280,135"
        fill="none"
        stroke={RED}
        strokeWidth="2.5"
      />
      <text x="140" y="6" textAnchor="middle" fontSize="9" fill={MUTED}>
        Bump peak
      </text>
      <text x="240" y="145" fontSize="9" fill={RED}>
        Run↓
      </text>
      <text x="50" y="75" fontSize="8" fill={MUTED}>
        Lead-in
      </text>
    </svg>
  );
}

// ─── 24. Evening Star ─────────────────────────────────────────────────────────
export function EveningStarSVG() {
  return (
    <svg
      viewBox="0 0 220 150"
      className="w-full h-auto"
      role="img"
      aria-label="Evening Star"
    >
      <rect width="220" height="150" rx="8" fill={BG} />
      {/* Candle 1: large green */}
      <line x1="55" y1="35" x2="55" y2="45" stroke={GREEN} strokeWidth="2" />
      <rect x="35" y="45" width="40" height="65" rx="3" fill={GREEN} />
      <line x1="55" y1="110" x2="55" y2="120" stroke={GREEN} strokeWidth="2" />
      {/* Candle 2: small doji */}
      <line x1="110" y1="25" x2="110" y2="38" stroke={BLUE} strokeWidth="2" />
      <rect x="95" y="38" width="30" height="10" rx="2" fill={BLUE} />
      <line x1="110" y1="48" x2="110" y2="58" stroke={BLUE} strokeWidth="2" />
      {/* Candle 3: large red */}
      <line x1="165" y1="38" x2="165" y2="48" stroke={RED} strokeWidth="2" />
      <rect x="145" y="48" width="40" height="65" rx="3" fill={RED} />
      <line x1="165" y1="113" x2="165" y2="123" stroke={RED} strokeWidth="2" />
      <text x="55" y="136" textAnchor="middle" fontSize="8" fill={GREEN}>
        Bull
      </text>
      <text x="110" y="70" textAnchor="middle" fontSize="8" fill={BLUE}>
        Star
      </text>
      <text x="165" y="136" textAnchor="middle" fontSize="8" fill={RED}>
        Bear
      </text>
      <text x="110" y="148" textAnchor="middle" fontSize="9" fill={RED}>
        ↓ Evening Star
      </text>
    </svg>
  );
}

// ─── 25. Morning Star ─────────────────────────────────────────────────────────
export function MorningStarSVG() {
  return (
    <svg
      viewBox="0 0 220 150"
      className="w-full h-auto"
      role="img"
      aria-label="Morning Star"
    >
      <rect width="220" height="150" rx="8" fill={BG} />
      {/* Candle 1: large red */}
      <line x1="55" y1="30" x2="55" y2="40" stroke={RED} strokeWidth="2" />
      <rect x="35" y="40" width="40" height="65" rx="3" fill={RED} />
      <line x1="55" y1="105" x2="55" y2="115" stroke={RED} strokeWidth="2" />
      {/* Candle 2: small doji */}
      <line x1="110" y1="100" x2="110" y2="112" stroke={BLUE} strokeWidth="2" />
      <rect x="95" y="112" width="30" height="10" rx="2" fill={BLUE} />
      <line x1="110" y1="122" x2="110" y2="130" stroke={BLUE} strokeWidth="2" />
      {/* Candle 3: large green */}
      <line x1="165" y1="35" x2="165" y2="45" stroke={GREEN} strokeWidth="2" />
      <rect x="145" y="45" width="40" height="65" rx="3" fill={GREEN} />
      <line
        x1="165"
        y1="110"
        x2="165"
        y2="120"
        stroke={GREEN}
        strokeWidth="2"
      />
      <text x="55" y="130" textAnchor="middle" fontSize="8" fill={RED}>
        Bear
      </text>
      <text x="110" y="143" textAnchor="middle" fontSize="8" fill={BLUE}>
        Star
      </text>
      <text x="165" y="130" textAnchor="middle" fontSize="8" fill={GREEN}>
        Bull
      </text>
      <text x="110" y="148" textAnchor="middle" fontSize="9" fill={GREEN}>
        ↑ Morning Star
      </text>
    </svg>
  );
}

// ─── 26. Three White Soldiers ─────────────────────────────────────────────────
export function ThreeWhiteSoldiersSVG() {
  return (
    <svg
      viewBox="0 0 240 150"
      className="w-full h-auto"
      role="img"
      aria-label="Three White Soldiers"
    >
      <rect width="240" height="150" rx="8" fill={BG} />
      {[0, 1, 2].map((i) => {
        const x = 40 + i * 65;
        const topY = 105 - i * 25;
        const h = 45 + i * 5;
        return (
          <g key={i}>
            <line
              x1={x + 20}
              y1={topY - 8}
              x2={x + 20}
              y2={topY}
              stroke={GREEN}
              strokeWidth="2"
            />
            <rect x={x} y={topY} width="40" height={h} rx="3" fill={GREEN} />
            <line
              x1={x + 20}
              y1={topY + h}
              x2={x + 20}
              y2={topY + h + 6}
              stroke={GREEN}
              strokeWidth="2"
            />
          </g>
        );
      })}
      <text x="120" y="145" textAnchor="middle" fontSize="9" fill={GREEN}>
        ↑ Bullish Momentum
      </text>
    </svg>
  );
}

// ─── 27. Three Black Crows ────────────────────────────────────────────────────
export function ThreeBlackCrowsSVG() {
  return (
    <svg
      viewBox="0 0 240 150"
      className="w-full h-auto"
      role="img"
      aria-label="Three Black Crows"
    >
      <rect width="240" height="150" rx="8" fill={BG} />
      {[0, 1, 2].map((i) => {
        const x = 40 + i * 65;
        const topY = 25 + i * 22;
        const h = 45 + i * 5;
        return (
          <g key={i}>
            <line
              x1={x + 20}
              y1={topY - 6}
              x2={x + 20}
              y2={topY}
              stroke={RED}
              strokeWidth="2"
            />
            <rect x={x} y={topY} width="40" height={h} rx="3" fill={RED} />
            <line
              x1={x + 20}
              y1={topY + h}
              x2={x + 20}
              y2={topY + h + 8}
              stroke={RED}
              strokeWidth="2"
            />
          </g>
        );
      })}
      <text x="120" y="148" textAnchor="middle" fontSize="9" fill={RED}>
        ↓ Bearish Momentum
      </text>
    </svg>
  );
}

// ─── 28. Harami Cross ─────────────────────────────────────────────────────────
export function HaramiCrossSVG() {
  return (
    <svg
      viewBox="0 0 200 150"
      className="w-full h-auto"
      role="img"
      aria-label="Harami Cross"
    >
      <rect width="200" height="150" rx="8" fill={BG} />
      {/* Large red candle */}
      <line x1="65" y1="18" x2="65" y2="28" stroke={RED} strokeWidth="2" />
      <rect x="45" y="28" width="40" height="80" rx="3" fill={RED} />
      <line x1="65" y1="108" x2="65" y2="118" stroke={RED} strokeWidth="2" />
      {/* Small doji inside */}
      <line x1="135" y1="55" x2="135" y2="65" stroke={BLUE} strokeWidth="2" />
      <rect x="118" y="65" width="34" height="4" rx="2" fill={BLUE} />
      <line x1="135" y1="69" x2="135" y2="85" stroke={BLUE} strokeWidth="2" />
      <text x="65" y="134" textAnchor="middle" fontSize="8" fill={RED}>
        Big candle
      </text>
      <text x="135" y="99" textAnchor="middle" fontSize="8" fill={BLUE}>
        Doji inside
      </text>
      <text x="100" y="148" textAnchor="middle" fontSize="9" fill={BLUE}>
        Harami = Indecision
      </text>
    </svg>
  );
}

// ─── 29. Bearish Engulfing ────────────────────────────────────────────────────
export function BearishEngulfingSVG() {
  return (
    <svg
      viewBox="0 0 200 150"
      className="w-full h-auto"
      role="img"
      aria-label="Bearish Engulfing"
    >
      <rect width="200" height="150" rx="8" fill={BG} />
      {/* Small green candle */}
      <line x1="65" y1="40" x2="65" y2="50" stroke={GREEN} strokeWidth="2" />
      <rect x="45" y="50" width="40" height="45" rx="3" fill={GREEN} />
      <line x1="65" y1="95" x2="65" y2="108" stroke={GREEN} strokeWidth="2" />
      {/* Large red engulfing */}
      <line x1="135" y1="28" x2="135" y2="38" stroke={RED} strokeWidth="2" />
      <rect x="115" y="38" width="40" height="75" rx="3" fill={RED} />
      <line x1="135" y1="113" x2="135" y2="123" stroke={RED} strokeWidth="2" />
      <text x="65" y="123" textAnchor="middle" fontSize="8" fill={GREEN}>
        Bullish
      </text>
      <text x="135" y="138" textAnchor="middle" fontSize="8" fill={RED}>
        Engulfs↓
      </text>
      <text x="100" y="148" textAnchor="middle" fontSize="9" fill={RED}>
        ↓ Bearish Reversal
      </text>
    </svg>
  );
}

// ─── 30. Hammer ───────────────────────────────────────────────────────────────
export function HammerSVG() {
  return (
    <svg
      viewBox="0 0 120 140"
      className="w-full max-w-xs mx-auto h-auto"
      role="img"
      aria-label="Hammer candlestick"
    >
      <rect width="120" height="140" rx="8" fill={BG} />
      <line x1="60" y1="15" x2="60" y2="40" stroke={GREEN} strokeWidth="2" />
      <line x1="60" y1="100" x2="60" y2="115" stroke={GREEN} strokeWidth="2" />
      <rect x="40" y="40" width="40" height="60" rx="3" fill={GREEN} />
      <line x1="60" y1="100" x2="60" y2="130" stroke={GREEN} strokeWidth="2" />
      <text x="60" y="12" textAnchor="middle" fontSize="9" fill={MUTED}>
        Small wick
      </text>
      <text x="60" y="138" textAnchor="middle" fontSize="9" fill={GREEN}>
        Long wick = Bullish
      </text>
    </svg>
  );
}

// ─── 31. Doji ─────────────────────────────────────────────────────────────────
export function DojiSVG() {
  return (
    <svg
      viewBox="0 0 120 140"
      className="w-full max-w-xs mx-auto h-auto"
      role="img"
      aria-label="Doji candlestick"
    >
      <rect width="120" height="140" rx="8" fill={BG} />
      <line x1="60" y1="15" x2="60" y2="68" stroke={BLUE} strokeWidth="2" />
      <rect x="38" y="68" width="44" height="4" rx="2" fill={BLUE} />
      <line x1="60" y1="72" x2="60" y2="125" stroke={BLUE} strokeWidth="2" />
      <text x="60" y="12" textAnchor="middle" fontSize="9" fill={MUTED}>
        Upper wick
      </text>
      <text x="60" y="138" textAnchor="middle" fontSize="9" fill={BLUE}>
        Indecision
      </text>
    </svg>
  );
}

// ─── 32. Bullish Engulfing ────────────────────────────────────────────────────
export function BullishEngulfingSVG() {
  return (
    <svg
      viewBox="0 0 200 150"
      className="w-full max-w-xs mx-auto h-auto"
      role="img"
      aria-label="Bullish Engulfing"
    >
      <rect width="200" height="150" rx="8" fill={BG} />
      <line x1="65" y1="35" x2="65" y2="48" stroke={RED} strokeWidth="2" />
      <rect x="45" y="48" width="40" height="50" rx="3" fill={RED} />
      <line x1="65" y1="98" x2="65" y2="110" stroke={RED} strokeWidth="2" />
      <line x1="135" y1="22" x2="135" y2="35" stroke={GREEN} strokeWidth="2" />
      <rect x="115" y="35" width="40" height="78" rx="3" fill={GREEN} />
      <line
        x1="135"
        y1="113"
        x2="135"
        y2="123"
        stroke={GREEN}
        strokeWidth="2"
      />
      <text x="65" y="125" textAnchor="middle" fontSize="9" fill={RED}>
        Bearish
      </text>
      <text x="135" y="138" textAnchor="middle" fontSize="9" fill={GREEN}>
        Engulfs ↑
      </text>
    </svg>
  );
}

// ─── 33. Island Reversal ──────────────────────────────────────────────────────
export function IslandReversalSVG() {
  return (
    <svg
      viewBox="0 0 300 150"
      className="w-full h-auto"
      role="img"
      aria-label="Island Reversal"
    >
      <rect width="300" height="150" rx="8" fill={BG} />
      {/* Uptrend before */}
      <polyline
        points="20,120 80,70"
        fill="none"
        stroke={BLUE}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Gap up - island */}
      <polyline
        points="100,55 130,40 160,55"
        fill="none"
        stroke={RED}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Gap down - selloff */}
      <polyline
        points="180,70 230,100 270,120"
        fill="none"
        stroke={RED}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Gap markers */}
      <text x="90" y="68" fontSize="8" fill={MUTED}>
        Gap↑
      </text>
      <text x="175" y="68" fontSize="8" fill={MUTED}>
        Gap↓
      </text>
      <text x="130" y="35" textAnchor="middle" fontSize="9" fill={RED}>
        Island
      </text>
      <text x="150" y="145" textAnchor="middle" fontSize="9" fill={RED}>
        Isolated — Bearish Signal
      </text>
    </svg>
  );
}

// ─── 34. Uptrend Channel ──────────────────────────────────────────────────────
export function UptrendChannelSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Uptrend Channel"
    >
      <rect width="280" height="140" rx="8" fill={BG} />
      {/* Upper channel line */}
      <line
        x1="20"
        y1="90"
        x2="240"
        y2="20"
        stroke={GREEN}
        strokeWidth="1.5"
        strokeDasharray={DASHED}
      />
      {/* Lower channel line */}
      <line
        x1="20"
        y1="120"
        x2="240"
        y2="50"
        stroke={GREEN}
        strokeWidth="1.5"
        strokeDasharray={DASHED}
      />
      {/* Price bouncing up */}
      <polyline
        points="20,118 60,85 100,70 140,55 180,42 220,28"
        fill="none"
        stroke={GREEN}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <text x="60" y="135" textAnchor="middle" fontSize="9" fill={GREEN}>
        Uptrend Channel
      </text>
      <text x="220" y="18" fontSize="9" fill={GREEN}>
        ↑ Bullish
      </text>
    </svg>
  );
}

// ─── 35. Downtrend Channel ────────────────────────────────────────────────────
export function DowntrendChannelSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Downtrend Channel"
    >
      <rect width="280" height="140" rx="8" fill={BG} />
      {/* Upper channel line */}
      <line
        x1="20"
        y1="20"
        x2="240"
        y2="90"
        stroke={RED}
        strokeWidth="1.5"
        strokeDasharray={DASHED}
      />
      {/* Lower channel line */}
      <line
        x1="20"
        y1="50"
        x2="240"
        y2="120"
        stroke={RED}
        strokeWidth="1.5"
        strokeDasharray={DASHED}
      />
      {/* Price bouncing down */}
      <polyline
        points="20,22 60,55 100,70 140,85 180,98 220,112"
        fill="none"
        stroke={RED}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <text x="60" y="135" textAnchor="middle" fontSize="9" fill={RED}>
        Downtrend Channel
      </text>
      <text x="220" y="128" fontSize="9" fill={RED}>
        ↓ Bearish
      </text>
    </svg>
  );
}

// ─── Pattern registry ─────────────────────────────────────────────────────────
export const ALL_CHART_PATTERNS: ChartPattern[] = [
  {
    id: "head-shoulders",
    name: "Head & Shoulders",
    signal: "Bearish",
    category: "Reversal",
    description:
      "A peak (left shoulder), a higher peak (head), and a lower peak (right shoulder) — all above a neckline support. When price breaks below the neckline, a significant downtrend typically follows.",
    SVG: HeadAndShouldersSVG,
  },
  {
    id: "inverse-head-shoulders",
    name: "Inverse Head & Shoulders",
    signal: "Bullish",
    category: "Reversal",
    description:
      "The mirror image of Head & Shoulders — three troughs with the middle one deepest. A breakout above the neckline signals a major bullish reversal.",
    SVG: InverseHeadAndShouldersSVG,
  },
  {
    id: "double-top",
    name: "Double Top",
    signal: "Bearish",
    category: "Reversal",
    description:
      "Price reaches a high, pulls back, then retests the same high and fails. Two rejected peaks at resistance signal that buyers are exhausted and sellers are taking control.",
    SVG: DoubleTopSVG,
  },
  {
    id: "double-bottom",
    name: "Double Bottom",
    signal: "Bullish",
    category: "Reversal",
    description:
      "Price drops to a low, bounces, then tests the same low and holds. Two rejections at support signal that sellers are exhausted — a bullish reversal is likely.",
    SVG: DoubleBottomSVG,
  },
  {
    id: "triple-top",
    name: "Triple Top",
    signal: "Bearish",
    category: "Reversal",
    description:
      "Three failed attempts to break the same resistance level. The repeated rejection shows strong selling pressure, and a breakdown below support signals a significant reversal.",
    SVG: TripleTopSVG,
  },
  {
    id: "triple-bottom",
    name: "Triple Bottom",
    signal: "Bullish",
    category: "Reversal",
    description:
      "Three failed attempts to push price lower at the same support level. Strong buying at support three times in a row signals a powerful bullish reversal.",
    SVG: TripleBottomSVG,
  },
  {
    id: "ascending-triangle",
    name: "Ascending Triangle",
    signal: "Bullish",
    category: "Continuation",
    description:
      "Flat resistance with a rising support line — buyers are getting more aggressive. A breakout above the flat top usually leads to a sharp bullish move.",
    SVG: AscendingTriangleSVG,
  },
  {
    id: "descending-triangle",
    name: "Descending Triangle",
    signal: "Bearish",
    category: "Continuation",
    description:
      "Flat support with a falling resistance line — sellers are getting more aggressive. A breakdown below the flat bottom typically triggers a sharp sell-off.",
    SVG: DescendingTriangleSVG,
  },
  {
    id: "symmetric-triangle",
    name: "Symmetric Triangle",
    signal: "Continuation",
    category: "Continuation",
    description:
      "Price forms lower highs and higher lows converging at an apex — the market is coiling. A breakout in either direction often leads to a strong directional move.",
    SVG: SymmetricTriangleSVG,
  },
  {
    id: "bull-flag",
    name: "Bull Flag",
    signal: "Bullish",
    category: "Continuation",
    description:
      "A sharp upward move (pole) followed by a brief sideways or slightly downward consolidation (flag). The breakout from the flag continues the prior uptrend.",
    SVG: BullFlagSVG,
  },
  {
    id: "bearish-flag",
    name: "Bearish Flag",
    signal: "Bearish",
    category: "Continuation",
    description:
      "A sharp downward move (pole) followed by a brief sideways or slightly upward consolidation (flag). The breakdown from the flag continues the prior downtrend.",
    SVG: BearishFlagSVG,
  },
  {
    id: "bull-pennant",
    name: "Bull Pennant",
    signal: "Bullish",
    category: "Continuation",
    description:
      "A strong upward spike followed by a small symmetrical triangle (pennant) as the market catches its breath. A breakout above the pennant typically resumes the uptrend.",
    SVG: BullPennantSVG,
  },
  {
    id: "bear-pennant",
    name: "Bear Pennant",
    signal: "Bearish",
    category: "Continuation",
    description:
      "A sharp drop followed by a small converging triangle consolidation. The breakdown from the pennant usually resumes and extends the prior downtrend.",
    SVG: BearPennantSVG,
  },
  {
    id: "cup-handle",
    name: "Cup & Handle",
    signal: "Bullish",
    category: "Continuation",
    description:
      "A rounded U-shaped bottom (cup) followed by a brief pullback (handle) before breaking out. This multi-week pattern signals strong accumulation and often precedes major bull moves.",
    SVG: CupHandleSVG,
  },
  {
    id: "inverse-cup-handle",
    name: "Inverse Cup & Handle",
    signal: "Bearish",
    category: "Reversal",
    description:
      "An inverted U-shaped top (cup) followed by a brief upward bounce (handle) before breaking down. This bearish pattern signals distribution and a likely downside reversal.",
    SVG: InverseCupHandleSVG,
  },
  {
    id: "rising-wedge",
    name: "Rising Wedge",
    signal: "Bearish",
    category: "Reversal",
    description:
      "Price moves upward within converging trendlines — highs and lows both rising, but at different slopes. Despite looking bullish, this pattern often results in a sharp downward breakdown.",
    SVG: RisingWedgeSVG,
  },
  {
    id: "falling-wedge",
    name: "Falling Wedge",
    signal: "Bullish",
    category: "Reversal",
    description:
      "Price falls within converging trendlines — lows and highs both declining. Despite appearing bearish, this is typically a bullish reversal pattern as selling pressure diminishes.",
    SVG: FallingWedgeSVG,
  },
  {
    id: "rounding-bottom",
    name: "Rounding Bottom",
    signal: "Bullish",
    category: "Reversal",
    description:
      "A gradual U-shaped recovery over weeks or months — also called a saucer. This slow transition from selling to buying pressure often precedes sustained long-term uptrends.",
    SVG: RoundingBottomSVG,
  },
  {
    id: "v-shape-recovery",
    name: "V-Shape Recovery",
    signal: "Bullish",
    category: "Reversal",
    description:
      "Price drops sharply then reverses just as sharply with no consolidation period. This aggressive recovery signals a powerful shift in sentiment — often seen after panic selling.",
    SVG: VShapeRecoverySVG,
  },
  {
    id: "rectangle-breakout",
    name: "Rectangle Breakout",
    signal: "Continuation",
    category: "Continuation",
    description:
      "Price bounces between flat support and resistance (a rectangle) for a period of consolidation. A breakout in the direction of the prior trend often leads to a strong measured move.",
    SVG: RectangleBreakoutSVG,
  },
  {
    id: "diamond-top",
    name: "Diamond Top",
    signal: "Bearish",
    category: "Reversal",
    description:
      "A complex pattern resembling a diamond shape — price first broadens then contracts near the top. A breakdown from this formation after a prolonged uptrend signals a powerful bearish reversal.",
    SVG: DiamondTopSVG,
  },
  {
    id: "broadening-formation",
    name: "Broadening Formation",
    signal: "Neutral",
    category: "Reversal",
    description:
      "Price makes progressively higher highs and lower lows, forming an expanding megaphone shape. This pattern signals extreme volatility and indecision — often appears before a major trend change.",
    SVG: BroadeningFormationSVG,
  },
  {
    id: "bump-and-run",
    name: "Bump and Run",
    signal: "Bearish",
    category: "Reversal",
    description:
      "Price slowly trends up (lead-in), then spikes parabolically (bump) before crashing back below the lead-in trend line (run). This exhaustion pattern marks the top of speculative bubbles.",
    SVG: BumpAndRunSVG,
  },
  {
    id: "evening-star",
    name: "Evening Star",
    signal: "Bearish",
    category: "Candlestick",
    description:
      "A 3-candle pattern: large bullish candle, small indecision candle gapping up, then a large bearish candle closing deep into the first candle. This signals a powerful bearish reversal at market tops.",
    SVG: EveningStarSVG,
  },
  {
    id: "morning-star",
    name: "Morning Star",
    signal: "Bullish",
    category: "Candlestick",
    description:
      "A 3-candle pattern: large bearish candle, small indecision candle gapping down, then a large bullish candle closing well into the first. This signals a powerful bullish reversal at market bottoms.",
    SVG: MorningStarSVG,
  },
  {
    id: "three-white-soldiers",
    name: "Three White Soldiers",
    signal: "Bullish",
    category: "Candlestick",
    description:
      "Three consecutive large bullish candles each opening within the prior body and closing higher. This strong momentum pattern confirms a genuine trend reversal from bearish to bullish.",
    SVG: ThreeWhiteSoldiersSVG,
  },
  {
    id: "three-black-crows",
    name: "Three Black Crows",
    signal: "Bearish",
    category: "Candlestick",
    description:
      "Three consecutive large bearish candles each opening within the prior body and closing lower. This powerful momentum pattern confirms the start of a strong downtrend.",
    SVG: ThreeBlackCrowsSVG,
  },
  {
    id: "harami-cross",
    name: "Harami Cross",
    signal: "Neutral",
    category: "Candlestick",
    description:
      "A large candle followed by a small doji that fits completely within the prior candle's body. This inside-candle pattern signals indecision and a potential trend reversal — confirmed by the next candle.",
    SVG: HaramiCrossSVG,
  },
  {
    id: "bearish-engulfing",
    name: "Bearish Engulfing",
    signal: "Bearish",
    category: "Candlestick",
    description:
      "A small bullish candle followed by a larger bearish candle that completely engulfs the first. This pattern after an uptrend signals that sellers have seized control from buyers.",
    SVG: BearishEngulfingSVG,
  },
  {
    id: "hammer",
    name: "Hammer",
    signal: "Bullish",
    category: "Candlestick",
    description:
      "A candle with a small body at the top and a long lower wick at least 2x the body length. The long wick shows sellers pushed price down but buyers rejected the lows — a bullish reversal signal.",
    SVG: HammerSVG,
  },
  {
    id: "doji",
    name: "Doji",
    signal: "Neutral",
    category: "Candlestick",
    description:
      "Open and close prices are almost identical, creating a cross or plus sign shape. A doji represents perfect market indecision — neither buyers nor sellers won the session.",
    SVG: DojiSVG,
  },
  {
    id: "bullish-engulfing",
    name: "Bullish Engulfing",
    signal: "Bullish",
    category: "Candlestick",
    description:
      "A small bearish candle followed by a larger bullish candle that completely engulfs the first. After a downtrend, this pattern signals that buyers have overwhelmed sellers and a reversal is underway.",
    SVG: BullishEngulfingSVG,
  },
  {
    id: "island-reversal",
    name: "Island Reversal",
    signal: "Bearish",
    category: "Reversal",
    description:
      "A cluster of candles isolated between two gaps — a gap up into the island and a gap down out of it. This rare but powerful pattern marks a sharp exhaustion reversal at market tops.",
    SVG: IslandReversalSVG,
  },
  {
    id: "uptrend-channel",
    name: "Uptrend Channel",
    signal: "Bullish",
    category: "Continuation",
    description:
      "Price moves between two parallel upward-sloping trendlines — higher highs and higher lows in a defined channel. Buy near the lower trendline (support) and take profit near the upper trendline (resistance).",
    SVG: UptrendChannelSVG,
  },
  {
    id: "downtrend-channel",
    name: "Downtrend Channel",
    signal: "Bearish",
    category: "Continuation",
    description:
      "Price moves between two parallel downward-sloping trendlines — lower highs and lower lows in a defined bearish channel. Sell near the upper trendline and cover near the lower.",
    SVG: DowntrendChannelSVG,
  },
];

// ─── Filter helpers ────────────────────────────────────────────────────────────
export function getPatternsByCategory(
  category: PatternCategory,
): ChartPattern[] {
  return ALL_CHART_PATTERNS.filter((p) => p.category === category);
}

export function getPatternsBySignal(signal: PatternSignal): ChartPattern[] {
  return ALL_CHART_PATTERNS.filter((p) => p.signal === signal);
}

export function getPatternById(id: string): ChartPattern | undefined {
  return ALL_CHART_PATTERNS.find((p) => p.id === id);
}
