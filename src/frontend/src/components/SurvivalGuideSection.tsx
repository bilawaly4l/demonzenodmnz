import { Download, FileText } from "lucide-react";

function generateSurvivalGuidePDF() {
  const content = `
    <html>
    <head>
      <title>DMNZ Survival Guide</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0e1a; color: #e8eaf0; margin: 0; padding: 40px; }
        .header { text-align: center; border-bottom: 2px solid #62dcc8; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 3rem; font-weight: 900; color: #62dcc8; letter-spacing: -1px; }
        .subtitle { color: #8892a4; font-size: 1rem; margin-top: 5px; }
        h2 { color: #62dcc8; font-size: 1.2rem; margin-top: 30px; border-left: 3px solid #62dcc8; padding-left: 12px; }
        p, li { color: #b0bac8; font-size: 0.9rem; line-height: 1.7; }
        .step { background: #12182a; border: 1px solid #1e2d3d; border-radius: 8px; padding: 15px; margin: 10px 0; }
        .step-num { color: #62dcc8; font-weight: 900; font-size: 1.2rem; }
        .warning { background: #1a1206; border: 1px solid #9a6210; border-radius: 8px; padding: 15px; margin: 15px 0; }
        .warning-title { color: #e8a020; font-weight: 700; }
        .footer { margin-top: 40px; text-align: center; border-top: 1px solid #1e2d3d; padding-top: 20px; color: #444e5a; font-size: 0.8rem; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background: #12182a; color: #62dcc8; padding: 10px; text-align: left; font-size: 0.85rem; }
        td { padding: 8px 10px; border-top: 1px solid #1e2d3d; font-size: 0.85rem; color: #8892a4; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">DMNZ</div>
        <div class="subtitle">DemonZeno Token \u2022 Survival Guide</div>
        <div style="color:#8892a4;font-size:0.8rem;margin-top:8px;">The only guide you need before April 2, 2027</div>
      </div>
      <h2>What is DMNZ?</h2>
      <p>DemonZeno (DMNZ) is a meme token launching April 2, 2027 via Blum Mini App on Telegram. 100% fair launch \u2014 no presale, no team allocation, no insider advantage.</p>
      <h2>How to Buy DMNZ</h2>
      <div class="step"><span class="step-num">01</span> Follow <strong style="color:#e8c04a">@Demon_Zeno</strong> on Binance Square for all launch alerts.</div>
      <div class="step"><span class="step-num">02</span> Install Telegram. Open the Blum Mini App.</div>
      <div class="step"><span class="step-num">03</span> On April 2, 2027 \u2014 search <strong>DemonZeno DMNZ</strong> inside Blum and buy.</div>
      <h2>The Roadmap</h2>
      <table>
        <tr><th>Date</th><th>Milestone</th><th>Status</th></tr>
        <tr><td>2026</td><td>Community Building Year</td><td>In Progress</td></tr>
        <tr><td>Apr 2, 2027</td><td>DMNZ Fair Launch on Blum</td><td>Upcoming</td></tr>
        <tr><td>Jan 1, 2028</td><td>Huge Buyback &amp; Burn Event</td><td>Planned</td></tr>
      </table>
      <h2>Key Terms</h2>
      <p><strong style="color:#62dcc8">Bonding Curve:</strong> Price rises as more tokens are bought.<br>
      <strong style="color:#62dcc8">Burn:</strong> Tokens permanently removed \u2014 supply cut 50% in January 2028.<br>
      <strong style="color:#62dcc8">Fair Launch:</strong> Everyone enters at the same price. No presale.</p>
      <div class="warning">
        <div class="warning-title">DISCLAIMER</div>
        <p>DMNZ is a meme coin. Not financial advice. Never invest more than you can afford to lose.</p>
      </div>
      <div class="footer">
        <p>DemonZeno \u2022 DMNZ Token \u2022 @Demon_Zeno on Binance Square</p>
        <p>"Trade Like a God. Hold Like a Demon."</p>
      </div>
    </body>
    </html>
  `;

  const w = window.open("", "_blank");
  if (w) {
    w.document.write(content);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  }
}

export function SurvivalGuideSection() {
  return (
    <section
      data-ocid="survival_guide.section"
      className="py-16 md:py-20"
      style={{ background: "oklch(0.10 0.01 260)" }}
    >
      <div className="container mx-auto px-4 max-w-xl text-center">
        <div
          className="inline-flex items-center gap-2 mb-4 px-3 py-1"
          style={{
            background: "oklch(0.62 0.16 190 / 0.10)",
            border: "1px solid oklch(0.62 0.16 190 / 0.30)",
          }}
        >
          <FileText
            className="w-3.5 h-3.5"
            style={{ color: "oklch(0.62 0.16 190)" }}
          />
          <span
            className="text-xs font-black uppercase tracking-widest"
            style={{ color: "oklch(0.62 0.16 190)" }}
          >
            Free Guide
          </span>
        </div>

        <h2
          className="font-display font-black text-4xl md:text-5xl tracking-tight mb-2"
          style={{ color: "#FFFFFF" }}
        >
          DMNZ SURVIVAL GUIDE
        </h2>
        <p
          className="text-xs font-bold uppercase tracking-widest mb-8"
          style={{ color: "oklch(0.62 0.16 190)" }}
        >
          Everything you need before April 2, 2027.
        </p>

        <button
          type="button"
          data-ocid="survival_guide.download_button"
          onClick={generateSurvivalGuidePDF}
          className="inline-flex items-center gap-2.5 px-8 py-4 font-black text-sm uppercase tracking-widest transition-all duration-200 hover:opacity-90"
          style={{
            background: "oklch(0.62 0.16 190)",
            color: "oklch(0.10 0.01 260)",
          }}
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <p className="text-xs text-muted-foreground mt-3">
          Opens print dialog — save as PDF
        </p>
      </div>
    </section>
  );
}
