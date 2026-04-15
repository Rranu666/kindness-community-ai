/**
 * CapacitorShell — Native-style header + bottom nav for the iOS/Android app.
 * Only renders when running inside a Capacitor WebView (window.Capacitor).
 * Uses fixed positioning so it overlays every KindLearn page automatically.
 */
import { useLocation, useNavigate } from 'react-router-dom';

const inApp = typeof window !== 'undefined' && !!window.Capacitor;

const TABS = [
  {
    id: 'home',
    label: 'Home',
    path: '/kindlearn',
    icon: (
      <svg fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-[22px] h-[22px]">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    id: 'learn',
    label: 'Learn',
    path: '/kindlearn/select-language',
    icon: (
      <svg fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-[22px] h-[22px]">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'progress',
    label: 'Progress',
    path: '/kindlearn/dashboard',
    icon: (
      <svg fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-[22px] h-[22px]">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    path: '/kindlearn/profile',
    icon: (
      <svg fill="none" strokeWidth="2" viewBox="0 0 24 24" className="w-[22px] h-[22px]">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

function isTabActive(tabPath, currentPath) {
  if (tabPath === '/kindlearn') return currentPath === '/kindlearn' || currentPath === '/kindlearn/';
  return currentPath.startsWith(tabPath);
}

export default function CapacitorShell() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!inApp) return null;

  return (
    <>
      {/* ── Top header ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 'calc(52px + env(safe-area-inset-top))',
          paddingTop: 'env(safe-area-inset-top)',
          background: 'rgba(255,255,255,0.92)',
          borderBottom: '0.5px solid rgba(0,0,0,0.07)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: '9px',
          zIndex: 8000,
          WebkitBackdropFilter: 'blur(16px) saturate(200%)',
          backdropFilter: 'blur(16px) saturate(200%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <span
            style={{
              fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '-0.3px',
              color: '#111',
            }}
          >
            Kind<span style={{ color: '#7C3AED' }}>Learn</span>
          </span>
        </div>
      </div>

      {/* ── Bottom nav ── */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 'calc(62px + env(safe-area-inset-bottom))',
          paddingBottom: 'env(safe-area-inset-bottom)',
          background: 'rgba(255,255,255,0.94)',
          borderTop: '0.5px solid rgba(0,0,0,0.07)',
          display: 'flex',
          zIndex: 8000,
          WebkitBackdropFilter: 'blur(16px) saturate(200%)',
          backdropFilter: 'blur(16px) saturate(200%)',
        }}
      >
        {TABS.map((tab) => {
          const active = isTabActive(tab.path, location.pathname);
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
                padding: 0,
              }}
            >
              <div
                style={{
                  padding: '3px 16px',
                  borderRadius: '12px',
                  background: active ? '#EDE9FE' : 'transparent',
                  transition: 'background 0.18s',
                }}
              >
                <span style={{ color: active ? '#7C3AED' : '#B0B7C3', display: 'flex' }}>
                  {tab.icon}
                </span>
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 500,
                  fontFamily: '-apple-system, sans-serif',
                  color: active ? '#7C3AED' : '#B0B7C3',
                  transition: 'color 0.18s',
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
