import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import ScrollToggleButton from '@/components/ScrollToggleButton'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ErrorBoundary from './lib/ErrorBoundary';
import { AuthProvider } from '@/lib/AuthContext';
import KindraWebBot from '@/components/kcf/KindraWebBot';
import KindlearnApp from '@/kindlearn/KindlearnApp';
import VolunteerDashboard from './pages/VolunteerDashboard';
import TeamPortal from './pages/TeamPortal';
import TeamPortalLanding from './pages/TeamPortalLanding';
import Analytics from './pages/Analytics';
import KindnessConnect from './pages/KindnessConnect';
import GivingDashboard from './pages/GivingDashboard';
import GrowPage from './pages/GrowPage';
import SectionPage from './pages/SectionPage';
import Blog from './pages/Blog';
import KindWaveAppPage from './pages/KindWaveAppPage';
import KindCalmUnityPage from './pages/KindCalmUnityPage';
import Login from './pages/Login';
import Contact from './pages/Contact';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

function AppRoutes() {
  return (
    <Routes>
      <Route path="/Login" element={<Login />} />{/* legacy */}
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      {/* New clean URLs */}
      <Route path="/volunteer" element={<LayoutWrapper currentPageName="VolunteerDashboard"><VolunteerDashboard /></LayoutWrapper>} />
      <Route path="/jointeam" element={<TeamPortalLanding />} />
      <Route path="/synergyhub" element={<TeamPortal />} />
      <Route path="/servekindness" element={<KindnessConnect />} />
      <Route path="/mygiving" element={<GivingDashboard />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/kindwave" element={<KindWaveAppPage />} />
      <Route path="/kindcalmunity" element={<KindCalmUnityPage />} />
      <Route path="/grow" element={<GrowPage />} />
      {/* Section routes — render full homepage scrolled to the right anchor, clean URL */}
      <Route path="/vision"      element={<LayoutWrapper currentPageName="Home"><SectionPage title="Vision & Mission | Kindness Community Foundation" description="KCF's vision: ethical, technology-assisted volunteer networks building sustainable community infrastructure for lasting global impact." /></LayoutWrapper>} />
      <Route path="/leadership"  element={<LayoutWrapper currentPageName="Home"><SectionPage title="Leadership | Kindness Community Foundation" description="Meet the leadership team driving KCF's mission of community empowerment, ethical participation, and measurable social impact." /></LayoutWrapper>} />
      <Route path="/initiatives" element={<LayoutWrapper currentPageName="Home"><SectionPage title="Initiatives | Kindness Community Foundation" description="Explore KCF's six strategic revenue-backed initiatives — from FreeAppMaker.ai to KarmaTrust — funding our nonprofit mission worldwide." /></LayoutWrapper>} />
      <Route path="/governance"  element={<LayoutWrapper currentPageName="Home"><SectionPage title="Governance & Ethics | Kindness Community Foundation" description="KCF is governed by the 12-Tradition Kindness Constitution — ensuring unity, servant leadership, transparency, and principles before personalities." /></LayoutWrapper>} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/analytics" element={<LayoutWrapper currentPageName="Analytics"><Analytics /></LayoutWrapper>} />
      {/* Legacy aliases — keep old URLs working */}
      <Route path="/VolunteerDashboard" element={<LayoutWrapper currentPageName="VolunteerDashboard"><VolunteerDashboard /></LayoutWrapper>} />
      <Route path="/TeamPortalLanding" element={<TeamPortalLanding />} />
      <Route path="/TeamPortal" element={<TeamPortal />} />
      <Route path="/KindnessConnect" element={<KindnessConnect />} />
      <Route path="/GivingDashboard" element={<GivingDashboard />} />
      <Route path="/Blog" element={<Blog />} />
      <Route path="/KindWaveApp" element={<KindWaveAppPage />} />
      <Route path="/Contact" element={<Contact />} />
      <Route path="/Analytics" element={<LayoutWrapper currentPageName="Analytics"><Analytics /></LayoutWrapper>} />
      {/* Kindlearn language-learning app — wildcard catches all /kindlearn/* routes */}
      <Route path="/kindlearn/*"                element={<KindlearnApp />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

// Hide the public bot on pages that have their own AI assistant
const BOT_HIDDEN_PATHS = [
  '/synergyhub', '/TeamPortal', '/teamportal',
  '/login', '/Login',
];

function PublicBot() {
  const location = useLocation();
  const hide = BOT_HIDDEN_PATHS.some(p => location.pathname.toLowerCase() === p.toLowerCase());
  if (hide) return null;
  return <KindraWebBot />;
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <NavigationTracker />
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
            <ScrollToggleButton hideOn={['/servekindness', '/kindcalmunity']} />
            <PublicBot />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
