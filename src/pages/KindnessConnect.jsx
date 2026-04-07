import { usePageMeta } from "@/hooks/usePageMeta";

export default function KindnessConnect() {
  usePageMeta(
    "ServeKindness – Structured Volunteering | KCF",
    "ServeKindness makes community service trackable and meaningful. Find volunteer opportunities near you through Kindness Community Foundation."
  );

  return (
    <iframe
      src="https://kindness-community-foundation.netlify.app/"
      title="ServeKindness"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        border: "none",
        zIndex: 0,
      }}
      allow="microphone; camera"
    />
  );
}
