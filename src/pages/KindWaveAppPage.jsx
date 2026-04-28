import { usePageMeta } from "@/hooks/usePageMeta";
import Header from "@/components/kcf/Header";
import Footer from "@/components/kcf/Footer";
import KindWaveApp from "@/components/kindwave/KindWaveApp";

export default function KindWaveAppPage() {
  usePageMeta(
    "KindWave — Real-Time Community Kindness Map | KCF",
    "Find and offer help in your neighborhood with KindWave, the real-time kindness map by Kindness Community Foundation."
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f0f0ef" }}>
      <Header />
      <KindWaveApp />
      <Footer />
    </div>
  );
}
