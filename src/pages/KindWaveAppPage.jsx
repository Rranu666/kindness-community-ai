import { useEffect } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import Header from "@/components/kcf/Header";
import Footer from "@/components/kcf/Footer";
import KindWaveApp from "@/components/kindwave/KindWaveApp";

export default function KindWaveAppPage() {
  usePageMeta(
    "KindWave App – Real-Time Community Kindness Map | KCF",
    "KindWave connects neighbours in real time — find help or offer support on the live community kindness map. Powered by Kindness Community Foundation."
  );

  // Force dark body so the transparent header never shows white
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = "#02040f";
    return () => { document.body.style.background = prev; };
  }, []);

  return (
    <div style={{ background: "#02040f", minHeight: "100vh" }}>
      <Header />

      {/* App — centered at its natural mobile width, full height between header and footer */}
      <div style={{
        marginTop: 80,
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "32px 16px 48px",
      }}>
        <div style={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
          minHeight: "calc(100vh - 200px)",
          display: "flex",
          flexDirection: "column",
        }}>
          <KindWaveApp />
        </div>
      </div>

      <Footer hideCta />
    </div>
  );
}
