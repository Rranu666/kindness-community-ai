import { useEffect } from "react";
import Header from "@/components/kcf/Header";
import Footer from "@/components/kcf/Footer";
import KindWaveApp from "@/components/kindwave/KindWaveApp";

export default function KindWaveAppPage() {
  // Clean up KindWave's injected <style> tag on unmount to prevent SPA style leakage
  useEffect(() => {
    return () => {
      document.head.querySelectorAll("style").forEach((el) => {
        if (el.textContent.includes("Plus Jakarta Sans")) el.remove();
      });
    };
  }, []);

  return (
    // --kw-offset is read by KindWaveApp's root containers via calc(100vh - var(--kw-offset, 0px))
    <div style={{ background: "#02040f", width: "100%", minHeight: "100vh", "--kw-offset": "80px" }}>
      <Header />

      {/* Stage — full viewport behind the phone frame */}
      <div style={{
        paddingTop: "80px",
        width: "100%",
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,232,180,0.05) 0%, transparent 65%)," +
          "radial-gradient(ellipse 40% 40% at 20% 60%, rgba(133,128,255,0.04) 0%, transparent 60%)," +
          "radial-gradient(ellipse 40% 40% at 80% 60%, rgba(0,232,180,0.03) 0%, transparent 60%)",
      }}>
        {/* Decorative grid lines — desktop only */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        {/* Phone frame — max 480 px on desktop, full-width on mobile */}
        <div style={{
          width: "100%",
          maxWidth: "480px",
          height: "calc(100vh - 80px)",
          position: "relative",
          // Subtle side borders + glow to read as a device on wide screens
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          boxShadow:
            "0 0 0 1px rgba(0,232,180,0.06)," +
            "0 0 60px rgba(0,232,180,0.07)," +
            "-60px 0 120px rgba(0,0,0,0.5)," +
            "60px 0 120px rgba(0,0,0,0.5)",
          overflow: "hidden",
          zIndex: 1,
        }}>
          <KindWaveApp />
        </div>
      </div>

      <Footer hideCta />
    </div>
  );
}
