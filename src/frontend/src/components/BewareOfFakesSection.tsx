import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export function BewareOfFakesSection() {
  return (
    <section
      data-ocid="fakes.section"
      className="py-16 md:py-20"
      style={{
        background: "#0a0a0a",
        borderTop: "3px solid #DC143C",
      }}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <AlertTriangle
              className="w-6 h-6"
              style={{ color: "#DC143C" }}
              aria-hidden="true"
            />
            <h2
              className="font-display font-black text-3xl md:text-5xl tracking-tight"
              style={{ color: "#FFFFFF" }}
            >
              BEWARE OF <span style={{ color: "#DC143C" }}>FAKES</span>
            </h2>
          </div>
          <p
            className="text-xs uppercase tracking-widest"
            style={{ color: "#606060" }}
          >
            Only two sources are real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div
            data-ocid="fakes.real_column"
            className="p-5"
            style={{
              background: "rgba(34,197,94,0.04)",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <h3
              className="font-display font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2"
              style={{ color: "#22c55e" }}
            >
              <CheckCircle className="w-4 h-4" aria-hidden="true" />
              OFFICIAL
            </h3>
            <ul className="flex flex-col gap-3">
              <li
                data-ocid="fakes.real.item.1"
                className="flex items-center gap-2 text-sm font-bold"
                style={{ color: "#FFFFFF" }}
              >
                <CheckCircle
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: "#22c55e" }}
                />
                @Demon_Zeno on Binance Square
              </li>
              <li
                data-ocid="fakes.real.item.2"
                className="flex items-center gap-2 text-sm font-bold"
                style={{ color: "#FFFFFF" }}
              >
                <CheckCircle
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: "#22c55e" }}
                />
                DMNZ on Blum Mini App (Telegram)
              </li>
            </ul>
          </div>

          <div
            data-ocid="fakes.fake_column"
            className="p-5"
            style={{
              background: "rgba(220,20,60,0.04)",
              border: "1px solid rgba(220,20,60,0.2)",
            }}
          >
            <h3
              className="font-display font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2"
              style={{ color: "#DC143C" }}
            >
              <XCircle className="w-4 h-4" aria-hidden="true" />
              FAKE
            </h3>
            <ul className="flex flex-col gap-3">
              <li
                data-ocid="fakes.fake.item.1"
                className="flex items-center gap-2 text-xs"
                style={{ color: "#606060" }}
              >
                <XCircle
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: "#DC143C" }}
                />
                Any other account claiming to be DemonZeno
              </li>
              <li
                data-ocid="fakes.fake.item.2"
                className="flex items-center gap-2 text-xs"
                style={{ color: "#606060" }}
              >
                <XCircle
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: "#DC143C" }}
                />
                Any presale or early access offer
              </li>
              <li
                data-ocid="fakes.fake.item.3"
                className="flex items-center gap-2 text-xs"
                style={{ color: "#606060" }}
              >
                <XCircle
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: "#DC143C" }}
                />
                Any unofficial Telegram group selling DMNZ
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <a
            href="https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="fakes.follow_button"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm"
          >
            Follow the REAL @Demon_Zeno →
          </a>
        </div>
      </div>
    </section>
  );
}
