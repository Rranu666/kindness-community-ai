import { useState } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function KindCalmUnityPage() {
  usePageMeta(
    "KindCalmUnity – Cooperative Community Living | KCF",
    "KindCalmUnity is a cooperative community platform where families share meals, childcare, gardening, carpools and activities — so everyone gives, rests and thrives."
  );

  const [loaded, setLoaded] = useState(false);

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
    </div>
  );
}
