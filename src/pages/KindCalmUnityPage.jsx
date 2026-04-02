import { usePageMeta } from "@/hooks/usePageMeta";

export default function KindCalmUnityPage() {
  usePageMeta(
    "KindCalmUnity – Cooperative Community Living | KCF",
    "KindCalmUnity is a cooperative community platform where families share meals, childcare, gardening, carpools and activities — so everyone gives, rests and thrives."
  );
  // Render the standalone KindCalmUnity app in a full-screen iframe.
  // The React shell (App.jsx) stays mounted, so KindraWebBot floats on top.
  return (
    <iframe
      src="/kindcalmunity-app.html"
      style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
      title="KindCalmUnity – Cooperative Community Living"
    />
  );
}
