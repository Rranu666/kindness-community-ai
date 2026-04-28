export default function KCFLogo() {
  return (
    <div className="flex items-center h-full" aria-label="Kindness Community Foundation — Home">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 120" height="40" aria-hidden="true">
        {/* Icon mark */}
        <rect width="100" height="100" x="10" y="10" rx="22" fill="#f43f5e"/>
        {/* K vertical stem */}
        <rect x="31" y="22" width="16" height="56" rx="4" fill="white"/>
        {/* K upper arm */}
        <polygon points="47,61 79,22 93,22 93,38 55,64" fill="white"/>
        {/* K lower arm */}
        <polygon points="47,61 79,78 93,78 93,62 55,58" fill="white"/>
        {/* Heart dot */}
        <path d="M80 18 C80 14.5 76 11 73 14 C70 11 66 14.5 66 18 C66 23 73 27 73 27 C73 27 80 23 80 18Z" fill="white" opacity="0.9"/>
        {/* Wordmark: "Kindness Community" */}
        <text x="128" y="68"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="800"
          fontSize="38"
          fill="#0a0a0a"
          letterSpacing="-0.5">Kindness Community</text>
        {/* Wordmark: "FOUNDATION" */}
        <text x="130" y="92"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="600"
          fontSize="18"
          fill="rgba(0,0,0,0.4)"
          letterSpacing="4">FOUNDATION</text>
      </svg>
    </div>
  );
}
