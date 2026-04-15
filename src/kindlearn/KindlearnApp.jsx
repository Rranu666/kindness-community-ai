/**
 * KindlearnApp — Full Kindlearn language-learning app embedded in the KCF site.
 * All routes are prefixed with /kindlearn.
 * Uses its own light-theme CSS variables scoped to this subtree.
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { AuthProvider, useAuth } from '@/kindlearn/lib/AuthContext';
import { UILanguageProvider } from '@/kindlearn/lib/UILanguageContext';

// Native shell (header + bottom nav) — only renders inside Capacitor
import CapacitorShell from '@/kindlearn/components/CapacitorShell';

// Pages
import Landing      from '@/kindlearn/pages/Landing';
import Login        from '@/kindlearn/pages/Login';
import Register     from '@/kindlearn/pages/Register';
import SelectLanguage from '@/kindlearn/pages/SelectLanguage';
import Dashboard    from '@/kindlearn/pages/Dashboard';
import Lesson       from '@/kindlearn/pages/Lesson';
import KidsZone     from '@/kindlearn/pages/KidsZone';
import KidsLesson   from '@/kindlearn/pages/KidsLesson';
import ParentSettings from '@/kindlearn/pages/ParentSettings';
import Help         from '@/kindlearn/pages/Help';
import Flashcards   from '@/kindlearn/pages/Flashcards';
import Review       from '@/kindlearn/pages/Review';
import ListeningGame from '@/kindlearn/pages/ListeningGame';
import Insights     from '@/kindlearn/pages/Insights';
import AdvancedLesson from '@/kindlearn/pages/AdvancedLesson';
import DiagnosticQuiz from '@/kindlearn/pages/DiagnosticQuiz';
import Vocabulary   from '@/kindlearn/pages/Vocabulary';
import UserProfile  from '@/kindlearn/pages/UserProfile';

// Kindlearn light-theme CSS variables (scoped to this subtree)
const KINDLEARN_THEME = {
  '--background': '240 20% 99%',
  '--foreground': '240 20% 6%',
  '--card': '0 0% 100%',
  '--card-foreground': '240 20% 6%',
  '--popover': '0 0% 100%',
  '--popover-foreground': '240 20% 6%',
  '--primary': '258 65% 58%',
  '--primary-foreground': '0 0% 100%',
  '--secondary': '240 15% 95%',
  '--secondary-foreground': '240 20% 20%',
  '--muted': '240 10% 94%',
  '--muted-foreground': '240 10% 45%',
  '--accent': '172 60% 48%',
  '--accent-foreground': '0 0% 100%',
  '--destructive': '0 84% 60%',
  '--destructive-foreground': '0 0% 98%',
  '--border': '240 12% 90%',
  '--input': '240 12% 90%',
  '--ring': '258 65% 58%',
  '--radius': '0.75rem',
  colorScheme: 'light',
  fontFamily: "'Inter', system-ui, sans-serif",
};

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/kindlearn/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  if (isLoadingAuth) return null;
  return isAuthenticated ? <Navigate to="/kindlearn/dashboard" replace /> : children;
};

function KindlearnRoutes() {
  return (
    <Routes>
      {/* Paths are relative to the parent /kindlearn/* wildcard route.
          Guest access is allowed on all pages (matching live Railway site behaviour).
          Only login/register redirect already-authenticated users away. */}
      <Route path=""                element={<Landing />} />
      <Route path="login"           element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="register"        element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="select-language" element={<SelectLanguage />} />
      <Route path="dashboard"       element={<Dashboard />} />
      <Route path="lesson"          element={<Lesson />} />
      <Route path="kids"            element={<KidsZone />} />
      <Route path="kids-lesson"     element={<KidsLesson />} />
      <Route path="parent-settings" element={<ParentSettings />} />
      <Route path="help"            element={<Help />} />
      <Route path="flashcards"      element={<Flashcards />} />
      <Route path="review"          element={<Review />} />
      <Route path="listen"          element={<ListeningGame />} />
      <Route path="insights"        element={<Insights />} />
      <Route path="advanced-lesson" element={<AdvancedLesson />} />
      <Route path="diagnostic"      element={<DiagnosticQuiz />} />
      <Route path="vocabulary"      element={<Vocabulary />} />
      <Route path="profile"         element={<UserProfile />} />
    </Routes>
  );
}

// Inject padding CSS for Capacitor shell once (avoids content hiding under fixed bars)
if (typeof window !== 'undefined' && window.Capacitor) {
  const existing = document.getElementById('kl-cap-pad');
  if (!existing) {
    const s = document.createElement('style');
    s.id = 'kl-cap-pad';
    s.textContent = `
      /* Push page content below the fixed header and above the fixed nav */
      #kl-app-root { padding-top: calc(52px + env(safe-area-inset-top)); padding-bottom: calc(62px + env(safe-area-inset-bottom)); }
      /* Hide the KindLearn landing Navbar (replaced by CapacitorShell header) */
      nav.fixed, .kl-landing-nav { display: none !important; }
      /* Hide website footer */
      footer, .kindlearn-footer { display: none !important; }
    `;
    document.head.appendChild(s);
  }
}

export default function KindlearnApp() {
  return (
    <div id="kl-app-root" style={KINDLEARN_THEME} className="min-h-screen bg-white text-gray-900">
      <UILanguageProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClientInstance}>
            {/* Shell renders as fixed overlay — outside route tree so it persists across navigations */}
            <CapacitorShell />
            <KindlearnRoutes />
          </QueryClientProvider>
        </AuthProvider>
      </UILanguageProvider>
    </div>
  );
}
