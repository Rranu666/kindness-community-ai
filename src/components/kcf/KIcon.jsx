// KIcon.jsx — React component
// Usage: <KIcon size={120} /> or <KIcon size={48} animated={false} />
// No dependencies needed — pure SVG inline

import React from "react";

export default function KIcon({ size = 120, animated = true }) {
  const floatStyle = animated
    ? { animation: "kIconFloat 3.5s ease-in-out infinite", transformOrigin: "center" }
    : {};
  const sparkStyle = animated
    ? { animation: "kSparkSpin 3s ease-in-out infinite", transformOrigin: "449px 52px" }
    : {};
  const arcNear = animated ? { animation: "kPulse1 2.4s ease-in-out infinite" } : {};
  const arcMid  = animated ? { animation: "kPulse2 2.4s ease-in-out infinite 0.3s" } : {};
  const arcFar  = animated ? { animation: "kPulse3 2.4s ease-in-out infinite 0.6s" } : {};

  return (
    <>
      <style>{`
        @keyframes kIconFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes kSparkSpin  { 0%,100%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(15deg) scale(1.15)} }
        @keyframes kPulse1 { 0%,100%{opacity:.9}  50%{opacity:.4} }
        @keyframes kPulse2 { 0%,100%{opacity:.55} 50%{opacity:.2} }
        @keyframes kPulse3 { 0%,100%{opacity:.25} 50%{opacity:.08} }
      `}</style>

      <svg
        width={size}
        height={size}
        viewBox="165 20 350 350"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="K AI Bot — Audio and Text Assistant"
      >
        <defs>
          <linearGradient id="k-bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#0A0E1A"/>
            <stop offset="50%"  stopColor="#0D1F3C"/>
            <stop offset="100%" stopColor="#060B14"/>
          </linearGradient>
          <linearGradient id="k-sheen" x1="0%" y1="0%" x2="60%" y2="60%">
            <stop offset="0%"   stopColor="#4A9EFF" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#4A9EFF" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="k-sphereBase" x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%"   stopColor="#1A4A8A"/>
            <stop offset="40%"  stopColor="#0E2D5E"/>
            <stop offset="100%" stopColor="#050E20"/>
          </linearGradient>
          <linearGradient id="k-sphereHL" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%"   stopColor="#6AB4FF" stopOpacity="0.55"/>
            <stop offset="45%"  stopColor="#2563EB" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="k-rim" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%"  stopColor="#38BDF8" stopOpacity="0.45"/>
            <stop offset="30%" stopColor="#38BDF8" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="k-kGrad" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%"   stopColor="#E8F4FF"/>
            <stop offset="35%"  stopColor="#A8D4FF"/>
            <stop offset="70%"  stopColor="#5BA3E8"/>
            <stop offset="100%" stopColor="#C8E8FF"/>
          </linearGradient>
          <linearGradient id="k-micGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%"   stopColor="#7DD3FC"/>
            <stop offset="50%"  stopColor="#3B82F6"/>
            <stop offset="100%" stopColor="#1D4ED8"/>
          </linearGradient>
          <linearGradient id="k-micCap" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%"   stopColor="#BAE6FD"/>
            <stop offset="100%" stopColor="#60A5FA"/>
          </linearGradient>
          <linearGradient id="k-spark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#FDE68A"/>
            <stop offset="100%" stopColor="#F59E0B"/>
          </linearGradient>
          <linearGradient id="k-ring1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#60A5FA" stopOpacity="0.9"/>
            <stop offset="50%"  stopColor="#3B82F6" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.8"/>
          </linearGradient>
          <linearGradient id="k-ring2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#38BDF8" stopOpacity="0.6"/>
            <stop offset="50%"  stopColor="#0EA5E9" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.5"/>
          </linearGradient>
          <clipPath id="k-clip">
            <rect x="165" y="20" width="350" height="350" rx="78"/>
          </clipPath>
        </defs>

        <g style={floatStyle}>
          <rect x="165" y="20" width="350" height="350" rx="78" fill="url(#k-bgGrad)"/>
          <rect x="165" y="20" width="350" height="350" rx="78" fill="url(#k-sheen)"/>
          <g clipPath="url(#k-clip)" opacity="0.06">
            {[90,160,230,300].map(y=><line key={y} x1="165" y1={y} x2="515" y2={y} stroke="#60A5FA" strokeWidth="0.5"/>)}
            {[235,305,375,445].map(x=><line key={x} x1={x} y1="20" x2={x} y2="370" stroke="#60A5FA" strokeWidth="0.5"/>)}
          </g>
          <path style={arcNear} d="M284 138 Q252 195 284 252" fill="none" stroke="url(#k-ring1)" strokeWidth="3.5" strokeLinecap="round"/>
          <path style={arcMid}  d="M264 118 Q220 195 264 272" fill="none" stroke="url(#k-ring2)" strokeWidth="2.5" strokeLinecap="round"/>
          <path style={arcFar}  d="M246 100 Q192 195 246 290" fill="none" stroke="#3B82F6"       strokeWidth="1.5" strokeLinecap="round"/>
          <path style={arcNear} d="M396 138 Q428 195 396 252" fill="none" stroke="url(#k-ring1)" strokeWidth="3.5" strokeLinecap="round"/>
          <path style={arcMid}  d="M416 118 Q460 195 416 272" fill="none" stroke="url(#k-ring2)" strokeWidth="2.5" strokeLinecap="round"/>
          <path style={arcFar}  d="M434 100 Q488 195 434 290" fill="none" stroke="#3B82F6"       strokeWidth="1.5" strokeLinecap="round"/>
          <ellipse cx="340" cy="290" rx="72" ry="12" fill="#000" opacity="0.45"/>
          <circle cx="340" cy="195" r="88" fill="url(#k-sphereBase)"/>
          <circle cx="340" cy="195" r="88" fill="url(#k-rim)"/>
          <ellipse cx="318" cy="155" rx="42" ry="28" fill="url(#k-sphereHL)" transform="rotate(-20,318,155)"/>
          <circle cx="340" cy="195" r="88" fill="none" stroke="#2563EB" strokeWidth="1.5" opacity="0.5"/>
          <circle cx="340" cy="195" r="88" fill="none" stroke="#60A5FA" strokeWidth="0.5" opacity="0.8"/>
          <text x="344" y="222" textAnchor="middle" fill="#051020" fontSize="92" fontWeight="800" fontFamily="Arial Black,sans-serif" opacity="0.6">K</text>
          <text x="340" y="218" textAnchor="middle" fill="url(#k-kGrad)" fontSize="92" fontWeight="800" fontFamily="Arial Black,sans-serif">K</text>
          <ellipse cx="407" cy="278" rx="14" ry="4" fill="#000" opacity="0.4"/>
          <rect x="400" y="272" width="14" height="4" rx="2" fill="#1E3A5F"/>
          <rect x="406" y="249" width="4" height="24" rx="2" fill="#1A3660"/>
          <path d="M394 249 Q388 261 407 261" fill="none" stroke="#1E3A5F" strokeWidth="4" strokeLinecap="round"/>
          <path d="M394 249 Q388 261 407 261" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
          <rect x="397" y="218" width="20" height="34" rx="10" fill="url(#k-micGrad)"/>
          <rect x="399" y="220" width="8"  height="20" rx="5"  fill="url(#k-micCap)" opacity="0.55"/>
          <line x1="400" y1="229" x2="414" y2="229" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
          <line x1="400" y1="234" x2="414" y2="234" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
          <line x1="400" y1="239" x2="414" y2="239" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
          <g style={sparkStyle}>
            <polygon points="449,52 452,62 462,65 452,68 449,78 446,68 436,65 446,62" fill="url(#k-spark)" opacity="0.95"/>
            <polygon points="449,56 451,63 458,65 451,67 449,74 447,67 440,65 447,63" fill="#FEF3C7" opacity="0.6"/>
          </g>
          <circle cx="480" cy="48" r="3" fill="#FCD34D" opacity="0.7"/>
          <path d="M243 20 Q340 8 437 20" fill="none" stroke="white" strokeWidth="1" opacity="0.15" strokeLinecap="round"/>
          <rect x="165" y="20" width="350" height="350" rx="78" fill="none" stroke="#1E3A5F" strokeWidth="1.5"/>
          <rect x="165" y="20" width="350" height="350" rx="78" fill="none" stroke="#60A5FA" strokeWidth="0.5" opacity="0.4"/>
        </g>
      </svg>
    </>
  );
}
