import { useState, useRef, useEffect } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Tag, Heart, Globe, Users, Zap, Shield, Sparkles, BrainCircuit, ArrowRight, ChevronRight, User } from "lucide-react";
import Header from "@/components/kcf/Header";
import Footer from "@/components/kcf/Footer";
import { supabase } from "@/api/supabaseClient";
import { STATIC_BLOG_POSTS } from "@/data/staticBlogPosts";

const featuredPost = {
  id: 1,
  slug: "reinventing-giving-through-kindness",
  title: "Reinventing Giving Through Kindness",
  subtitle: "Kindness Community Foundation",
  excerpt: "At Kindness Community Foundation, we are redefining online giving, digital philanthropy, and community support platforms by transforming simple acts of kindness into a global movement.",
  date: "March 24, 2026",
  readTime: "6 min read",
  category: "Vision & Mission",
  image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&q=80",
  tags: ["Giving", "Community", "Technology", "Impact"],
  featured: true,
};

const upcomingPosts = [
  {
    title: "How Technology Is Powering Ethical Commerce",
    excerpt: "Exploring the intersection of tech, transparency, and community-driven economies.",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    comingSoon: true,
  },
  {
    title: "Volunteer Stories: Lives Changed Through Kindness",
    excerpt: "Real stories from our community members who have made a difference.",
    category: "Stories",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80",
    comingSoon: true,
  },
  {
    title: "The Future of Social Impact: A Transparent Giving Model",
    excerpt: "How KCF is building trust through radical transparency and measurable outcomes.",
    category: "Impact",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80",
    comingSoon: true,
  },
];

const highlights = [
  { icon: Globe, label: "47+ Nations", desc: "Global community reach", color: "from-rose-500 to-pink-500" },
  { icon: Heart, label: "Kindness First", desc: "Purpose-driven giving", color: "from-pink-500 to-fuchsia-500" },
  { icon: Shield, label: "Transparent", desc: "Accountable & ethical", color: "from-violet-500 to-indigo-500" },
  { icon: Zap, label: "Impactful", desc: "Measurable social change", color: "from-indigo-500 to-sky-500" },
];

function AnimBlock({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay }} className={className}>
      {children}
    </motion.div>
  );
}

