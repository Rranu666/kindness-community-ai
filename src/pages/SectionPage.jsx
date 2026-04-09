/**
 * SectionPage — renders the full homepage and auto-scrolls to a named section.
 * The URL stays as /leadership, /vision, etc. (clean, shareable, SEO-friendly).
 * Home.jsx reads its own pathname via SECTION_PATHS to activate eager lazy-loading.
 */
import { usePageMeta } from "@/hooks/usePageMeta";
import Home from "./Home";

export default function SectionPage({ title, description }) {
  usePageMeta(title, description);
  return <Home />;
}
