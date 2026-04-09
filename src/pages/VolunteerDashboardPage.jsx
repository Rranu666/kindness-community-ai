import { usePageMeta } from "@/hooks/usePageMeta";
import Header from "@/components/kcf/Header";
import Footer from "@/components/kcf/Footer";
import VolunteerPersonalDashboard from "@/components/volunteer/VolunteerPersonalDashboard";

export default function VolunteerDashboardPage() {
  usePageMeta(
    "Volunteer Dashboard | Track Hours & Badges | KCF",
    "Track your volunteer hours, tasks, and badges. See your impact with Kindness Community Foundation."
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Header />
      <main style={{ paddingTop: "80px" }}>
        <VolunteerPersonalDashboard />
      </main>
      <Footer hideCta />
    </div>
  );
}