function BlogPostFull() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const pillars = [
    { icon: Globe, text: "Discover verified causes and charities", color: "text-rose-500" },
    { icon: Users, text: "Participate in online fundraising and crowdfunding campaigns", color: "text-pink-500" },
    { icon: Heart, text: "Support neighbors and local communities", color: "text-fuchsia-500" },
    { icon: Zap, text: "Track and measure the real-world impact of their contributions", color: "text-indigo-500" },
  ];

  return (
    <article ref={ref} className="max-w-4xl mx-auto px-6 lg:px-0">
      {/* Article hero image */}
      <AnimBlock>
        <div className="relative rounded-3xl overflow-hidden mb-12 shadow-xl" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
          <img
            src={featuredPost.image}
            alt={featuredPost.title}
            className="w-full h-64 sm:h-80 lg:h-[420px] object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {featuredPost.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold border"
                  style={{ background: "rgba(244,63,94,0.15)", borderColor: "rgba(244,63,94,0.3)", color: "#fb7185" }}>
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-2">
              {featuredPost.title}
            </h1>
            <p className="text-rose-300 font-semibold text-sm">{featuredPost.subtitle}</p>
          </div>
        </div>
      </AnimBlock>

      {/* Meta */}
      <AnimBlock delay={0.1} className="flex flex-wrap items-center gap-4 mb-10 pb-8 border-b border-gray-200">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Calendar className="w-4 h-4 text-rose-500" />
          {featuredPost.date}
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Clock className="w-4 h-4 text-rose-500" />
          {featuredPost.readTime}
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Tag className="w-4 h-4 text-rose-500" />
          {featuredPost.category}
        </div>
      </AnimBlock>

      {/* Body */}
      <div className="max-w-none space-y-8">

        <AnimBlock delay={0.15}>
          <p className="text-gray-600 text-lg leading-relaxed">
            At Kindness Community Foundation, we are redefining <strong className="text-gray-900">online giving</strong>, <strong className="text-gray-900">digital philanthropy</strong>, and <strong className="text-gray-900">community support platforms</strong> by transforming simple acts of kindness into a global movement. We believe that giving is more than a one-time act — it's a purpose-driven ecosystem powered by empathy, innovation, and technology.
          </p>
        </AnimBlock>

        {/* Image break 1 */}
        <AnimBlock delay={0.2}>
          <div className="relative rounded-2xl overflow-hidden my-10">
            <img
              src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=900&q=80"
              alt="Community coming together"
              className="w-full h-52 sm:h-64 object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
              <div className="px-8">
                <p className="text-white font-bold text-lg max-w-xs">Building a trusted charity platform for everyone</p>
              </div>
            </div>
          </div>
        </AnimBlock>

        <AnimBlock delay={0.25}>
          <p className="text-gray-600 text-base leading-relaxed">
            Our mission is to build a <strong className="text-gray-900">trusted charity platform</strong> where individuals, communities, and organizations can easily donate, volunteer, and support meaningful causes. By integrating technology with compassion, we enable people to give back, connect with communities, and create measurable social impact like never before.
          </p>
        </AnimBlock>

        <AnimBlock delay={0.3}>
          <div className="rounded-3xl p-8 border border-indigo-100 bg-indigo-50">
            <div className="flex items-center gap-3 mb-4">
              <BrainCircuit className="w-5 h-5 text-indigo-500" />
              <span className="text-indigo-500 text-xs font-bold tracking-widest uppercase">Future of Giving</span>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">
              We are shaping the future of <strong className="text-gray-900">social impact platforms</strong> and <strong className="text-gray-900">ethical commerce</strong>, where every transaction contributes to a greater purpose. Whether you're looking for ways to support local communities, participate in crowdfunding initiatives, or engage in sustainable giving — our platform makes it simple, transparent, and impactful.
            </p>
          </div>
        </AnimBlock>

        {/* Image break 2 */}
        <AnimBlock delay={0.35}>
          <div className="relative rounded-2xl overflow-hidden my-10">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=900&q=80"
              alt="Volunteers in action"
              className="w-full h-52 sm:h-64 object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <p className="text-white/90 text-sm px-6 pb-5 italic">Our volunteers creating real-world change across communities</p>
            </div>
          </div>
        </AnimBlock>

        <AnimBlock delay={0.4}>
          <p className="text-gray-600 text-base leading-relaxed">
            Through <strong className="text-gray-900">secure donation systems</strong>, transparent giving models, and community-driven initiatives, we remove barriers that often prevent people from contributing. Our ecosystem is designed to empower users to:
          </p>
        </AnimBlock>

        {/* Pillar cards */}
        <AnimBlock delay={0.45}>
          <div className="grid sm:grid-cols-2 gap-4 my-8">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-gray-200 hover:border-rose-200 transition-all duration-300 bg-white"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(244,63,94,0.08)" }}>
                    <Icon className={`w-4 h-4 ${p.color}`} />
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">{p.text}</p>
                </motion.div>
              );
            })}
          </div>
        </AnimBlock>

        {/* Closing quote */}
        <AnimBlock delay={0.5}>
          <div className="relative rounded-3xl p-8 overflow-hidden my-10 bg-white border border-rose-100"
            style={{ boxShadow: "0 4px 20px rgba(244,63,94,0.07)" }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(244,63,94,0.4), transparent)" }} />
            <Sparkles className="w-6 h-6 text-rose-500 mb-4" />
            <p className="text-gray-900 text-lg font-semibold leading-relaxed mb-3">
              "Kindness is powerful — but when combined with technology, transparency, and collective action, it becomes transformative."
            </p>
            <p className="text-gray-400 text-sm">— Kindness Community Foundation</p>
          </div>
        </AnimBlock>

        <AnimBlock delay={0.55}>
          <p className="text-gray-600 text-base leading-relaxed">
            Together, we are building a <strong className="text-gray-900">global kindness network</strong> that is compassionate, connected, and driven by real change. Join us in creating a better world through <strong className="text-gray-900">digital giving</strong>, social good innovation, and community empowerment.
          </p>
        </AnimBlock>

        {/* CTA */}
        <AnimBlock delay={0.6}>
          <div className="flex flex-col sm:flex-row gap-4 mt-10 pt-10 border-t border-gray-200">
            <Link to="/servekindness">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white font-bold text-sm"
                style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)" }}
              >
                <Heart className="w-4 h-4" />
                Start Giving Today
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link to="/volunteer">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-gray-700 font-bold text-sm border border-gray-200 hover:border-rose-200 hover:text-rose-500 transition-all bg-white"
              >
                <Users className="w-4 h-4" />
                Volunteer With Us
              </motion.button>
            </Link>
          </div>
        </AnimBlock>
      </div>
    </article>
  );
}

