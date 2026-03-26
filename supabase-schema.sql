-- ============================================================
-- Kindness Community Foundation — Supabase Schema
-- Run this in Supabase SQL Editor to create all tables
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles (extends Supabase auth.users) ──────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT UNIQUE NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  role        TEXT DEFAULT 'member',    -- 'admin' | 'member'
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on sign-up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── Donations ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email      TEXT NOT NULL,
  amount          NUMERIC(10,2) NOT NULL,
  cause           TEXT NOT NULL,
  charity_name    TEXT,
  donation_type   TEXT DEFAULT 'one-time',  -- 'one-time' | 'roundup' | 'cashback'
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Giving Goals ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS giving_goals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email      TEXT NOT NULL,
  title           TEXT NOT NULL,
  cause           TEXT NOT NULL,
  target_amount   NUMERIC(10,2) NOT NULL,
  deadline        DATE,
  is_completed    BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Subscriptions ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email          TEXT NOT NULL,
  cause               TEXT NOT NULL,
  charity_name        TEXT,
  amount              NUMERIC(10,2) NOT NULL,
  status              TEXT DEFAULT 'active',   -- 'active' | 'paused' | 'cancelled'
  next_donation_date  DATE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ── Community Stories ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_stories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name   TEXT NOT NULL,
  author_email  TEXT NOT NULL,
  title         TEXT NOT NULL,
  story         TEXT NOT NULL,
  pillar        TEXT NOT NULL,
  tags          TEXT[] DEFAULT '{}',
  location      TEXT,
  status        TEXT DEFAULT 'pending',   -- 'pending' | 'approved' | 'rejected'
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Volunteer Signups ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS volunteer_signups (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email      TEXT NOT NULL,
  user_name       TEXT,
  initiative_id   TEXT NOT NULL,
  initiative_name TEXT NOT NULL,
  notes           TEXT,
  status          TEXT DEFAULT 'active',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Volunteer Hours ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS volunteer_hours (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email      TEXT NOT NULL,
  user_name       TEXT,
  initiative_id   TEXT,
  initiative_name TEXT,
  hours           NUMERIC(6,2) NOT NULL,
  description     TEXT,
  log_date        DATE DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Volunteer Badges ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS volunteer_badges (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email  TEXT NOT NULL,
  badge_name  TEXT NOT NULL,
  badge_level TEXT,
  awarded_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Volunteer Submissions ────────────────────────────────────
CREATE TABLE IF NOT EXISTS volunteer_submissions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email  TEXT NOT NULL,
  user_name   TEXT,
  form_type   TEXT,
  data        JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Team Members ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT UNIQUE NOT NULL,
  full_name   TEXT NOT NULL,
  role        TEXT DEFAULT 'Member',
  department  TEXT,
  bio         TEXT,
  avatar_url  TEXT,
  phone       TEXT,
  location    TEXT,
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Team Messages ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_email    TEXT NOT NULL,
  sender_name     TEXT,
  sender_avatar   TEXT,
  message         TEXT NOT NULL,
  message_type    TEXT DEFAULT 'group',    -- 'group' | 'direct' | 'channel'
  channel_id      TEXT,
  recipient_email TEXT,                    -- for direct messages
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Message Attachments ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS message_attachments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id  UUID REFERENCES team_messages(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  file_size   INTEGER,
  file_type   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Chat Groups ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_groups (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  created_by  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Team Tasks ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_tasks (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             TEXT NOT NULL,
  description       TEXT,
  status            TEXT DEFAULT 'todo',   -- 'todo' | 'in_progress' | 'done'
  priority          TEXT DEFAULT 'medium', -- 'low' | 'medium' | 'high'
  task_type         TEXT DEFAULT 'team',
  assigned_to_email TEXT,
  assigned_to_name  TEXT,
  created_by_email  TEXT,
  created_by_name   TEXT,
  due_date          DATE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Task Attachments ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS task_attachments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id     UUID REFERENCES team_tasks(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Team Documents ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_documents (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  description   TEXT,
  file_url      TEXT,
  file_name     TEXT,
  file_type     TEXT,
  file_size     INTEGER,
  category      TEXT,
  uploaded_by   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Team Announcements ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_announcements (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         TEXT NOT NULL,
  content       TEXT NOT NULL,
  author_email  TEXT,
  author_name   TEXT,
  priority      TEXT DEFAULT 'normal',   -- 'low' | 'normal' | 'high' | 'urgent'
  is_pinned     BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Notifications ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_email TEXT NOT NULL,
  title           TEXT NOT NULL,
  message         TEXT,
  type            TEXT DEFAULT 'info',
  is_read         BOOLEAN DEFAULT FALSE,
  link            TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── Social Posts ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS social_posts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_email  TEXT NOT NULL,
  author_name   TEXT,
  author_avatar TEXT,
  content       TEXT NOT NULL,
  image_url     TEXT,
  likes         TEXT[] DEFAULT '{}',
  like_count    INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Social Comments ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS social_comments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id       UUID REFERENCES social_posts(id) ON DELETE CASCADE,
  author_email  TEXT NOT NULL,
  author_name   TEXT,
  content       TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Analytics ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analytics (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_type   TEXT NOT NULL,
  metric_date   DATE DEFAULT CURRENT_DATE,
  user_email    TEXT,
  value         NUMERIC,
  metadata      JSONB,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations            ENABLE ROW LEVEL SECURITY;
ALTER TABLE giving_goals         ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_stories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_signups    ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_hours      ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_badges     ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members         ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_messages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_attachments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_groups          ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_tasks           ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_attachments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_documents       ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_announcements   ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications        ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_comments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics            ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update their own
CREATE POLICY "profiles_read_all"   ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Public read for community stories (approved ones), authenticated can insert
CREATE POLICY "stories_read_approved" ON community_stories FOR SELECT USING (status = 'approved' OR auth.uid() IS NOT NULL);
CREATE POLICY "stories_insert_auth"   ON community_stories FOR INSERT WITH CHECK (true);

-- Donations: users own their data
CREATE POLICY "donations_own" ON donations FOR ALL USING (
  auth.jwt() ->> 'email' = user_email OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Giving goals: users own their data
CREATE POLICY "giving_goals_own" ON giving_goals FOR ALL USING (
  auth.jwt() ->> 'email' = user_email OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Subscriptions: users own their data
CREATE POLICY "subscriptions_own" ON subscriptions FOR ALL USING (
  auth.jwt() ->> 'email' = user_email OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Volunteer data: users own their data
CREATE POLICY "volunteer_signups_own"    ON volunteer_signups    FOR ALL USING (auth.jwt() ->> 'email' = user_email OR auth.uid() IS NOT NULL);
CREATE POLICY "volunteer_hours_own"      ON volunteer_hours      FOR ALL USING (auth.jwt() ->> 'email' = user_email OR auth.uid() IS NOT NULL);
CREATE POLICY "volunteer_badges_own"     ON volunteer_badges     FOR ALL USING (auth.jwt() ->> 'email' = user_email OR auth.uid() IS NOT NULL);
CREATE POLICY "volunteer_submissions_own" ON volunteer_submissions FOR ALL USING (auth.uid() IS NOT NULL);

-- Team: authenticated users only
CREATE POLICY "team_members_auth"       ON team_members         FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "team_messages_auth"      ON team_messages        FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "message_attachments_auth" ON message_attachments  FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "chat_groups_auth"        ON chat_groups          FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "team_tasks_auth"         ON team_tasks           FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "task_attachments_auth"   ON task_attachments     FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "team_documents_auth"     ON team_documents       FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "team_announcements_auth" ON team_announcements   FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "notifications_own"       ON notifications        FOR ALL USING (auth.jwt() ->> 'email' = recipient_email);
CREATE POLICY "social_posts_auth"       ON social_posts         FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "social_comments_auth"    ON social_comments      FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "analytics_admin"         ON analytics            FOR ALL USING (auth.uid() IS NOT NULL);

-- ============================================================
-- Storage Buckets (run separately in Supabase Storage UI or via API)
-- ============================================================
-- Create a bucket named "uploads" with public access for file uploads
-- INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);
