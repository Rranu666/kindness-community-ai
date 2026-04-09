import { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { supabase } from "@/api/supabaseClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import {
  LayoutDashboard, FileText, Activity, ExternalLink, Plus, Pencil, Trash2,
  Save, X, Eye, Globe, Users, Clock, TrendingUp, Heart, ChevronRight,
  CheckCircle2, AlertCircle, Monitor, Smartphone, RefreshCw, Link2
} from "lucide-react";
import MetricsGrid from "@/components/analytics/MetricsGrid";
import ActivityChart from "@/components/analytics/ActivityChart";
import TopMetrics from "@/components/analytics/TopMetrics";

/* ── All website pages ── */
const SITE_PAGES = [
  { label: "Home",            url: "/",                  desc: "Homepage" },
  { label: "Volunteer",       url: "/volunteer",         desc: "Volunteer landing & form" },
  { label: "Join the Team",   url: "/jointeam",          desc: "Team application form" },
  { label: "Donate & Give",   url: "/servekindness",     desc: "ServeKindness giving app" },
  { label: "KindWave",        url: "/kindwave",          desc: "Real-time GPS kindness map" },
  { label: "KindLearn",       url: "/kindlearn",         desc: "Language learning app" },
  { label: "KindCalmUnity",   url: "/kindcalmunity",     desc: "Cooperative community living" },
  { label: "Personal Growth", url: "/grow",              desc: "Personal growth & kindness" },
  { label: "Blog",            url: "/blog",              desc: "Articles & stories" },
  { label: "Vision & Mission",url: "/vision",            desc: "Home section — Vision" },
  { label: "Leadership",      url: "/leadership",        desc: "Home section — Leadership" },
  { label: "Initiatives",     url: "/initiatives",       desc: "Home section — Initiatives" },
  { label: "Governance",      url: "/governance",        desc: "Home section — Governance" },
  { label: "Contact",         url: "/contact",           desc: "Contact page" },
  { label: "My Giving",       url: "/mygiving",          desc: "Giving dashboard" },
  { label: "Synergy Hub",     url: "/hub",               desc: "Team portal login" },
  { label: "Volunteer Dashboard", url: "/volunteer/dashboard", desc: "Volunteer personal dashboard" },
];

const BLOG_CATEGORIES = ["Vision & Mission", "Technology", "Stories", "Impact", "Community", "Events", "Announcements"];

const TAB_STYLE = (active) => ({
  padding: "10px 20px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.88rem",
  display: "flex",
  alignItems: "center",
  gap: 7,
  transition: "all 0.2s",
  background: active ? "rgba(244,63,94,0.15)" : "transparent",
  color: active ? "#fb7185" : "rgba(255,255,255,0.45)",
  borderBottom: active ? "2px solid #f43f5e" : "2px solid transparent",
});

const inputCls = "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-rose-500/50 transition-colors placeholder-white/25";
const labelCls = "block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2";

