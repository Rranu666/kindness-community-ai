import { usePageMeta } from "@/hooks/usePageMeta";
import VolunteerPersonalDashboard from "@/components/volunteer/VolunteerPersonalDashboard";

export default function VolunteerDashboard() {
  usePageMeta(
    "Volunteer with KCF | Track Hours & Earn Badges",
    "Join Kindness Community Foundation's volunteer network. Log your hours, earn recognition badges, and make a lasting impact in your community. Sign up today."
  );
  return <VolunteerPersonalDashboard />;
}
