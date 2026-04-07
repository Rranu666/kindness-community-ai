import { lazy, Suspense, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/kcf/Header";
import AmbientBackground from "@/components/kcf/AmbientBackground";
import SectionDivider from "@/components/kcf/SectionDivider";

const HeroSection = lazy(() => import("@/components/kcf/HeroSection"));
const AboutSection = lazy(() => import("@/components/kcf/AboutSection"));
const VisionMission = lazy(() => import("@/components/kcf/VisionMission"));
const InitiativesSection = lazy(() => import("@/components/kcf/InitiativesSection"));
const WhyDifferent = lazy(() => import("@/components/kcf/WhyDifferent"));
const EvolutionSection = lazy(() => import("@/components/kcf/EvolutionSection"));
const LeadershipSection = lazy(() => import("@/components/kcf/LeadershipSection"));
const PartnerSection = lazy(() => import("@/components/kcf/PartnerSection"));
const GovernanceSection = lazy(() => import("@/components/kcf/GovernanceSection"));
const ProspectusSection = lazy(() => import("@/components/kcf/ProspectusSection"));
const BoardRecruitmentSection = lazy(() => import("@/components/kcf/BoardRecruitmentSection"));
const EngagementSection = lazy(() => import("@/components/kcf/EngagementSection"));
const Footer = lazy(() => import("@/components/kcf/Footer"));

const SectionFallback = () => <div className="w-full h-20" />;

// Renders children only once the sentinel div enters the viewport.
// When rootMargin is "eager" (set during cross-page hash-navigation) we skip the
// IntersectionObserver entirely and start visible=true so ALL sections load their
// JS chunks immediately — this lets the rAF scroll-tracker see the final page
// height before it stops polling.
function LazySection({ children, rootMargin = "200px" }) {
  const eager = rootMargin === "eager";
  const ref = useRef(null);
  const [visible, setVisible] = useState(eager);

  useEffect(() => {
    if (eager || visible || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [rootMargin, eager, visible]);

  return (
    <div ref={ref}>
      {visible ? (
        <Suspense fallback={<SectionFallback />}>{children}</Suspense>
      ) : (
        <SectionFallback />
      )}
    </div>
  );
}

export default function Home() {
  const location = useLocation();
  const scrollTarget = location.state?.scrollTarget || window.location.hash;

  // When navigating to a specific section, use a huge rootMargin so ALL
  // LazySection IntersectionObservers fire immediately — the full page height
  // (14 000 px+) stabilises before our timed scroll fires, giving the correct
  // position for every section anchor. Without this, the IntersectionObserver
  // cascade only loads sections near the top and #initiatives sits at the wrong
  // y-position in the partially-loaded page.
  // "eager" bypasses IntersectionObserver and renders immediately (see LazySection).
  // Used when navigating from another page with a scroll target so all sections
  // mount before the rAF tracker fires its final snap.
  const rm = scrollTarget ? "eager" : "200px";
  const rmAbout = scrollTarget ? "eager" : "300px";

  useEffect(() => {
    if (!scrollTarget) return;

    // behavior:'instant' overrides the global `html { scroll-behavior:smooth }` (index.css).
    // We poll with rAF: each frame we read the element's current absolute top, scroll to it,
    // and count how many consecutive frames it has been stable (≤ 2px change). Once stable
    // for 8 frames (~133ms) we stop. This survives the Suspense-cascade where lazy sections
    // above the target expand one-by-one AFTER our scroll fires, each time pushing the target
    // further down. A safety timeout stops polling at 3s regardless.
    let rafId;
    let safetyId;
    let lastTop = -1;
    let stableCount = 0;

    const tick = () => {
      const el = document.querySelector(scrollTarget);
      if (!el) { rafId = requestAnimationFrame(tick); return; }

      const absTop = el.getBoundingClientRect().top + window.scrollY;
      const target80 = Math.max(0, absTop - 80); // subtract fixed header height

      if (Math.abs(absTop - lastTop) < 2) {
        stableCount++;
      } else {
        stableCount = 0;
        lastTop = absTop;
        // Element moved — snap to its new position immediately
        window.scrollTo({ top: target80, behavior: "instant" });
      }

      if (stableCount >= 8) {
        // Position has been stable for ~133ms — do a final precise snap and stop
        window.scrollTo({ top: target80, behavior: "instant" });
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    // Brief initial delay so NavigationTracker's scroll-to-top completes first
    const startId = setTimeout(() => { rafId = requestAnimationFrame(tick); }, 150);
    // Hard stop after 10s in case sections never stabilise (page can take 5-6s on slow networks)
    safetyId = setTimeout(() => {
      cancelAnimationFrame(rafId);
      const el = document.querySelector(scrollTarget);
      if (el) window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 80), behavior: "instant" });
    }, 10000);

    return () => { clearTimeout(startId); clearTimeout(safetyId); cancelAnimationFrame(rafId); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollTarget]);

  return (
    <div id="home" className="min-h-screen" style={{ background: "#030712", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <AmbientBackground />
      <Header />
      <main id="main-content">
        <Suspense fallback={<SectionFallback />}>
          <HeroSection />
        </Suspense>

        <div id="about" style={{ scrollMarginTop: "80px" }} />
        <LazySection rootMargin={rmAbout}>
          <AboutSection />
        </LazySection>

        <SectionDivider color="rose" />

        <div id="vision" style={{ scrollMarginTop: "80px" }} />
        <LazySection rootMargin={rm}>
          <VisionMission />
        </LazySection>

        <SectionDivider color="violet" />

        <div id="initiatives" style={{ scrollMarginTop: "80px" }} />
        <LazySection rootMargin={rm}>
          <InitiativesSection />
        </LazySection>

        <SectionDivider color="blue" />

        <LazySection rootMargin={rm}>
          <WhyDifferent />
        </LazySection>

        <SectionDivider color="violet" />

        <div id="evolution" style={{ scrollMarginTop: "80px" }} />
        <LazySection rootMargin={rm}>
          <EvolutionSection />
        </LazySection>

        <SectionDivider color="blue" />

        <div id="leadership" style={{ scrollMarginTop: "80px" }} />
        <LazySection rootMargin={rm}>
          <LeadershipSection />
        </LazySection>

        <SectionDivider color="rose" />

        <div id="volunteer" style={{ scrollMarginTop: "80px" }} />
        <LazySection rootMargin={rm}>
          <PartnerSection />
        </LazySection>

        <SectionDivider color="violet" />

        <div id="governance" style={{ scrollMarginTop: "80px" }} />
        <LazySection rootMargin={rm}>
          <GovernanceSection />
        </LazySection>

        <SectionDivider color="rose" />

        <div id="prospectus" style={{ scrollMarginTop: "80px" }} />
        <LazySection rootMargin={rm}>
          <ProspectusSection />
        </LazySection>

        <SectionDivider color="blue" />

        <div id="board" style={{ scrollMarginTop: "80px" }} />
        <LazySection rootMargin={rm}>
          <BoardRecruitmentSection />
        </LazySection>

        <SectionDivider color="violet" />

        <LazySection rootMargin={rm}>
          <EngagementSection />
        </LazySection>

        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </main>
    </div>
  );
}