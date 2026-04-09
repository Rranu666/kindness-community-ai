import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// These paths render the homepage and self-scroll to a specific section.
// NavigationTracker must NOT scroll-to-top here — it would fight the section scroll.
const SECTION_PATHS = new Set(['/vision', '/leadership', '/initiatives', '/governance']);

export default function NavigationTracker() {
  const location = useLocation();

  useEffect(() => {
    if (SECTION_PATHS.has(location.pathname)) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return null;
}
