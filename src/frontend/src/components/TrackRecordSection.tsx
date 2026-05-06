import { ExternalLink } from "lucide-react";
import { SiBinance } from "react-icons/si";

const STATS = [
  { number: "7+", label: "YEARS IN MARKETS" },
  { number: "500+", label: "BINANCE SQUARE POSTS" },
  { number: "0", label: "RUG PULLS" },
  { number: "100%", label: "PUBLIC IDENTITY" },
];

export function TrackRecordSection() {
  return (
    <section
      id="track-record"
      data-ocid="track_record.section"
      className="py-16 md:py-20"
      style={{ background: "#0d0d0d" }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-10">
          <h2
            className="font-display font-black text-3xl md:text-5xl tracking-tight"
            style={{ color: "#FFFFFF" }}
          >
            DEMONZENO&apos;S{" "}
            <span style={{ color: "#DC143C" }}>TRACK RECORD</span>
          </h2>
          <p
            className="text-xs uppercase tracking-widest mt-2"
            style={{ color: "#606060" }}
          >
            Before DMNZ, there was a record. It&apos;s clean.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              data-ocid={`track_record.signal.item.${i + 1}`}
              className="flex flex-col items-center justify-center p-5 text-center"
              style={{
                background: "#111111",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="font-display font-black text-3xl md:text-4xl mb-1"
                style={{ color: "#DC143C" }}
              >
                {stat.number}
              </div>
              <div
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "#606060" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <a
          href="https://app.binance.com/uni-qr/cpro/Demon_Zeno?l=en&r=KGTBUDHQ&uc=app_square_share_link&us=copylink"
          target="_blank"
          rel="noopener noreferrer"
          data-ocid="track_record.binance.link"
          className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest transition-smooth"
          style={{ color: "#606060" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "#DC143C";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "#606060";
          }}
        >
          <SiBinance className="w-4 h-4" style={{ color: "#DC143C" }} />
          See the record on Binance Square
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
