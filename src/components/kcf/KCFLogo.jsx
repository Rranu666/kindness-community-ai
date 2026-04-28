export default function KCFLogo() {
  return (
    <div className="flex items-center gap-3 h-full" aria-label="Kindness Community Foundation — Home">
      {/* Icon */}
      <div style={{ width: 38, height: 38, flexShrink: 0 }}>
        <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="38" height="38">
          <rect x="0" y="0" width="96" height="96" rx="17" fill="#f43f5e" fillOpacity="0.10" />
          <rect x="22" y="19" width="17" height="58" rx="4" fill="#0f0f0f" />
          <polygon points="39,48 72,19 83,19 83,31 50,52" fill="#0f0f0f" />
          <polygon points="39,52 72,77 83,77 83,65 50,46" fill="#0f0f0f" />
          <circle cx="68" cy="27" r="5" fill="#f43f5e" fillOpacity="0.5" />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            fontSize: "15px",
            color: "#0f0f0f",
            letterSpacing: "-0.3px",
            lineHeight: 1.1,
          }}
        >
          Kindness Community
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "10px",
            color: "rgba(0,0,0,0.45)",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginTop: "3px",
          }}
        >
          Foundation
        </span>
      </div>
    </div>
  );
}
