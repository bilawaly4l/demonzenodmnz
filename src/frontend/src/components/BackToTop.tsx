import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!visible) return null;

  return (
    <button
      type="button"
      data-ocid="back_to_top.button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className="btn-back-to-top btn-micro group"
      title="Back to top"
    >
      <ArrowUp
        className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5"
        strokeWidth={2.5}
      />
      {/* Glow ring on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: "0 0 16px oklch(0.65 0.15 190 / 0.5)",
        }}
      />
    </button>
  );
}
