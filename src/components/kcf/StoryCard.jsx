import { MapPin, Tag } from "lucide-react";

const PILLAR_COLORS = {
  "Education": "bg-blue-100 text-blue-700",
  "Economic Empowerment": "bg-emerald-100 text-emerald-700",
  "Health & Wellness": "bg-rose-100 text-rose-700",
  "Community Development": "bg-amber-100 text-amber-700",
  "Environmental Sustainability": "bg-green-100 text-green-700",
  "Cultural Preservation": "bg-purple-100 text-purple-700",
};

const PILLAR_DOTS = {
  "Education": "bg-blue-400",
  "Economic Empowerment": "bg-emerald-400",
  "Health & Wellness": "bg-rose-400",
  "Community Development": "bg-amber-400",
  "Environmental Sustainability": "bg-green-400",
  "Cultural Preservation": "bg-purple-400",
};

export default function StoryCard({ story }) {
  const colorClass = PILLAR_COLORS[story.pillar] || "bg-slate-100 text-slate-600";
  const dotClass = PILLAR_DOTS[story.pillar] || "bg-slate-400";
  const initials = story.author_name
    ? story.author_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
      {/* Pillar badge */}
      {story.pillar && (
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotClass}`} />
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${colorClass}`}>
            {story.pillar}
          </span>
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-bold text-slate-800 leading-snug">{story.title}</h3>

      {/* Story excerpt */}
      <p className="text-sm text-slate-500 leading-relaxed line-clamp-4">{story.story}</p>

      {/* Tags */}
      {story.tags && story.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {story.tags.map((tag) => (
            <span key={tag} className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Author */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">{story.author_name}</p>
            {story.location && (
              <p className="text-xs text-slate-400 flex items-center gap-0.5">
                <MapPin className="w-3 h-3" /> {story.location}
              </p>
            )}
          </div>
        </div>
        <span className="text-xs text-slate-300">
          {new Date(story.created_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </span>
      </div>
    </div>
  );
}