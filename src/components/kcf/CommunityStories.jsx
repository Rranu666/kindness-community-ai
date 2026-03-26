import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { PenLine, BookOpen, ChevronDown } from "lucide-react";
import StoryCard from "./StoryCard";
import StorySubmitForm from "./StorySubmitForm";

const PILLARS = [
  "All",
  "Education",
  "Economic Empowerment",
  "Health & Wellness",
  "Community Development",
  "Environmental Sustainability",
  "Cultural Preservation",
];

export default function CommunityStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    base44.entities.CommunityStory.filter({ status: "approved" }, "-created_date", 50)
      .then(setStories)
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === "All"
    ? stories
    : stories.filter((s) => s.pillar === activeFilter);

  const visible = filtered.slice(0, visibleCount);

  const handleSuccess = () => {
    setShowForm(false);
    setSubmitted(true);
  };

  return (
    <section id="stories" className="py-24" style={{ background: "#040810" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-rose-500/20 rounded-full text-rose-400 text-xs font-bold uppercase tracking-widest mb-5" style={{ background: "rgba(244,63,94,0.06)" }}>
            <BookOpen className="w-3.5 h-3.5" />
            Real Impact, Real People
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            Community{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400">
              Stories
            </span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Voices from the communities we serve — stories of resilience, growth, and transformation shaped by our mission.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {PILLARS.map((p) => (
            <button
              key={p}
              onClick={() => { setActiveFilter(p); setVisibleCount(6); }}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-all ${
                activeFilter === p
                  ? "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-900/30"
                  : "border-white/10 text-white/40 hover:border-rose-500/30 hover:text-rose-400 bg-white/3"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-3xl border border-white/[0.06] p-6 h-64 animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="h-4 bg-white/5 rounded-full w-1/3 mb-4" />
                <div className="h-5 bg-white/5 rounded-full w-2/3 mb-3" />
                <div className="space-y-2">
                  <div className="h-3 bg-white/5 rounded-full w-full" />
                  <div className="h-3 bg-white/5 rounded-full w-5/6" />
                  <div className="h-3 bg-white/5 rounded-full w-4/6" />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
            {filtered.length > visibleCount && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisibleCount((c) => c + 6)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/10 text-white/40 hover:border-rose-500/30 hover:text-rose-400 font-semibold text-sm transition-all"
                >
                  <ChevronDown className="w-4 h-4" /> Load More Stories
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 text-white/30">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No stories yet in this category.</p>
            <p className="text-sm mt-1">Be the first to share your experience!</p>
          </div>
        )}

        {/* CTA / Form */}
        <div className="mt-16">
          {submitted ? (
            <div className="max-w-xl mx-auto text-center rounded-3xl p-10 border border-rose-500/15" style={{ background: "rgba(244,63,94,0.05)" }}>
              <div className="text-4xl mb-3">🙏</div>
              <h3 className="text-xl font-bold text-white mb-2">Thank you for sharing!</h3>
              <p className="text-white/40 text-sm">
                Your story has been submitted for review and will appear here once approved. Your voice matters to our community.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-5 text-sm font-semibold text-rose-400 hover:text-rose-300 underline underline-offset-2"
              >
                Submit another story
              </button>
            </div>
          ) : showForm ? (
            <div className="max-w-2xl mx-auto rounded-3xl border border-white/[0.06] p-8" style={{ background: "rgba(10,15,30,0.95)" }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Share Your Story</h3>
                  <p className="text-sm text-white/35 mt-0.5">Use AI Assist to help craft your narrative</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-white/30 hover:text-white/60 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
              <StorySubmitForm onSuccess={handleSuccess} />
            </div>
          ) : (
            <div className="max-w-xl mx-auto text-center rounded-3xl p-10 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.03)" }}>
              <h3 className="text-2xl font-extrabold text-white mb-3">
                Has Kindness Community impacted your life?
              </h3>
              <p className="text-white/35 text-sm mb-6">
                Share your journey and inspire others. Our AI assistant will help you tell your story beautifully.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-rose-500/30"
              >
                <PenLine className="w-4 h-4" />
                Write Your Story
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}