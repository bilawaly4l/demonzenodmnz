// ─── Chart Pattern SVG Diagrams ──────────────────────────────────────────────
// Inline SVG diagrams for all major chart patterns used in lessons

export function HeadAndShouldersSVG() {
  return (
    <svg
      viewBox="0 0 320 160"
      className="w-full h-auto"
      role="img"
      aria-label="Head and Shoulders pattern"
    >
      <rect width="320" height="160" rx="8" fill="oklch(0.16 0.01 260)" />
      {/* Left shoulder */}
      <polyline
        points="10,130 55,90 90,110"
        fill="none"
        stroke="oklch(0.65 0.15 190)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Head */}
      <polyline
        points="90,110 130,50 170,110"
        fill="none"
        stroke="oklch(0.65 0.15 190)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Right shoulder */}
      <polyline
        points="170,110 210,90 250,130"
        fill="none"
        stroke="oklch(0.65 0.15 190)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Neckline */}
      <line
        x1="60"
        y1="112"
        x2="245"
        y2="112"
        stroke="oklch(0.55 0.22 25)"
        strokeWidth="1.5"
        strokeDasharray="5,3"
      />
      {/* Breakdown arrow */}
      <polyline
        points="250,130 275,148"
        fill="none"
        stroke="oklch(0.55 0.22 25)"
        strokeWidth="2"
      />
      <polygon points="275,148 268,138 282,138" fill="oklch(0.55 0.22 25)" />
      {/* Labels */}
      <text
        x="55"
        y="85"
        textAnchor="middle"
        fontSize="9"
        fill="oklch(0.55 0.01 260)"
      >
        LS
      </text>
      <text
        x="130"
        y="43"
        textAnchor="middle"
        fontSize="9"
        fill="oklch(0.65 0.15 190)"
      >
        Head
      </text>
      <text
        x="210"
        y="85"
        textAnchor="middle"
        fontSize="9"
        fill="oklch(0.55 0.01 260)"
      >
        RS
      </text>
      <text
        x="155"
        y="108"
        textAnchor="middle"
        fontSize="8"
        fill="oklch(0.55 0.22 25)"
      >
        Neckline
      </text>
      <text x="280" y="158" fontSize="9" fill="oklch(0.55 0.22 25)">
        Bearish
      </text>
    </svg>
  );
}

export function DoubleTopSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Double Top pattern"
    >
      <rect width="280" height="140" rx="8" fill="oklch(0.16 0.01 260)" />
      <polyline
        points="10,120 50,55 80,80 115,55 145,120 220,120"
        fill="none"
        stroke="oklch(0.55 0.22 25)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line
        x1="40"
        y1="82"
        x2="150"
        y2="82"
        stroke="oklch(0.55 0.22 25)"
        strokeWidth="1.5"
        strokeDasharray="4,3"
      />
      <text
        x="50"
        y="48"
        textAnchor="middle"
        fontSize="9"
        fill="oklch(0.75 0.01 260)"
      >
        Peak 1
      </text>
      <text
        x="115"
        y="48"
        textAnchor="middle"
        fontSize="9"
        fill="oklch(0.75 0.01 260)"
      >
        Peak 2
      </text>
      <text x="95" y="78" fontSize="8" fill="oklch(0.55 0.22 25)">
        Support / Neckline
      </text>
      <text x="185" y="135" fontSize="9" fill="oklch(0.55 0.22 25)">
        ↓ Bearish Reversal
      </text>
    </svg>
  );
}

export function DoubleBottomSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Double Bottom pattern"
    >
      <rect width="280" height="140" rx="8" fill="oklch(0.16 0.01 260)" />
      <polyline
        points="10,20 50,85 80,60 115,85 145,20 220,20"
        fill="none"
        stroke="oklch(0.65 0.18 145)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line
        x1="40"
        y1="58"
        x2="150"
        y2="58"
        stroke="oklch(0.65 0.18 145)"
        strokeWidth="1.5"
        strokeDasharray="4,3"
      />
      <text
        x="50"
        y="100"
        textAnchor="middle"
        fontSize="9"
        fill="oklch(0.75 0.01 260)"
      >
        Trough 1
      </text>
      <text
        x="115"
        y="100"
        textAnchor="middle"
        fontSize="9"
        fill="oklch(0.75 0.01 260)"
      >
        Trough 2
      </text>
      <text x="95" y="54" fontSize="8" fill="oklch(0.65 0.18 145)">
        Resistance / Neckline
      </text>
      <text x="185" y="15" fontSize="9" fill="oklch(0.65 0.18 145)">
        ↑ Bullish Reversal
      </text>
    </svg>
  );
}