// Simple markdown → JSX renderer for DB post content
function renderContent(text) {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## ')) {
      return <h2 key={i} className="text-gray-900 font-black text-xl mt-8 mb-3">{line.slice(3)}</h2>;
    }
    if (line.startsWith('### ')) {
      return <h3 key={i} className="text-gray-900 font-bold text-lg mt-6 mb-2">{line.slice(4)}</h3>;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      return <li key={i} className="text-gray-600 text-sm leading-relaxed ml-4 list-disc">{line.slice(2)}</li>;
    }
    if (line.startsWith('> ')) {
      return (
        <blockquote key={i} className="border-l-4 border-rose-500 pl-4 my-4 text-gray-600 italic text-base bg-rose-50 py-2 rounded-r-xl">
          {line.slice(2)}
        </blockquote>
      );
    }
    if (line.trim() === '') return <div key={i} className="h-3" />;
    // Bold text
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={j} className="text-gray-900">{part.slice(2, -2)}</strong>
        : part
    );
    return <p key={i} className="text-gray-600 text-sm leading-relaxed">{parts}</p>;
  });
}

function DbPostFull({ post, onBack }) {
  const tags = (() => {
    try { return JSON.parse(post.tags); } catch { return post.tags ? post.tags.split(',').map(t => t.trim()) : []; }
  })();
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-gray-700 text-sm font-semibold mb-10 transition-colors group">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Back to Blog
      </button>
      <article className="max-w-4xl mx-auto">
        {post.image_url && (
          <div className="relative rounded-3xl overflow-hidden mb-10 shadow-xl" style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
            <img src={post.image_url} alt={post.title} className="w-full h-64 sm:h-80 lg:h-[400px] object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold border"
                    style={{ background: "rgba(244,63,94,0.15)", borderColor: "rgba(244,63,94,0.3)", color: "#fb7185" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">{post.title}</h1>
            </div>
          </div>
        )}
        {!post.image_url && (
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-8">{post.title}</h1>
        )}
        <div className="flex flex-wrap items-center gap-4 mb-10 pb-8 border-b border-gray-200">
          {post.author_name && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <User className="w-4 h-4 text-rose-500" />
              {post.author_name}
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Calendar className="w-4 h-4 text-rose-500" />
            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          {post.read_time && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Clock className="w-4 h-4 text-rose-500" />
              {post.read_time}
            </div>
          )}
          {post.category && (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Tag className="w-4 h-4 text-rose-500" />
              {post.category}
            </div>
          )}
        </div>
        <div className="max-w-none space-y-2">
          {renderContent(post.content)}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-10 border-t border-gray-200">
          <Link to="/servekindness">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)" }}>
              <Heart className="w-4 h-4" /> Start Giving Today <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
          <Link to="/volunteer">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-gray-700 font-bold text-sm border border-gray-200 hover:border-rose-200 hover:text-rose-500 transition-all bg-white">
              <Users className="w-4 h-4" /> Volunteer With Us
            </motion.button>
          </Link>
        </div>
      </article>
    </div>
  );
}

