import { useState } from 'react';
import {
  Users, DollarSign, Clock, FileText, Globe, Activity,
  ExternalLink, Plus, Pencil, Trash2, Save, X, Monitor,
  Smartphone, RefreshCw, LayoutDashboard, Link2, CheckCircle2,
  AlertCircle, Eye, EyeOff, Upload, ImageIcon, RotateCcw
} from 'lucide-react';
import { useRef } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/api/supabaseClient';
import PageHeader from '@/components/shared/PageHeader';
import StatsCard from '@/components/shared/StatsCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import { useProfiles } from '@/hooks/useProfiles';
import { useDonations } from '@/hooks/useDonations';
import { useVolunteerHours } from '@/hooks/useVolunteer';
import { useCommunityStories } from '@/hooks/useCommunityStories';
import { useUserGrowth, useDonationTrend, useDonationsByCause, useVolunteerByInitiative } from '@/hooks/useAnalytics';

/* ── Constants ── */
const DAYS_OPTIONS = [7, 30, 90];
const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
const BLOG_CATEGORIES = ['Vision & Mission', 'Technology', 'Stories', 'Impact', 'Community', 'Events', 'Announcements'];
const SITE_ORIGIN = 'https://kindnesscommunityfoundation.com';

const SITE_PAGES = [
  { label: 'Home',               url: '/',                     desc: 'Homepage' },
  { label: 'Volunteer',          url: '/volunteer',            desc: 'Volunteer landing & form' },
  { label: 'Join the Team',      url: '/jointeam',             desc: 'Team application form' },
  { label: 'Donate & Give',      url: '/servekindness',        desc: 'ServeKindness giving app' },
  { label: 'KindWave',           url: '/kindwave',             desc: 'Real-time GPS kindness map' },
  { label: 'KindLearn',          url: '/kindlearn',            desc: 'Language learning app' },
  { label: 'KindCalmUnity',      url: '/kindcalmunity',        desc: 'Cooperative community living' },
  { label: 'Personal Growth',    url: '/grow',                 desc: 'Personal growth & kindness' },
  { label: 'Blog',               url: '/blog',                 desc: 'Articles & stories' },
  { label: 'Vision & Mission',   url: '/vision',               desc: 'Home section — Vision' },
  { label: 'Leadership',         url: '/leadership',           desc: 'Home section — Leadership' },
  { label: 'Initiatives',        url: '/initiatives',          desc: 'Home section — Initiatives' },
  { label: 'Governance',         url: '/governance',           desc: 'Home section — Governance' },
  { label: 'Contact',            url: '/contact',              desc: 'Contact page' },
  { label: 'My Giving',          url: '/mygiving',             desc: 'Giving dashboard' },
  { label: 'Synergy Hub',        url: '/hub',                  desc: 'Team portal login' },
  { label: 'Volunteer Dashboard',url: '/volunteer/dashboard',  desc: 'Volunteer personal dashboard' },
];

/* ── Tab button ── */
function TabBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
        active ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      <Icon size={15} />
      {label}
    </button>
  );
}