export function AscendingTriangleSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Ascending Triangle pattern"
    >
      <rect width="280" height="140" rx="8" fill="oklch(0.16 0.01 260)" />
      {/* Flat top resistance */}
      <line
        x1="30"
        y1="45"
        x2="200"
        y2="45"
        stroke="oklch(0.55 0.22 25)"
        strokeWidth="2"
      />
      {/* Rising bottom support */}
      <line
        x1="30"
        y1="110"
        x2="200"
        y2="50"
        stroke="oklch(0.65 0.18 145)"
        strokeWidth="2"
      />
      {/* Breakout */}
      <polyline
        points="200,45 240,25"
        fill="none"
        stroke="oklch(0.65 0.18 145)"
        strokeWidth="2.5"
      />
      <polygon points="240,25 232,35 245,38" fill="oklch(0.65 0.18 145)" />
      <text
        x="105"
        y="35"
        textAnchor="middle"
        fontSize="9"
        fill="oklch(0.55 0.22 25)"
      >
        Flat Resistance
      </text>
      <text x="60" y="128" fontSize="9" fill="oklch(0.65 0.18 145)">
        Rising Support
      </text>
      <text x="245" y="20" fontSize="9" fill="oklch(0.65 0.18 145)">
        Break!
      </text>
    </svg>
  );
}

export function DescendingTriangleSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Descending Triangle pattern"
    >
      <rect width="280" height="140" rx="8" fill="oklch(0.16 0.01 260)" />
      {/* Flat bottom support */}
      <line
        x1="30"
        y1="100"
        x2="200"
        y2="100"
        stroke="oklch(0.65 0.18 145)"
        strokeWidth="2"
      />
      {/* Falling top */}
      <line
        x1="30"
        y1="30"
        x2="200"
        y2="95"
        stroke="oklch(0.55 0.22 25)"
        strokeWidth="2"
      />
      {/* Breakdown arrow */}
      <polyline
        points="200,100 240,125"
        fill="none"
        stroke="oklch(0.55 0.22 25)"
        strokeWidth="2.5"
      />
      <polygon points="240,125 232,116 246,114" fill="oklch(0.55 0.22 25)" />
      <text x="60" y="22" fontSize="9" fill="oklch(0.55 0.22 25)">
        Falling Resistance
      </text>
      <text
        x="100"
        y="118"
        textAnchor="middle"
        fontSize="9"
        fill="oklch(0.65 0.18 145)"
      >
        Flat Support
      </text>
      <text x="245" y="135" fontSize="9" fill="oklch(0.55 0.22 25)">
        Break↓
      </text>
    </svg>
  );
}

export function SymmetricTriangleSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Symmetric Triangle"
    >
      <rect width="280" height="140" rx="8" fill="oklch(0.16 0.01 260)" />
      <line
        x1="20"
        y1="25"
        x2="190"
        y2="68"
        stroke="oklch(0.55 0.22 25)"
        strokeWidth="2"
      />
      <line
        x1="20"
        y1="115"
        x2="190"
        y2="72"
        stroke="oklch(0.65 0.18 145)"
        strokeWidth="2"
      />
      <polyline
        points="190,70 240,40"
        fill="none"
        stroke="oklch(0.65 0.15 190)"
        strokeWidth="2.5"
      />
      <polygon points="240,40 232,50 245,53" fill="oklch(0.65 0.15 190)" />
      <text
        x="100"
        y="18"
        textAnchor="middle"
        fontSize="9"
        fill="oklch(0.55 0.22 25)"
      >
        Lower Highs
      </text>
      <text
        x="100"
        y="128"
        textAnchor="middle"
        fontSize="9"
        fill="oklch(0.65 0.18 145)"
      >
        Higher Lows
      </text>
      <text x="200" y="70" fontSize="9" fill="oklch(0.55 0.01 260)">
        Apex
      </text>
      <text x="246" y="35" fontSize="9" fill="oklch(0.65 0.15 190)">
        ↑
      </text>
    </svg>
  );
}

