/**
 * base44Client.js — Supabase compatibility shim
 *
 * Exposes the same `base44` object shape the rest of the codebase uses,
 * powered entirely by Supabase.  No imports in components/pages need to change.
 */

import { supabase } from './supabaseClient';

// ── Table name map ────────────────────────────────────────────────────────────
const TABLE_MAP = {
  Analytics:           'analytics',
  ChatGroup:           'chat_groups',
  CommunityStory:      'community_stories',
  Donation:            'donations',
  GivingGoal:          'giving_goals',
  MessageAttachment:   'message_attachments',
  Notification:        'notifications',
  SocialComment:       'social_comments',
  SocialPost:          'social_posts',
  Subscription:        'subscriptions',
  TaskAttachment:      'task_attachments',
  TeamAnnouncement:    'team_announcements',
  TeamDocument:        'team_documents',
  TeamMember:          'team_members',
  TeamMessage:         'team_messages',
  TeamTask:            'team_tasks',
  User:                'profiles',
  VolunteerBadge:      'volunteer_badges',
  VolunteerHours:      'volunteer_hours',
  VolunteerSignup:     'volunteer_signups',
  VolunteerSubmission: 'volunteer_submissions',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function applyFilter(query, filter) {
  if (!filter || typeof filter !== 'object') return query;
  for (const [key, val] of Object.entries(filter)) {
    if (val && typeof val === 'object' && val.$regex) {
      query = query.ilike(key, `%${val.$regex}%`);
    } else {
      query = query.eq(key, val);
    }
  }
  return query;
}

function applySort(query, sort) {
  if (!sort) return query.order('created_at', { ascending: false });
  const field = sort.startsWith('-') ? sort.slice(1) : sort;
  const ascending = !sort.startsWith('-');
  const colMap = { created_date: 'created_at', updated_date: 'updated_at' };
  const col = colMap[field] || field;
  return query.order(col, { ascending });
}

// ── Entity factory ────────────────────────────────────────────────────────────
function createEntity(tableName) {
  return {
    async list(sort, limit) {
      let q = supabase.from(tableName).select('*');
      q = applySort(q, sort);
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },

    async filter(filter, sort, limit) {
      let q = supabase.from(tableName).select('*');
      q = applyFilter(q, filter);
      q = applySort(q, sort);
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },

    async create(data) {
      const { data: row, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return row;
    },

    async update(id, data) {
      const payload = { ...data };
      // Only add updated_at if the table likely has it (suppress for immutable tables)
      const noUpdatedAt = ['analytics', 'donations', 'community_stories', 'volunteer_hours',
        'volunteer_badges', 'volunteer_signups', 'volunteer_submissions', 'social_comments',
        'message_attachments', 'task_attachments'];
      if (!noUpdatedAt.includes(tableName)) {
        payload.updated_at = new Date().toISOString();
      }
      const { data: row, error } = await supabase
        .from(tableName)
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return row;
    },

    async delete(id) {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
      return true;
    },

    subscribe(callback) {
      const channel = supabase
        .channel(`${tableName}_changes`)
        .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, callback)
        .subscribe();
      return () => supabase.removeChannel(channel);
    },
  };
}

const entities = Object.fromEntries(
  Object.entries(TABLE_MAP).map(([name, table]) => [name, createEntity(table)])
);

// ── Auth ──────────────────────────────────────────────────────────────────────
const auth = {
  async me() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Not authenticated');
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    return {
      id: user.id,
      email: user.email,
      full_name: profile?.full_name || user.user_metadata?.full_name || user.email,
      role: profile?.role || 'member',
      avatar_url: profile?.avatar_url,
      ...profile,
    };
  },

  async isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  redirectToLogin(redirectUrl) {
    if (redirectUrl) sessionStorage.setItem('auth_redirect', redirectUrl);
    window.location.href = '/Login';
  },

  async logout(redirectUrl) {
    await supabase.auth.signOut();
    window.location.href = redirectUrl || '/';
  },
};

// ── Integrations ──────────────────────────────────────────────────────────────
const integrations = {
  Core: {
    async InvokeLLM({ prompt, response_json_schema } = {}) {
      console.warn('[KCF] InvokeLLM stub — connect a real LLM endpoint.');
      if (response_json_schema) return {};
      return { result: 'AI features require a configured LLM endpoint.' };
    },

    async UploadFile({ file }) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('uploads').upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from('uploads').getPublicUrl(path);
      return { url: data.publicUrl, file_url: data.publicUrl };
    },
  },
};

// ── Functions (Supabase Edge Functions) ───────────────────────────────────────
const functions = {
  async invoke(name, payload) {
    const { data, error } = await supabase.functions.invoke(name, { body: payload });
    if (error) throw error;
    return data;
  },
};

// ── App Logs (no-op) ──────────────────────────────────────────────────────────
const appLogs = { logUserInApp: () => Promise.resolve() };

// ── Export ────────────────────────────────────────────────────────────────────
export const base44 = { auth, entities, integrations, functions, appLogs };
