import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag, Heart, Users, Sparkles, ArrowRight, User } from "lucide-react";
import Header from "@/components/kcf/Header";
import Footer from "@/components/kcf/Footer";
import { supabase } from "@/api/supabaseClient";
import { usePageMeta } from "@/hooks/usePageMeta";

// Simple Markdown → JSX renderer
function renderContent(text) {
  if (!text) return null;
  return text.split("\n").map((line, i) => {
    if (line.startsWith("## ")) {
      return (
        <h2 key={i} className="text-white font-black text-2xl mt-10 mb-4 leading-snug">
          {line.slice(3)}
        </h2>
      );
    }
    if (line.startsWith("### ")) {
      return (
        <h3 key={i} className="text-white font-bold text-xl mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return (
        <li key={i} className="text-white/70 text-base leading-relaxed ml-5 list-disc mb-1">
          {parseBold(line.slice(2))}
        </li>
      );
    }
    if (line.startsWith("> ")) {
      return (
        <blockquote key={i} className="border-l-4 border-rose-500 pl-5 my-6 text-white/80 italic text-lg leading-relaxed">
          {line.slice(2)}
        </blockquote>
      );
    }
    if (line.trim() === "") return <div key={i} className="h-4" />;
    return (
      <p key={i} className="text-white/70 text-base leading-relaxed mb-1">
        {parseBold(line)}
      </p>
    );
  });
}

function parseBold(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={j} className="text-white font-semibold">{part.slice(2, -2)}</strong>
      : part
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  usePageMeta(
    post ? `${post.title} | KCF Blog` : "Blog | Kindness Community Foundation",
    post?.meta_description || post?.excerpt || "Read the latest from Kindness Community Foundation."
  );

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true);
        } else {
          setPost(data);
        }
        setLoading(false);
      });
  }, [slug]);

  const tags = (() => {
    if (!post?.tags) return [];
    try { return JSON.parse(post.tags); }
    catch { return post.tags.split(",").map(t => t.trim()); }
  })();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#030712" }}>
        <Header />
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
          <p className="text-white/40 text-sm">Loading post…</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen" style={{ background: "#030712" }}>
        <Header />
        <div className="max-w-3xl mx-auto px-6 pt-40 pb-20 text-center">
          <p className="text-rose-400 text-6xl font-black mb-4">404</p>
          <p className="text-white text-xl font-bold mb-6">Post not found</p>
          <Link to="/blog">
            <button className="flex items-center gap-2 mx-auto px-6 py-3 rounded-2xl text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)" }}>
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#030712" }}>
      <Header />

      {/* Hero */}
      <div className="relative pt-28 pb-0 overflow-hidden" style={{ background: "linear-gradient(180deg, #0d1b2a 0%, #030712 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(ellipse, rgba(244,63,94,0.09) 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 pt-6 pb-10">
          {/* Back */}
          <Link to="/blog">
            <motion.div
              className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm font-semibold mb-8 transition-colors group cursor-pointer"
              whileHover={{ x: -2 }}
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </motion.div>
          </Link>

          {/* Category + tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {post.category && (
              <span className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.3)", color: "#fb7185" }}>
                {post.category}
              </span>
            )}
            {tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold border border-white/10 text-white/50">
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6"
          >
            {post.title}
          </motion.h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-5 text-white/40 text-sm pb-8 border-b border-white/[0.07]">
            {post.author_name && (
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-rose-400" />
                <span className="text-white/60 font-medium">{post.author_name}</span>
              </span>
            )}
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-400" />
              {new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            {post.read_time && (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" />
                {post.read_time}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cover image */}
      {post.image_url && (
        <div className="max-w-4xl mx-auto px-6 lg:px-12 mb-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl overflow-hidden shadow-2xl shadow-black/60"
          >
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-64 sm:h-80 lg:h-[420px] object-cover"
              loading="eager"
              decoding="async"
            />
          </motion.div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
        {post.excerpt && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-white/80 text-lg leading-relaxed mb-10 pb-10 border-b border-white/[0.07] font-medium"
          >
            {post.excerpt}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="prose prose-invert max-w-none space-y-1"
        >
          {renderContent(post.content)}
        </motion.div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mt-16 pt-10 border-t border-white/[0.07]">
          <Link to="/servekindness">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)" }}>
              <Heart className="w-4 h-4" /> Start Giving Today <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
          <Link to="/volunteer">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white/80 font-bold text-sm border border-white/20 hover:border-white/40 transition-all"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <Users className="w-4 h-4" /> Volunteer With Us
            </motion.button>
          </Link>
          <Link to="/blog">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white/60 font-bold text-sm border border-white/10 hover:border-white/30 transition-all"
              style={{ background: "rgba(255,255,255,0.02)" }}>
              <ArrowLeft className="w-4 h-4" /> More Articles
            </motion.button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