/* ══════════════════════════════════════════
   OVERVIEW TAB
══════════════════════════════════════════ */
function OverviewTab({ days, setDays }) {
  const { data: profiles = [] } = useProfiles();
  const { data: donations = [] } = useDonations();
  const { data: hours = [] } = useVolunteerHours();
  const { data: stories = [] } = useCommunityStories();
  const { data: userGrowth = [], isLoading: lgLoading } = useUserGrowth(days);
  const { data: donationTrend = [], isLoading: dtLoading } = useDonationTrend(days);
  const { data: byCause = [] } = useDonationsByCause();
  const { data: byInit = [] } = useVolunteerByInitiative();

  const totalDonations = donations.reduce((s, d) => s + (parseFloat(d.amount) || 0), 0);
  const totalHours = hours.reduce((s, h) => s + (parseFloat(h.hours) || 0), 0);

  return (
    <div className="space-y-5">
      {/* Day filter */}
      <div className="flex justify-end">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {DAYS_OPTIONS.map(d => (
            <button key={d} onClick={() => setDays(d)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${days === d ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Users"       value={profiles.length}                                                         icon={Users}     color="blue" />
        <StatsCard label="Total Donations"   value={`$${totalDonations.toLocaleString('en-US', { maximumFractionDigits: 0 })}`} icon={DollarSign} color="green" />
        <StatsCard label="Volunteer Hours"   value={`${totalHours.toFixed(0)}h`}                                             icon={Clock}     color="purple" />
        <StatsCard label="Community Stories" value={stories.length}                                                          icon={FileText}  color="orange" />
      </div>

      {/* Line charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">User Growth (Last {days} Days)</h3>
          {lgLoading ? <LoadingSpinner /> : userGrowth.length === 0
            ? <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No data for this period</div>
            : <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="#eff6ff" name="New Users" />
                </AreaChart>
              </ResponsiveContainer>
          }
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Donations (Last {days} Days)</h3>
          {dtLoading ? <LoadingSpinner /> : donationTrend.length === 0
            ? <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No data for this period</div>
            : <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={donationTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                  <Tooltip formatter={v => [`$${v}`, 'Amount']} />
                  <Area type="monotone" dataKey="total" stroke="#10b981" fill="#f0fdf4" name="Amount ($)" />
                </AreaChart>
              </ResponsiveContainer>
          }
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Donations by Cause</h3>
          {byCause.length === 0
            ? <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No donation data</div>
            : <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={byCause} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {byCause.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => [`$${v}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
          }
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Volunteer Hours by Initiative</h3>
          {byInit.length === 0
            ? <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No volunteer data</div>
            : <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byInit} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip formatter={v => [`${v}h`, 'Hours']} />
                  <Bar dataKey="hours" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
          }
        </div>
      </div>

      {/* Story breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Community Stories Status</h3>
        <div className="flex gap-6">
          {['pending', 'approved', 'rejected'].map(s => {
            const count = stories.filter(st => st.status === s).length;
            const pct = stories.length ? Math.round((count / stories.length) * 100) : 0;
            return (
              <div key={s} className="flex-1 text-center">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-500 capitalize">{s}</p>
                <div className="mt-2 bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{pct}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
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

  const sorted = [...SITE_PAGES].sort((a, b) => (pageCounts[b.url] || 0) - (pageCounts[a.url] || 0));

  return (
    <div>
      <div className="mb-5">
        <p className="text-sm text-gray-500">All website pages with direct links · visit counts from activity log</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sorted.map(page => (
          <div key={page.url}
            className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Globe size={14} className="text-gray-400 shrink-0" />
                <span className="text-sm font-semibold text-gray-900">{page.label}</span>
                <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">{page.url}</span>
              </div>
              <p className="text-xs text-gray-400 ml-5">{page.desc}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-3">
              {pageCounts[page.url] > 0 && (
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {pageCounts[page.url]} visits
                </span>
              )}
              <a href={`${SITE_ORIGIN}${page.url}`} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
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
const EMPTY_FORM = {
  title: '', slug: '', author_name: '', excerpt: '', content: '',
  category: '', tags: '', image_url: '', read_time: '',
  meta_description: '', published: false,
};

function toSlug(str) {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function BlogTab() {
  const qc = useQueryClient();
  const fileRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog_posts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  /* Auto-generate slug from title (only when slug hasn't been manually edited) */
  const handleTitleChange = (val) => {
    setForm(f => ({
      ...f,
      title: val,
      slug: f.slug === toSlug(f.title) || f.slug === '' ? toSlug(val) : f.slug,
    }));
  };

  const openCreate = () => { setForm(EMPTY_FORM); setEditing(null); setShowForm(true); };
  const openEdit = (post) => {
    setForm({
      title: post.title || '',
      slug: post.slug || toSlug(post.title || ''),
      author_name: post.author_name || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      category: post.category || '',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
      image_url: post.image_url || '',
      read_time: post.read_time || '',
      meta_description: post.meta_description || '',
      published: !!post.published,
    });
    setEditing(post.id);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(EMPTY_FORM); };

  /* Image upload to Supabase Storage */
  const handleImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return; }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from('blog-images').upload(path, file, { upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(path);
      set('image_url', publicUrl);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || toSlug(form.title),
        author_name: form.author_name.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        category: form.category,
        image_url: form.image_url.trim(),
        read_time: form.read_time.trim(),
        meta_description: form.meta_description.trim(),
        published: form.published,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        updated_at: new Date().toISOString(),
      };
      if (editing) {
        const { error } = await supabase.from('blog_posts').update(payload).eq('id', editing);
        if (error) throw error;
        toast.success('Post updated');
      } else {
        const { error } = await supabase.from('blog_posts').insert({ ...payload, created_at: new Date().toISOString() });
        if (error) throw error;
        toast.success('Post created');
      }
      qc.invalidateQueries({ queryKey: ['blog_posts'] });
      closeForm();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (error) throw error;
      toast.success('Post deleted');
      qc.invalidateQueries({ queryKey: ['blog_posts'] });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const inputCls = 'w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-400';
  const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5';
  const metaLen = form.meta_description.length;
  const metaColor = metaLen === 0 ? 'text-gray-400' : metaLen < 50 ? 'text-orange-500' : metaLen <= 160 ? 'text-green-600' : 'text-red-500';

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">{posts.length} post{posts.length !== 1 ? 's' : ''} total · {posts.filter(p => p.published).length} published</p>
        {!showForm && (
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={15} /> New Post
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-gray-900">{editing ? 'Edit Post' : 'New Blog Post'}</h3>
            <button onClick={closeForm} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"><X size={16} /></button>
          </div>

          <div className="space-y-4">
            {/* Row 1: Title + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Title *</label>
                <input className={inputCls} placeholder="Post title..." value={form.title} onChange={e => handleTitleChange(e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select className={inputCls} value={form.category} onChange={e => set('category', e.target.value)}>
                  <option value="">Select category...</option>
                  {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Row 2: Slug + Author */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={labelCls} style={{ marginBottom: 0 }}>Slug (URL)</label>
                  <button type="button" onClick={() => set('slug', toSlug(form.title))}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors">
                    <RotateCcw size={10} /> Auto-generate
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">/blog/</span>
                  <input className={`${inputCls} pl-14 font-mono`} placeholder="my-post-title" value={form.slug} onChange={e => set('slug', toSlug(e.target.value))} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Author Name</label>
                <input className={inputCls} placeholder="e.g. Kindness Community Team" value={form.author_name} onChange={e => set('author_name', e.target.value)} />
              </div>
            </div>

            {/* Row 3: Read Time + Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Read Time</label>
                <input className={inputCls} placeholder="e.g. 5 min read" value={form.read_time} onChange={e => set('read_time', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Tags (comma-separated)</label>
                <input className={inputCls} placeholder="kindness, community, impact" value={form.tags} onChange={e => set('tags', e.target.value)} />
              </div>
            </div>

            {/* Image upload */}
            <div>
              <label className={labelCls}>Cover Image</label>
              <div className="flex gap-3 items-start">
                {/* Preview */}
                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 shrink-0 overflow-hidden">
                  {form.image_url
                    ? <img src={form.image_url} alt="" className="w-full h-full object-cover rounded-lg" onError={() => set('image_url', '')} />
                    : <ImageIcon size={24} className="text-gray-300" />
                  }
                </div>
                <div className="flex-1 space-y-2">
                  {/* Upload button */}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={e => handleImageUpload(e.target.files?.[0])} />
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-60 transition-colors w-full justify-center">
                    <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                  {/* Or paste URL */}
                  <input className={inputCls} placeholder="Or paste image URL..." value={form.image_url}
                    onChange={e => set('image_url', e.target.value)} />
                  <p className="text-xs text-gray-400">JPG, PNG, WebP · max 5 MB</p>
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className={labelCls}>Excerpt</label>
              <textarea className={`${inputCls} resize-none`} rows={2} placeholder="Short summary shown in blog listing..." value={form.excerpt} onChange={e => set('excerpt', e.target.value)} />
            </div>

            {/* Content */}
            <div>
              <label className={labelCls}>Content</label>
              <textarea className={`${inputCls} resize-y`} rows={8} placeholder="Full post content (Markdown or HTML)..." value={form.content} onChange={e => set('content', e.target.value)} />
            </div>

            {/* Meta description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelCls} style={{ marginBottom: 0 }}>Meta Description <span className="normal-case text-gray-400 font-normal">(SEO)</span></label>
                <span className={`text-xs font-medium ${metaColor}`}>
                  {metaLen}/160 {metaLen > 0 && metaLen < 50 ? '— too short' : metaLen > 160 ? '— too long' : metaLen >= 50 ? '✓ good' : ''}
                </span>
              </div>
              <textarea
                className={`${inputCls} resize-none ${metaLen > 160 ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''}`}
                rows={2}
                placeholder="Brief page description for Google (50–160 chars recommended)..."
                value={form.meta_description}
                onChange={e => set('meta_description', e.target.value)}
                maxLength={320}
              />
              <p className="text-xs text-gray-400 mt-1">Appears in Google search results under the page title.</p>
            </div>

            {/* Published toggle + actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={form.published} onChange={e => set('published', e.target.checked)} />
                  <div className={`w-10 h-6 rounded-full transition-colors ${form.published ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.published ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">Published</span>
                {form.published
                  ? <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">Live</span>
                  : <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">Draft</span>
                }
              </label>
              <div className="flex gap-2">
                <button onClick={closeForm} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors">
                  <Save size={14} /> {saving ? 'Saving...' : (editing ? 'Update Post' : 'Create Post')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post list */}
      {posts.length === 0 ? (
        <EmptyState icon="📝" title="No blog posts yet" message="Create your first post to get started." />
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-5 py-4 hover:border-gray-300 transition-all">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900 truncate">{post.title}</span>
                  {post.published
                    ? <span className="shrink-0 flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full font-medium"><CheckCircle2 size={10} /> Published</span>
                    : <span className="shrink-0 flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full font-medium"><AlertCircle size={10} /> Draft</span>
                  }
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {post.category && <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{post.category}</span>}
                  {post.read_time && <span>{post.read_time}</span>}
                  <span>{post.created_at ? format(new Date(post.created_at), 'MMM d, yyyy') : '—'}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-4 shrink-0">
                <button onClick={() => openEdit(post)}
                  className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                  <Pencil size={14} />
                </button>
                {deleteId === post.id ? (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleDelete(post.id)} className="px-2.5 py-1 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">Delete</button>
                    <button onClick={() => setDeleteId(null)} className="px-2.5 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteId(post.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
                    <Trash2 size={14} />
                  </button>
                )}
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
function deviceIcon(ua = '') {
  const mobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  return mobile
    ? <Smartphone size={14} className="text-blue-500" />
    : <Monitor size={14} className="text-gray-400" />;
}

function ActivityTab({ activityLogs, loadingActivity, refetchActivity }) {
  const [filter, setFilter] = useState('');

  const filtered = activityLogs.filter(l =>
    !filter || (l.page_url || '').toLowerCase().includes(filter.toLowerCase()) ||
    (l.ip_address || '').includes(filter)
  );

  const today = activityLogs.filter(l => l.created_at && new Date(l.created_at).toDateString() === new Date().toDateString()).length;
  const uniqueIPs = new Set(activityLogs.map(l => l.ip_address).filter(Boolean)).size;
  const uniquePages = new Set(activityLogs.map(l => l.page_url).filter(Boolean)).size;

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total Events',    value: activityLogs.length, color: 'blue' },
          { label: 'Unique IPs',      value: uniqueIPs,           color: 'green' },
          { label: 'Pages Visited',   value: uniquePages,         color: 'purple' },
          { label: "Today's Events",  value: today,               color: 'orange' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500">{c.label}</p>
            <p className={`text-2xl font-bold mt-1 ${c.color === 'blue' ? 'text-blue-600' : c.color === 'green' ? 'text-green-600' : c.color === 'purple' ? 'text-purple-600' : 'text-orange-600'}`}>
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter + refresh */}
      <div className="flex items-center gap-3 mb-4">
        <input
          className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder-gray-400"
          placeholder="Filter by page URL or IP address..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <button onClick={() => refetchActivity()}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loadingActivity ? <LoadingSpinner /> : activityLogs.length === 0 ? (
        <EmptyState
          icon="📊"
          title="No activity data yet"
          message="Activity will appear here once visitors start browsing the site."
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {['Time', 'Page', 'IP Address', 'Device', 'Referrer'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 200).map((log, i) => (
                  <tr key={log.id || i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {log.created_at ? format(new Date(log.created_at), 'MMM d, HH:mm:ss') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {log.page_url || '/'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-gray-600">{log.ip_address || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {deviceIcon(log.user_agent)}
                        <span className="text-xs text-gray-400 max-w-[120px] truncate">{log.user_agent ? log.user_agent.split(' ')[0] : '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 max-w-[200px] truncate">
                      {log.referrer || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length > 200 && (
            <div className="px-4 py-3 text-xs text-gray-400 border-t border-gray-100 bg-gray-50">
              Showing 200 of {filtered.length} records
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN
══════════════════════════════════════════ */
const TABS = [
  { id: 'overview',  label: 'Overview',  Icon: LayoutDashboard },
  { id: 'pages',     label: 'Pages',     Icon: Link2 },
  { id: 'blog',      label: 'Blog',      Icon: FileText },
  { id: 'activity',  label: 'Activity',  Icon: Activity },
];

export default function Analytics() {
  const [tab, setTab] = useState('overview');
  const [days, setDays] = useState(30);

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

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Platform-wide performance metrics & content management" />

      {/* Tab bar */}
      <div className="flex gap-1.5 flex-wrap">
        {TABS.map(({ id, label, Icon }) => (
          <TabBtn key={id} active={tab === id} onClick={() => setTab(id)} icon={Icon} label={label} />
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview'  && <OverviewTab days={days} setDays={setDays} />}
      {tab === 'pages'     && <PagesTab activityLogs={activityLogs} />}
      {tab === 'blog'      && <BlogTab />}
      {tab === 'activity'  && <ActivityTab activityLogs={activityLogs} loadingActivity={loadingActivity} refetchActivity={refetchActivity} />}
    </div>
  );
}
