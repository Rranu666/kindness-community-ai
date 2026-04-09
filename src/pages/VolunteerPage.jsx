import { usePageMeta } from "@/hooks/usePageMeta";
import { useNavigate } from "react-router-dom";
import Header from "@/components/kcf/Header";
import Footer from "@/components/kcf/Footer";
import PartnerSection from "@/components/kcf/PartnerSection";
import VolunteerSignupForm from "@/components/volunteer/VolunteerSignupForm";

export default function VolunteerPage() {
  usePageMeta(
    "Volunteer With Us | Kindness Community Foundation",
    "Join KCF's volunteer network. Share your skills in language teaching, community outreach, tech support, wellbeing programs, and more. Register today."
  );
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#030712" }}>
      <Header />
      <main id="main-content" style={{ paddingTop: "80px" }}>
        <PartnerSection />
        <VolunteerSignupForm onSuccess={() => navigate("/volunteer/dashboard")} />
      </main>
      <Footer hideCta />
    </div>
  );
}