export function BullFlagSVG() {
  return (
    <svg
      viewBox="0 0 280 140"
      className="w-full h-auto"
      role="img"
      aria-label="Bull Flag pattern"
    >
      <rect width="280" height="140" rx="8" fill="oklch(0.16 0.01 260)" />
      {/* Pole */}
      <line
        x1="50"
        y1="120"
        x2="100"
        y2="40"
        stroke="oklch(0.65 0.18 145)"
        strokeWidth="3"
      />
      {/* Flag */}
      <polyline
        points="100,40 130,55 160,45 190,60"
        fill="none"
        stroke="oklch(0.65 0.18 145)"
        strokeWidth="2"
      />
      <polyline
        points="100,55 130,70 160,60 190,75"
        fill="none"
        stroke="oklch(0.65 0.18 145)"
        strokeWidth="2"
      />
      {/* Breakout */}
      <polyline
        points="190,60 240,25"
        fill="none"
        stroke="oklch(0.65 0.18 145)"
        strokeWidth="2.5"
      />
      <polygon points="240,25 230,36 243,40" fill="oklch(0.65 0.18 145)" />
      <text x="50" y="135" fontSize="9" fill="oklch(0.65 0.18 145)">
        Pole
      </text>
      <text
        x="145"
        y="85"
        textAnchor="middle"
        fontSize="9"
        fill="oklch(0.65 0.18 145)"
      >
        Flag
      </text>
      <text x="245" y="20" fontSize="9" fill="oklch(0.65 0.18 145)">
        Breakout↑
      </text>
    </svg>
  );
}

export function CupHandleSVG() {
  return (
    <svg
      viewBox="0 0 300 150"
      className="w-full h-auto"
      role="img"
      aria-label="Cup and Handle pattern"
    >
      <rect width="300" height="150" rx="8" fill="oklch(0.16 0.01 260)" />
      {/* Cup (rounded bottom) */}
      <path
        d="M 20,40 Q 80,120 140,40"
        fill="none"
        stroke="oklch(0.65 0.18 145)"
        strokeWidth="2.5"
      />
      {/* Handle (small consolidation) */}
      <polyline
        points="140,40 160,55 180,45 200,50 220,40"
        fill="none"
        stroke="oklch(0.65 0.18 145)"
        strokeWidth="2"
      />
      {/* Breakout */}
      <polyline
        points="220,40 270,15"
        fill="none"
        stroke="oklch(0.65 0.18 145)"
        strokeWidth="2.5"
      />
      <polygon points="270,15 260,26 273,29" fill="oklch(0.65 0.18 145)" />
      {/* Rim line */}
      <line
        x1="20"
        y1="40"
        x2="220"
        y2="40"
        stroke="oklch(0.55 0.01 260)"
        strokeWidth="1"
        strokeDasharray="4,3"
      />
      <text
        x="80"
        y="135"
        textAnchor="middle"
        fontSize="9"
        fill="oklch(0.65 0.18 145)"
      >
        Cup (rounded)
      </text>
      <text x="180" y="70" fontSize="9" fill="oklch(0.65 0.18 145)">
        Handle
      </text>
      <text x="275" y="12" fontSize="9" fill="oklch(0.65 0.18 145)">
        ↑
      </text>
    </svg>
  );
}

