const CREDENTIALS = [
  "Active in crypto markets since 2018. Survived every cycle.",
  "Public identity on Binance Square. Zero anonymous posting.",
  "No paid shills. No sponsored calls. No compromised takes.",
  "DMNZ was built because every other launch was rigged.",
];

export function CredentialsSection() {
  return (
    <section
      data-ocid="credentials.section"
      className="py-16 md:py-20"
      style={{ background: "#0a0a0a" }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2
              className="font-display font-black text-3xl md:text-5xl tracking-tight mb-6"
              style={{ color: "#FFFFFF" }}
            >
              MY <span style={{ color: "#D4AF37" }}>CREDENTIALS</span>
            </h2>
            <p
              className="text-sm font-bold uppercase tracking-wide mb-8"
              style={{ color: "#606060" }}
            >
              Not anonymous. Not hiding. On record.
            </p>
            <a
              href="https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="credentials.binance_button"
              className="btn-primary inline-flex items-center gap-2"
            >
              Verify on Binance Square
            </a>
          </div>

          <div className="flex flex-col gap-3">
            {CREDENTIALS.map((cred, i) => (
              <div
                key={cred}
                data-ocid={`credentials.item.${i + 1}`}
                className="flex items-start gap-4 p-4"
                style={{
                  background: "#111111",
                  borderLeft: "3px solid #D4AF37",
                }}
              >
                <span
                  className="font-mono font-black text-xs mt-0.5 shrink-0"
                  style={{ color: "rgba(212,175,55,0.5)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p
                  className="font-display font-black text-sm uppercase tracking-wide"
                  style={{ color: "#FFFFFF" }}
                >
                  {cred}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
