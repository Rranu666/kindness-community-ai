import { useState, useRef } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ArrowUp, ArrowDown } from "lucide-react";

const btnStyle = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  background: "linear-gradient(135deg, #f43f5e, #ec4899)",
  boxShadow: "0 4px 16px rgba(244,63,94,0.4)",
};

export default function KindnessConnect() {
  usePageMeta(
    "Donate & Give | ServeKindness – Kindness Community Foundation",
    "Support causes you love with micro-donations, monthly giving plans, and conscious shopping cashback. Track your real-world impact with KCF's ServeKindness platform."
  );

  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef(null);

  const scroll = (dir) => {
    try {
      iframeRef.current?.contentWindow?.scrollBy({ top: dir * 400, behavior: "smooth" });
    } catch {
      // cross-origin — postMessage fallback
      iframeRef.current?.contentWindow?.postMessage({ type: "scroll", top: dir * 400 }, "*");
    }
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "#f0f0ef" }}>
      {/* Loading skeleton */}
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            background: "#f0f0ef",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "3px solid rgba(0,0,0,0.08)",
              borderTop: "3px solid #10b981",
              animation: "kcf-spin 0.8s linear infinite",
            }}
          />
          <p style={{ color: "#9ca3af", fontSize: 14, margin: 0 }}>Loading ServeKindness…</p>
          <style>{`@keyframes kcf-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src="https://kindness-community-foundation.netlify.app/"
        title="ServeKindness"
        onLoad={() => setLoaded(true)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
          zIndex: 0,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        allow="microphone; camera"
      />

      {/* Centered scroll arrows — overlay on top of iframe */}
      {loaded && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "center",
          }}
        >
          <button style={btnStyle} onClick={() => scroll(-1)} title="Scroll up">
            <ArrowUp size={18} />
          </button>
          <button style={btnStyle} onClick={() => scroll(1)} title="Scroll down">
            <ArrowDown size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
