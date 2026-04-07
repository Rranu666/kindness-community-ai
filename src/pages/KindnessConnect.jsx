import { useState } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function KindnessConnect() {
  usePageMeta(
    "ServeKindness – Structured Volunteering | KCF",
    "ServeKindness makes community service trackable and meaningful. Find volunteer opportunities near you through Kindness Community Foundation."
  );

  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "#030712" }}>
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
            background: "#030712",
            zIndex: 1,
          }}
        >
          {/* Spinner */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.08)",
              borderTop: "3px solid #10b981",
              animation: "kcf-spin 0.8s linear infinite",
            }}
          />
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: 0 }}>Loading ServeKindness…</p>
          <style>{`@keyframes kcf-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      <iframe
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
    </div>
  );
}
