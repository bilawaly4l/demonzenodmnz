import { Download } from "lucide-react";

const WALLPAPERS = [
  {
    id: "mobile-1",
    label: "Mobile Wallpaper 1",
    size: "1080 × 1920",
    type: "Mobile",
    src: "/assets/generated/dmnz-wallpaper-mobile-1.dim_1080x1920.jpg",
    filename: "DMNZ-Wallpaper-Mobile-1.jpg",
  },
  {
    id: "mobile-2",
    label: "Mobile Wallpaper 2",
    size: "1080 × 1920",
    type: "Mobile",
    src: "/assets/generated/dmnz-wallpaper-mobile-2.dim_1080x1920.jpg",
    filename: "DMNZ-Wallpaper-Mobile-2.jpg",
  },
  {
    id: "desktop-1",
    label: "Desktop Wallpaper 1",
    size: "1920 × 1080",
    type: "Desktop",
    src: "/assets/generated/dmnz-wallpaper-desktop-1.dim_1920x1080.jpg",
    filename: "DMNZ-Wallpaper-Desktop-1.jpg",
  },
  {
    id: "desktop-2",
    label: "Desktop Wallpaper 2",
    size: "1920 × 1080",
    type: "Desktop",
    src: "/assets/generated/dmnz-wallpaper-desktop-2.dim_1920x1080.jpg",
    filename: "DMNZ-Wallpaper-Desktop-2.jpg",
  },
];

async function downloadWallpaper(src: string, filename: string) {
  try {
    const res = await fetch(src);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    window.open(src, "_blank");
  }
}

export function WallpapersSection() {
  return (
    <section
      data-ocid="wallpapers.section"
      className="py-16 md:py-20"
      style={{ background: "oklch(0.10 0.01 260)" }}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full"
            style={{
              background: "oklch(0.62 0.16 190 / 0.10)",
              border: "1px solid oklch(0.62 0.16 190 / 0.30)",
            }}
          >
            <Download
              className="w-3.5 h-3.5"
              style={{ color: "oklch(0.62 0.16 190)" }}
            />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "oklch(0.62 0.16 190)" }}
            >
              Free Downloads
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
            DMNZ{" "}
            <span style={{ color: "oklch(0.62 0.16 190)" }}>Wallpapers</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Represent DMNZ on your screen. Free branded wallpapers for mobile
            and desktop.
          </p>
        </div>

        <div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          data-ocid="wallpapers.grid"
        >
          {WALLPAPERS.map(({ id, label, size, type, src, filename }) => (
            <div
              key={id}
              data-ocid={`wallpapers.item.${id}`}
              className="group flex flex-col rounded-2xl overflow-hidden"
              style={{
                background: "oklch(0.14 0.015 260)",
                border: "1px solid oklch(0.22 0.01 260)",
              }}
            >
              {/* Preview */}
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: type === "Mobile" ? "9/16" : "16/9" }}
              >
                <img
                  src={src}
                  alt={label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                  style={{ background: "oklch(0.10 0.01 260 / 0.6)" }}
                >
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{
                      background: "oklch(0.62 0.16 190)",
                      color: "oklch(0.10 0.01 260)",
                    }}
                  >
                    Preview
                  </span>
                </div>
              </div>

              {/* Info + download */}
              <div className="p-4 flex flex-col gap-3">
                <div>
                  <p className="font-display font-bold text-foreground text-sm">
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {size} · {type}
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid={`wallpapers.download.${id}`}
                  onClick={() => downloadWallpaper(src, filename)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: "oklch(0.62 0.16 190 / 0.12)",
                    border: "1px solid oklch(0.62 0.16 190 / 0.35)",
                    color: "oklch(0.62 0.16 190)",
                  }}
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
