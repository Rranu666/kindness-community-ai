// KIcon.jsx — Logo-style icon for the bot trigger button
// Matches the KCF logo: red rounded square + white K + heart dot

export default function KIcon({ size = 60, animated = true }) {
  const pulseStyle = animated
    ? { animation: "kIconPulse 2.8s ease-in-out infinite", transformOrigin: "center" }
    : {};

  return (
    <>
      {animated && (
        <style>{`
          @keyframes kIconPulse {
            0%, 100% { transform: scale(1); }
            50%       { transform: scale(1.06); }
          }
        `}</style>
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="KCF Support Bot"
        style={pulseStyle}
      >
        {/* Red rounded square background */}
        <rect width="100" height="100" rx="22" fill="#f43f5e" />

        {/* K vertical stem */}
        <rect x="21" y="12" width="16" height="56" rx="4" fill="white" />

        {/* K upper arm */}
        <polygon points="37,51 69,12 83,12 83,28 45,54" fill="white" />

        {/* K lower arm */}
        <polygon points="37,51 69,68 83,68 83,52 45,48" fill="white" />

        {/* Heart dot */}
        <path
          d="M74 10 C74 7 71 4 68.5 6.5 C66 4 63 7 63 10 C63 14.5 68.5 18 68.5 18 C68.5 18 74 14.5 74 10Z"
          fill="white"
          opacity="0.92"
        />
      </svg>
    </>
  );
}
