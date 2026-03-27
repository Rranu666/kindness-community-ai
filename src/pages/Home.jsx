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

// Renders children only once the sentinel div enters the viewport
function LazySection({ children, rootMargin = "200px" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [rootMargin]);

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
  const rm = scrollTarget ? "100000px" : "200px";
  const rmAbout = scrollTarget ? "100000px" : "300px";

  useEffect(() => {
    if (!scrollTarget) return;

    // behavior:'instant' explicitly overrides the global `html { scroll-behavior:smooth }`
    // from index.css, giving a reliable one-shot synchronous scroll with no animation
    // conflicts from NavigationTracker or competing useEffect timers.
    const snap = () => {
      const el = document.querySelector(scrollTarget);
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
    };

    // Two correction passes — enough once all sections are eagerly loaded via rm above.
    const t1 = setTimeout(snap, 400);   // first pass after eager sections render
    const t2 = setTimeout(snap, 1200);  // safety correction
    return () => { clearTimeout(t1); clearTimeout(t2); };
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

        <div id="partners" style={{ scrollMarginTop: "80px" }} />
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