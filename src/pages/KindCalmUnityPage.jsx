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

export default function KindCalmUnityPage() {
  usePageMeta(
    "KindCalmUnity – Cooperative Community Living | KCF",
    "KindCalmUnity is a cooperative community platform where families share meals, childcare, gardening, carpools and activities — so everyone gives, rests and thrives."
  );

  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef(null);

  const scroll = (dir) => {
    iframeRef.current?.contentWindow?.scrollBy({ top: dir * 400, behavior: "smooth" });
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "#0a1a06" }}>
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
            background: "#0a1a06",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.08)",
              borderTop: "3px solid #6aaa52",
              animation: "kcu-spin 0.8s linear infinite",
            }}
          />
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>Loading KindCalmUnity…</p>
          <style>{`@keyframes kcu-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src="/kindcalmunity-app.html"
        title="KindCalmUnity"
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