/* ══════════════════════════════════════════
   OVERVIEW TAB
══════════════════════════════════════════ */
function OverviewTab({ analyticsData, users, volunteerHours, documents }) {
  const totalUsers = users.length;
  const totalHours = volunteerHours.reduce((s, h) => s + (h.hours || 0), 0);
  const totalDocuments = documents.length;
  const last7 = analyticsData.filter(i => new Date(i.metric_date) >= subDays(new Date(), 7)).length;
  const prev7 = analyticsData.filter(i => {
    const d = new Date(i.metric_date);
    return d >= subDays(new Date(), 14) && d < subDays(new Date(), 7);
  }).length;
  const growthRate = prev7 > 0 ? ((last7 - prev7) / prev7 * 100) : 0;

  const activityData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    const day = analyticsData.filter(a => a.metric_date === format(date, 'yyyy-MM-dd'));
    return { date: format(date, 'MMM dd'), signups: day.filter(a => a.metric_type === 'user_signup').length, active: day.length };
  });

  const topMetrics = [
    { label: 'New Signups', description: 'Last 7 days', value: last7 },
    { label: 'Volunteer Hours', description: 'Total logged', value: totalHours.toFixed(0) },
    { label: 'Team Documents', description: 'All docs', value: totalDocuments },
    { label: 'Active Users', description: 'With activity', value: users.filter(u => u.updated_date).length },
    { label: 'Growth Rate', description: 'Week over week', value: `${growthRate.toFixed(1)}%` },
  ];

  return (
    <>
      <MetricsGrid metrics={{ totalUsers, totalHours, totalDocuments, growthRate }} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ActivityChart data={activityData} title="User Activity (Last 30 Days)" />
        </div>
        <TopMetrics data={topMetrics} title="Key Metrics" />
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   PAGES TAB
══════════════════════════════════════════ */
function PagesTab({ activityLogs }) {
  const pageCounts = {};
  activityLogs.forEach(l => {
    const p = l.page_url || '/';
    pageCounts[p] = (pageCounts[p] || 0) + 1;
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-1">All Website Pages</h2>
        <p className="text-white/40 text-sm">Direct links to every page · visit counts from activity log</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SITE_PAGES.map((page) => (
          <div key={page.url} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] hover:border-rose-500/20 transition-all"
            style={{ background: 'rgba(255,255,255,0.025)' }}>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-white">{page.label}</span>
                <span className="text-[10px] font-mono text-rose-400/70 bg-rose-500/10 px-1.5 py-0.5 rounded">{page.url}</span>
              </div>
              <span className="text-xs text-white/30">{page.desc}</span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-3">
              {pageCounts[page.url] > 0 && (
                <span className="text-xs font-bold text-rose-400">{pageCounts[page.url]} visits</span>
              )}
              <a href={page.url} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-all">
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   BLOG TAB
══════════════════════════════════════════ */
function BlogTab() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: '', tags: '', image_url: '', read_time: '', published: false });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog_posts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const resetForm = () => {
    setForm({ title: '', excerpt: '', content: '', category: '', tags: '', image_url: '', read_time: '', published: false });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (post) => {
    setEditing(post.id);
    setForm({
      title: post.title || '', excerpt: post.excerpt || '', content: post.content || '',
      category: post.category || '', tags: (post.tags || []).join(', '),
      image_url: post.image_url || '', read_time: post.read_time || '', published: post.published || false,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.category) { setMsg('Title and category are required.'); return; }
    setSaving(true); setMsg('');
    const payload = {
      title: form.title, excerpt: form.excerpt, content: form.content,
      category: form.category, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      image_url: form.image_url, read_time: form.read_time, published: form.published,
      updated_at: new Date().toISOString(),
    };
    if (editing) {
      await supabase.from('blog_posts').update(payload).eq('id', editing);
    } else {
      await supabase.from('blog_posts').insert([{ ...payload, created_at: new Date().toISOString() }]);
    }
    qc.invalidateQueries(['blog_posts']);
    setSaving(false);
    setMsg(editing ? 'Post updated!' : 'Post created!');
    setTimeout(() => { resetForm(); setMsg(''); }, 1200);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    qc.invalidateQueries(['blog_posts']);
  };

  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Blog Posts</h2>
          <p className="text-white/40 text-sm">{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)' }}>
            <Plus size={16} /> New Post
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border border-white/10 p-6 mb-8" style={{ background: 'rgba(255,255,255,0.025)' }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-white">{editing ? 'Edit Post' : 'New Blog Post'}</h3>
            <button onClick={resetForm} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className={labelCls}>Title *</label>
              <input className={inputCls} placeholder="Post title…" value={form.title} onChange={e => s('title', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Category *</label>
              <select className={inputCls} value={form.category} onChange={e => s('category', e.target.value)}>
                <option value="">Select category…</option>
                {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Read Time</label>
              <input className={inputCls} placeholder="e.g. 5 min read" value={form.read_time} onChange={e => s('read_time', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Excerpt</label>
              <textarea className={inputCls} rows={2} placeholder="Short description…" value={form.excerpt} onChange={e => s('excerpt', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Content (Markdown or plain text)</label>
              <textarea className={inputCls} rows={6} placeholder="Full post content…" value={form.content} onChange={e => s('content', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
            <div>
              <label className={labelCls}>Cover Image URL</label>
              <input className={inputCls} type="url" placeholder="https://…" value={form.image_url} onChange={e => s('image_url', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Tags (comma-separated)</label>
              <input className={inputCls} placeholder="Kindness, Community, Impact" value={form.tags} onChange={e => s('tags', e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={e => s('published', e.target.checked)}
                  className="w-4 h-4 rounded accent-rose-500" />
                <span className="text-sm text-white/60 font-medium">Published</span>
              </label>
            </div>
          </div>
          {msg && <p className="text-sm mb-3" style={{ color: msg.includes('!') ? '#4ade80' : '#f87171' }}>{msg}</p>}
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)' }}>
              <Save size={15} /> {saving ? 'Saving…' : (editing ? 'Update Post' : 'Create Post')}
            </button>
            <button onClick={resetForm} className="px-5 py-2.5 rounded-xl text-white/50 text-sm font-medium border border-white/10 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Post list */}
      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" /></div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <FileText size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No blog posts yet</p>
          <p className="text-sm mt-1">Click "New Post" to create your first post</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.06] hover:border-white/10 transition-all"
              style={{ background: 'rgba(255,255,255,0.02)' }}>
              {post.image_url && (
                <img src={post.image_url} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-bold text-white truncate">{post.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${post.published ? 'bg-green-500/15 text-green-400' : 'bg-white/8 text-white/30'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  {post.category && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400">{post.category}</span>
                  )}
                </div>
                {post.excerpt && <p className="text-xs text-white/35 line-clamp-1 mb-1">{post.excerpt}</p>}
                <p className="text-[11px] text-white/20">{post.created_at ? format(new Date(post.created_at), 'MMM d, yyyy') : ''}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => openEdit(post)} className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/8 transition-all" title="Edit">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(post.id)} className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   ACTIVITY TAB
══════════════════════════════════════════ */
function ActivityTab({ activityLogs, loadingActivity, refetchActivity }) {
  const [filter, setFilter] = useState('');

  const filtered = filter
    ? activityLogs.filter(l => l.page_url?.includes(filter) || l.ip_address?.includes(filter))
    : activityLogs;

  const uniqueIPs   = new Set(activityLogs.map(l => l.ip_address).filter(Boolean)).size;
  const uniquePages = new Set(activityLogs.map(l => l.page_url).filter(Boolean)).size;
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayCount = activityLogs.filter(l => l.created_at?.startsWith(today)).length;

  const deviceIcon = (ua = '') => {
    if (/mobile|android|iphone/i.test(ua)) return <Smartphone size={12} className="text-blue-400" />;
    return <Monitor size={12} className="text-white/30" />;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Website Activity</h2>
          <p className="text-white/40 text-sm">All visitor activity with IP addresses</p>
        </div>
        <button onClick={refetchActivity} className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white border border-white/10 hover:border-white/20 text-sm transition-all">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Events", value: activityLogs.length, icon: Activity, color: "#f43f5e" },
          { label: "Unique IPs", value: uniqueIPs, icon: Globe, color: "#00e8b4" },
          { label: "Pages Visited", value: uniquePages, icon: Link2, color: "#8580ff" },
          { label: "Today", value: todayCount, icon: Clock, color: "#ffc43d" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="p-4 rounded-xl border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.025)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} style={{ color: s.color }} />
                <span className="text-xs text-white/40">{s.label}</span>
              </div>
              <div className="text-xl font-black text-white">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="mb-4">
        <input
          className="w-full max-w-xs bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-rose-500/40 transition-colors placeholder-white/25"
          placeholder="Filter by page or IP…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      {/* Table */}
      {loadingActivity ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <Activity size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No activity recorded yet</p>
          <p className="text-sm mt-1">Activity logs appear here as visitors browse the site</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.06] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['Time', 'Page', 'IP Address', 'Device', 'Referrer'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-white/30 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 200).map((log, i) => (
                  <tr key={log.id || i} className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-xs text-white/40 whitespace-nowrap">
                      {log.created_at ? format(new Date(log.created_at), 'MMM d, HH:mm:ss') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-rose-400/80 bg-rose-500/8 px-2 py-0.5 rounded">
                        {log.page_url || '/'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-white/60">{log.ip_address || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {deviceIcon(log.user_agent)}
                        <span className="text-xs text-white/30 max-w-[120px] truncate">{log.user_agent ? log.user_agent.split(' ')[0] : '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/30 max-w-[180px] truncate">
                      {log.referrer || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length > 200 && (
            <div className="px-4 py-3 text-xs text-white/25 border-t border-white/[0.04]">
              Showing 200 of {filtered.length} records
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════ */
export default function Analytics() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: analyticsData = [] } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => base44.entities.Analytics.list(),
  });
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => base44.entities.User.list(),
  });
  const { data: volunteerHours = [] } = useQuery({
    queryKey: ['volunteerHours'],
    queryFn: () => base44.entities.VolunteerHours.list(),
  });
  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: () => base44.entities.TeamDocument.list(),
  });

  const { data: activityLogs = [], isLoading: loadingActivity, refetch: refetchActivity } = useQuery({
    queryKey: ['site_activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_activity')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);
      if (error) return [];
      return data || [];
    },
    enabled: tab === 'activity' || tab === 'pages',
  });

  const TABS = [
    { id: 'overview', label: 'Overview',  Icon: LayoutDashboard },
    { id: 'pages',    label: 'Pages',     Icon: Link2 },
    { id: 'blog',     label: 'Blog',      Icon: FileText },
    { id: 'activity', label: 'Activity',  Icon: Activity },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#030712' }}>
        <div className="w-8 h-8 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#030712' }}>
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-black text-white mb-3">Access Restricted</h2>
          <p className="text-white/50 text-sm leading-relaxed mb-6">The Admin Dashboard is only available to administrators.</p>
          <button onClick={() => window.location.href = '/'} className="px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)' }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#030712' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Admin Dashboard</h1>
            <p className="text-white/35 text-sm">Kindness Community Foundation · {format(new Date(), 'MMMM d, yyyy')}</p>
          </div>
          <a href="/" className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/50 hover:text-white border border-white/10 hover:border-white/20 text-sm transition-all">
            ← Website
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-white/[0.06] pb-0 overflow-x-auto">
          {TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)} style={TAB_STYLE(tab === id)}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'overview' && (
          <OverviewTab analyticsData={analyticsData} users={users} volunteerHours={volunteerHours} documents={documents} />
        )}
        {tab === 'pages' && (
          <PagesTab activityLogs={activityLogs} />
        )}
        {tab === 'blog' && <BlogTab />}
        {tab === 'activity' && (
          <ActivityTab activityLogs={activityLogs} loadingActivity={loadingActivity} refetchActivity={refetchActivity} />
        )}

      </div>
    </div>
  );
}