export function HammerSVG() {
  return (
    <svg
      viewBox="0 0 120 140"
      className="w-full max-w-xs mx-auto h-auto"
      role="img"
      aria-label="Hammer candlestick"
    >
      <rect width="120" height="140" rx="8" fill="oklch(0.16 0.01 260)" />
      {/* Wick */}
      <line
        x1="60"
        y1="15"
        x2="60"
        y2="40"
        stroke="oklch(0.65 0.18 145)"
        strokeWidth="2"
      />
      {/* Small body top */}
      <line
        x1="60"
        y1="100"
        x2="60"
        y2="115"
        stroke="oklch(0.65 0.18 145)"
        strokeWidth="2"
      />
      {/* Body */}
      <rect
        x="40"
        y="40"
        width="40"
        height="60"
        rx="3"
        fill="oklch(0.65 0.18 145)"
      />
      {/* Long lower wick */}
      <line
        x1="60"
        y1="100"
        x2="60"
        y2="130"
        stroke="oklch(0.65 0.18 145)"
        strokeWidth="2"
      />
      <text
        x="60"
        y="12"
        textAnchor="middle"
        fontSize="9"
        fill="oklch(0.55 0.01 260)"
      >
        Small wick
      </text>
      <text
        x="60"
        y="138"
        textAnchor="middle"
        fontSize="9"
        fill="oklch(0.65 0.18 145)"
      >
        Long wick = Bullish
      </text>
    </svg>
  );
}

export function DojiSVG() {
  return (
    <svg
      viewBox="0 0 120 140"
      className="w-full max-w-xs mx-auto h-auto"
      role="img"
      aria-label="Doji candlestick"
    >
      <rect width="120" height="140" rx="8" fill="oklch(0.16 0.01 260)" />
      {/* Upper wick */}
      <line
        x1="60"
        y1="15"
        x2="60"
        y2="68"
        stroke="oklch(0.65 0.15 190)"
        strokeWidth="2"
      />
      {/* Body (tiny — almost a line) */}
      <rect
        x="38"
        y="68"
        width="44"
        height="4"
        rx="2"
        fill="oklch(0.65 0.15 190)"
      />
      {/* Lower wick */}
      <line
        x1="60"
        y1="72"
        x2="60"
        y2="125"
        stroke="oklch(0.65 0.15 190)"
        strokeWidth="2"
      />
      <text
        x="60"
        y="12"
        textAnchor="middle"
        fontSize="9"
        fill="oklch(0.55 0.01 260)"
      >
        Upper wick
      </text>
      <text
        x="60"
        y="138"
        textAnchor="middle"
        fontSize="9"
        fill="oklch(0.65 0.15 190)"
      >
        Indecision
      </text>
    </svg>
  );
}

export function BullishEngulfingSVG() {
  return (
    <svg
      viewBox="0 0 180 140"
      className="w-full max-w-xs mx-auto h-auto"
      role="img"
      aria-label="Bullish Engulfing pattern"
    >
      <rect width="180" height="140" rx="8" fill="oklch(0.16 0.01 260)" />
      {/* Small red candle */}
      <line
        x1="60"
        y1="30"
        x2="60"
        y2="45"
        stroke="oklch(0.55 0.22 25)"
        strokeWidth="2"
      />
      <rect
        x="40"
        y="45"
        width="40"
        height="45"
        rx="3"
        fill="oklch(0.55 0.22 25)"
      />
      <line
        x1="60"
        y1="90"
        x2="60"
        y2="105"
        stroke="oklch(0.55 0.22 25)"
        strokeWidth="2"
      />
      {/* Large green engulfing candle */}
      <line
        x1="120"
        y1="20"
        x2="120"
        y2="35"
        stroke="oklch(0.65 0.18 145)"
        strokeWidth="2"
      />
      <rect
        x="100"
        y="35"
        width="40"
        height="75"
        rx="3"
        fill="oklch(0.65 0.18 145)"
      />
      <line
        x1="120"
        y1="110"
        x2="120"
        y2="120"
        stroke="oklch(0.65 0.18 145)"
        strokeWidth="2"
      />
      <text
        x="60"
        y="120"
        textAnchor="middle"
        fontSize="9"
        fill="oklch(0.55 0.22 25)"
      >
        Bearish
      </text>
      <text
        x="120"
        y="132"
        textAnchor="middle"
        fontSize="9"
        fill="oklch(0.65 0.18 145)"
      >
        Engulfs ↑
      </text>
    </svg>
  );
}
