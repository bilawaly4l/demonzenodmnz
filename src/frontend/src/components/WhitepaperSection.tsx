import { Download, FileText } from "lucide-react";

const WHITEPAPER_SECTIONS = [
  { num: "01", title: "Project Vision" },
  { num: "02", title: "Fair Launch Model" },
  { num: "03", title: "Tokenomics-Free Approach" },
  { num: "04", title: "Burn Mechanism" },
  { num: "05", title: "Public Roadmap" },
  { num: "06", title: "Risk Disclosure" },
];

function generatePDF() {
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>DMNZ Whitepaper</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Space+Grotesk:wght@700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #0a0a0a; color: #fff; font-family: 'Inter', sans-serif; padding: 0; }
    .cover { background: #0a0a0a; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 60px 40px; page-break-after: always; border-bottom: 3px solid #DC143C; }
    .cover-title { font-family: 'Space Grotesk', sans-serif; font-weight: 900; font-size: 52px; color: #fff; letter-spacing: -2px; line-height: 1.1; margin-bottom: 12px; }
    .cover-title span { color: #DC143C; }
    .cover-sub { font-size: 18px; color: #A0A0A0; margin-bottom: 40px; }
    .cover-badge { display: inline-block; background: rgba(220,20,60,0.1); border: 1px solid rgba(220,20,60,0.4); color: #DC143C; padding: 8px 20px; font-weight: 700; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; }
    .cover-meta { margin-top: 40px; color: #606060; font-size: 12px; line-height: 2; }
    .content { padding: 60px; max-width: 800px; margin: 0 auto; }
    .section-block { margin-bottom: 48px; }
    .section-num { font-family: 'Space Grotesk', sans-serif; font-size: 11px; color: #DC143C; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 8px; }
    .section-title { font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 24px; color: #fff; margin-bottom: 16px; border-bottom: 1px solid rgba(220,20,60,0.2); padding-bottom: 8px; }
    .section-body { color: #C0C0C0; font-size: 14px; line-height: 1.8; white-space: pre-wrap; }
    .footer { text-align: center; padding: 40px; border-top: 1px solid rgba(255,255,255,0.08); color: #606060; font-size: 11px; line-height: 2; }
    .footer span { color: #DC143C; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="cover">
    <div class="cover-title">DMNZ \u2014 THE <span>DEMONZENO</span> TOKEN</div>
    <div class="cover-sub">A Fair Launch Meme Token on Blum</div>
    <div class="cover-badge">Official Whitepaper · Version 1.0</div>
    <div class="cover-meta">Created by DemonZeno · @Demon_Zeno on Binance Square<br/>Twitter: @ZenoDemon<br/>Launch Date: April 2, 2027 · Blum Mini App<br/>Burn Date: January 1, 2028</div>
  </div>
  <div class="content">
    <div class="section-block"><div class="section-num">Section 01</div><div class="section-title">Introduction</div><div class="section-body">DMNZ is a fair-launch meme token created by DemonZeno (@Demon_Zeno on Binance Square) and launched exclusively through the Blum Mini App on Telegram on April 2, 2027. This document explains what DMNZ is, why it exists, and what it commits to. It is not a financial prospectus. It is a declaration of intent.</div></div>
    <div class="section-block"><div class="section-num">Section 02</div><div class="section-title">The Vision</div><div class="section-body">DemonZeno created DMNZ to prove one thing: a meme token can be launched with integrity. No presale. No team allocation. No insider buys. No hidden wallets. Just a token that launches fairly, builds a community, and delivers on what it promises.\n\nDMNZ is not trying to compete with Bitcoin or Ethereum. It is a meme token. But it will be the most honest meme token in existence.</div></div>
    <div class="section-block"><div class="section-num">Section 03</div><div class="section-title">Why No Tokenomics?</div><div class="section-body">Tokenomics documents are tools for deception. They create the illusion of planning while hiding massive allocations for founders, VCs, and insiders. DMNZ rejects this entirely.\n\nThe supply exists. It launches on Blum. Every buyer enters at the same price via the bonding curve. There is nothing to allocate because there is nothing to hide.</div></div>
    <div class="section-block"><div class="section-num">Section 04</div><div class="section-title">The Fair Launch Model</div><div class="section-body">DMNZ launches on Blum Mini App (Telegram) on April 2, 2027. The bonding curve determines price \u2014 not DemonZeno, not a team, not any insider. When you buy, you are buying from the curve. When others buy after you, the price rises.\n\nThis is the purest form of market-determined price discovery. No one gets a better entry than you based on who they know.</div></div>
    <div class="section-block"><div class="section-num">Section 05</div><div class="section-title">The Burn Mechanism</div><div class="section-body">On January 1, 2028, DemonZeno commits to a massive buyback and burn of DMNZ tokens. This event is designed to permanently reduce the circulating supply, creating scarcity and rewarding early holders who believed before the mainstream discovered DMNZ.\n\nThe burn is a promise. It is documented here. It will happen.</div></div>
    <div class="section-block"><div class="section-num">Section 06</div><div class="section-title">Who Is DemonZeno?</div><div class="section-body">DemonZeno is a public figure on Binance Square (@Demon_Zeno). His identity is not anonymous. His posting history, community engagement, and public statements are all verifiable.\n\nHe is not a developer hiding behind a project. He is a creator who stands behind everything DMNZ commits to.</div></div>
    <div class="section-block"><div class="section-num">Section 07</div><div class="section-title">Roadmap</div><div class="section-body">2026: Community Building Year\n  \u2014 Growing the DMNZ community on Binance Square before launch\n\nApril 2, 2027: DMNZ goes live on Blum Mini App\n  \u2014 Fair launch via bonding curve\n  \u2014 Contract address published publicly on launch day\n\nJanuary 1, 2028: Massive buyback and burn\n  \u2014 Permanent reduction of circulating supply</div></div>
    <div class="section-block"><div class="section-num">Section 08</div><div class="section-title">Risks</div><div class="section-body">DMNZ is a meme token. Meme tokens are volatile. You can lose everything you invest. Do not invest money you cannot afford to lose.\n\nThis is not financial advice. DMNZ makes no guarantees of price performance.</div></div>
    <div class="section-block"><div class="section-num">Section 09</div><div class="section-title">Disclaimer</div><div class="section-body">DMNZ is a meme coin created for entertainment and community purposes. It is not a security, not an investment product, and not a financial instrument. Nothing on this site or in this document constitutes financial advice. DemonZeno is not a financial advisor. Buy DMNZ at your own risk.</div></div>
  </div>
  <div class="footer"><span>DMNZ</span> \u2014 @Demon_Zeno on Binance Square · Twitter: @ZenoDemon<br/>Launch: April 2, 2027 · Burn: January 1, 2028 · Platform: Blum Mini App<br/>This document is a public commitment. Not financial advice.</div>
  <script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
}

export function WhitepaperSection() {
  return (
    <section
      data-ocid="whitepaper.section"
      className="py-16 md:py-20"
      style={{ background: "#0a0a0a" }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <FileText
              className="w-6 h-6"
              style={{ color: "#DC143C" }}
              aria-hidden="true"
            />
            <h2
              className="font-display font-black text-3xl md:text-5xl tracking-tight"
              style={{ color: "#FFFFFF" }}
            >
              THE DMNZ <span style={{ color: "#DC143C" }}>WHITEPAPER</span>
            </h2>
          </div>
          <p
            className="font-display font-black text-sm uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            EVERYTHING DMNZ STANDS FOR. IN ONE DOCUMENT.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div
            className="p-5"
            style={{
              background: "#111111",
              border: "1px solid rgba(220,20,60,0.2)",
            }}
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "#DC143C" }}
            >
              WHAT&apos;S COVERED
            </p>
            <ul className="flex flex-col gap-2.5">
              {WHITEPAPER_SECTIONS.map((s) => (
                <li key={s.num} className="flex items-center gap-3">
                  <span
                    className="font-mono text-xs font-bold shrink-0"
                    style={{ color: "#DC143C" }}
                  >
                    {s.num}
                  </span>
                  <p
                    className="text-sm font-bold uppercase tracking-wide"
                    style={{ color: "#FFFFFF" }}
                  >
                    {s.title}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <div
              className="p-5 flex-1"
              style={{
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <dl className="flex flex-col gap-2 text-sm">
                {(
                  [
                    ["Author", "DemonZeno"],
                    ["Published", "2026"],
                    ["Version", "1.0"],
                    ["Platform", "Blum Mini App"],
                    ["Launch", "April 2, 2027"],
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt
                      className="text-xs uppercase tracking-widest"
                      style={{ color: "#606060" }}
                    >
                      {label}
                    </dt>
                    <dd
                      className="text-xs font-bold"
                      style={{ color: "#FFFFFF" }}
                    >
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <button
              type="button"
              onClick={generatePDF}
              data-ocid="whitepaper.download_button"
              className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-sm"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              DOWNLOAD WHITEPAPER (PDF)
            </button>
          </div>
        </div>

        <div
          className="py-3 px-4 text-center"
          style={{
            background: "rgba(220,20,60,0.04)",
            border: "1px solid rgba(220,20,60,0.12)",
          }}
        >
          <p className="text-xs" style={{ color: "#606060" }}>
            Public commitment, not financial advice. DMNZ is a meme coin.
          </p>
        </div>
      </div>
    </section>
  );
}