export default function Blog() {
  usePageMeta(
    "KCF Blog – Community Stories & Nonprofit Insights",
    "Read the latest stories, volunteer spotlights, and community news from Kindness Community Foundation. Nonprofit insights and impact updates."
  );
  const [viewPost, setViewPost] = useState(false);
  const [activeDbPost, setActiveDbPost] = useState(null);
  const [dbPosts, setDbPosts] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => setDbPosts(data || []));
  }, []);

  const handleSubscribe = () => {
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    const subject = encodeURIComponent('Newsletter Subscription Request');
    const body = encodeURIComponent(`Please add me to the KCF newsletter.\n\nEmail: ${newsletterEmail}`);
    window.location.href = `mailto:contact@kindnesscommunityfoundation.com?subject=${subject}&body=${body}`;
    setNewsletterDone(true);
    setNewsletterEmail('');
  };

  return (
    <div className="min-h-screen" style={{ background: "#f0f0ef" }}>
      <Header />

      {/* ── HERO ── */}
      <div className="relative pt-28 pb-20 overflow-hidden" style={{ background: "#ffffff" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(ellipse, rgba(244,63,94,0.06) 0%, transparent 70%)" }} />
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-200 mb-6"
              style={{ background: "rgba(244,63,94,0.06)" }}>
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-rose-500 text-xs font-bold tracking-widest uppercase">KCF Blog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-gray-900 leading-tight mb-5">
              Stories of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500">
                Kindness & Impact
              </span>
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
              Insights, stories, and ideas from the Kindness Community Foundation — reimagining how humanity gives, connects, and grows together.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-200 bg-white hover:border-rose-200 transition-all duration-300"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${h.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-gray-900 font-bold text-sm">{h.label}</div>
                  <div className="text-gray-400 text-xs">{h.desc}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-20">

        {/* Featured Post Card / Full Post Toggle */}
        <AnimatePresence mode="wait">
          {activeDbPost ? (
            <motion.div key="dbpost" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <DbPostFull post={activeDbPost} onBack={() => setActiveDbPost(null)} />
            </motion.div>
          ) : !viewPost ? (
            <motion.div key="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Dynamic DB posts + static posts — shown FIRST */}
              {(dbPosts.length > 0 || STATIC_BLOG_POSTS.length > 0) && (
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1 h-6 rounded-full" style={{ background: "linear-gradient(180deg, #f43f5e, #ec4899)" }} />
                    <span className="text-gray-900 font-black text-xl">Latest Posts</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...STATIC_BLOG_POSTS, ...dbPosts].map((post, i) => {
                      const tags = (() => { try { return JSON.parse(post.tags); } catch { return post.tags ? post.tags.split(',').map(t => t.trim()) : []; } })();
                      return (
                        <Link key={post.id} to={`/blog/${post.slug}`}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                          transition={{ delay: i * 0.08 }}
                          className="rounded-2xl overflow-hidden border border-gray-200 cursor-pointer group hover:border-rose-200 transition-all duration-300 bg-white"
                          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                          <div className="relative overflow-hidden h-44">
                            {post.image_url
                              ? <img src={post.image_url} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
                              : <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                  <Sparkles className="w-10 h-10 text-rose-300" />
                                </div>
                            }
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            {post.category && (
                              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold"
                                style={{ background: "rgba(244,63,94,0.15)", border: "1px solid rgba(244,63,94,0.3)", color: "#fb7185" }}>
                                {post.category}
                              </div>
                            )}
                          </div>
                          <div className="p-5">
                            <h3 className="text-gray-900 font-bold text-sm leading-snug mb-2 group-hover:text-rose-500 transition-colors line-clamp-2">{post.title}</h3>
                            {post.excerpt && <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-gray-400 text-xs">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                {post.read_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.read_time}</span>}
                              </div>
                              <span className="text-rose-500 text-xs font-bold group-hover:underline flex items-center gap-1">Read <ChevronRight className="w-3 h-3" /></span>
                            </div>
                          </div>
                        </motion.div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Latest Articles — Featured hardcoded post */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-6 rounded-full" style={{ background: "linear-gradient(180deg, #f43f5e, #ec4899)" }} />
                <span className="text-gray-900 font-black text-xl">Latest Articles</span>
              </div>

              {/* Featured big card */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-3xl overflow-hidden border border-gray-200 cursor-pointer mb-12 group bg-white hover:border-rose-200 transition-all duration-300"
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}
                onClick={() => setViewPost(true)}
              >
                <div className="flex flex-col lg:grid lg:grid-cols-2">
                  <div className="relative overflow-hidden">
                    <img src={featuredPost.image} alt={featuredPost.title}
                      className="w-full h-52 sm:h-64 lg:h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy" decoding="async" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold"
                        style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)", color: "#fff" }}>
                        ✦ Featured Post
                      </span>
                    </div>
                  </div>
                  <div className="p-8 lg:p-10 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {featuredPost.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold border border-rose-200"
                          style={{ background: "rgba(244,63,94,0.06)", color: "#f43f5e" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight mb-3 group-hover:text-rose-500 transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-rose-500 font-semibold text-sm mb-4">{featuredPost.subtitle}</p>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-gray-400 text-xs">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{featuredPost.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{featuredPost.readTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-rose-500 text-sm font-bold group-hover:gap-3 transition-all">
                        Read Article <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Coming Soon cards */}
              <div className="flex items-center gap-3 mt-12 mb-6">
                <div className="w-1 h-6 rounded-full" style={{ background: "linear-gradient(180deg, #6366f1, #8b5cf6)" }} />
                <span className="text-gray-900 font-black text-xl">Coming Soon</span>
              </div>
              <div className="grid sm:grid-cols-3 gap-6">
                {upcomingPosts.map((post, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl overflow-hidden border border-gray-200 bg-white"
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    <div className="relative overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-40 object-cover opacity-70" loading="lazy" decoding="async" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold border border-indigo-200"
                        style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>
                        Coming Soon
                      </div>
                    </div>
                    <div className="p-5">
                      <span className="text-rose-400 text-xs font-bold uppercase tracking-wider">{post.category}</span>
                      <h3 className="text-gray-900 font-bold text-sm mt-2 mb-2 leading-snug">{post.title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed">{post.excerpt}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="post" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Back button */}
              <button onClick={() => setViewPost(false)}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-700 text-sm font-semibold mb-10 transition-colors group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Blog
              </button>
              <BlogPostFull />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── NEWSLETTER CTA ── */}
      <AnimBlock>
        <div className="max-w-6xl mx-auto px-6 lg:px-12 pb-20">
          <div className="relative rounded-3xl p-10 lg:p-14 text-center overflow-hidden bg-white border border-rose-100"
            style={{ boxShadow: "0 4px 24px rgba(244,63,94,0.07)" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(244,63,94,0.04) 0%, transparent 70%)" }} />
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(244,63,94,0.3), transparent)" }} />
            <BrainCircuit className="w-10 h-10 text-indigo-400 mx-auto mb-5" />
            <h3 className="text-gray-900 font-black text-2xl sm:text-3xl mb-3">Stay Inspired</h3>
            <p className="text-gray-500 text-base max-w-xl mx-auto mb-8">
              Get the latest stories, impact updates, and insights from the Kindness Community Foundation delivered to your inbox.
            </p>
            {newsletterDone ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-emerald-600 text-sm font-semibold border border-emerald-200 bg-emerald-50">
                ✓ Thanks! Your email client should open to complete the subscription.
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3 rounded-2xl text-gray-900 text-sm outline-none border border-gray-200 focus:border-rose-400 transition-colors bg-gray-50 placeholder-gray-300"
                />
                <motion.button
                  onClick={handleSubscribe}
                  disabled={!newsletterEmail || !newsletterEmail.includes('@')}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 rounded-2xl text-white font-bold text-sm flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                  style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)" }}
                >
                  Subscribe
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </AnimBlock>

      <Footer />
    </div>
  );
}
