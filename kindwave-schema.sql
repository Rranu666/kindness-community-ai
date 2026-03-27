-- ============================================================
-- KindWave App — Supabase Schema
-- Deploy to a SEPARATE Supabase project
-- Steps:
--   1. Create a new project at https://supabase.com
--   2. Open SQL Editor in the new project
--   3. Paste and run this file
--   4. Copy the project URL + anon key
--   5. Set VITE_KW_SUPABASE_URL and VITE_KW_SUPABASE_ANON_KEY
--      in Netlify environment variables for kindness-community-ai
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── User Profiles ──────────────────────────────────────────────
-- Stores KindWave user identity, XP progress, and streak data
CREATE TABLE IF NOT EXISTS kw_profiles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_name  TEXT NOT NULL,
  avatar        TEXT,                    -- emoji avatar (e.g. 🌟)
  categories    TEXT[],                  -- help categories the user prefers
  xp            INTEGER DEFAULT 0,
  streak        INTEGER DEFAULT 0,
  shield_count  INTEGER DEFAULT 0,       -- streak shield count (max 3)
  bio           TEXT,
  verified      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Help Request Pins ──────────────────────────────────────────
-- Each row is a help request placed on the community map
CREATE TABLE IF NOT EXISTS kw_help_pins (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES kw_profiles(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT,                    -- urgent | emotional | prayer | general | community
  urgency       TEXT DEFAULT 'Standard', -- Urgent | Standard | Flexible
  location_x    NUMERIC,                 -- map position as percentage (0–100)
  location_y    NUMERIC,                 -- map position as percentage (0–100)
  verified      BOOLEAN DEFAULT FALSE,
  status        TEXT DEFAULT 'open',     -- open | in_progress | resolved | expired
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Chat Messages ──────────────────────────────────────────────
-- Messages exchanged between requester and helper for a specific pin
CREATE TABLE IF NOT EXISTS kw_messages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id    UUID REFERENCES kw_help_pins(id) ON DELETE CASCADE,
  sender_id     UUID REFERENCES kw_profiles(id) ON DELETE SET NULL,
  message       TEXT NOT NULL,
  is_volunteer  BOOLEAN DEFAULT FALSE,   -- TRUE if sender is the helper
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ── Interactions (Helper Responses) ───────────────────────────
-- Tracks who offered/accepted help for each pin and XP earned
CREATE TABLE IF NOT EXISTS kw_interactions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id    UUID REFERENCES kw_help_pins(id) ON DELETE CASCADE,
  helper_id     UUID REFERENCES kw_profiles(id) ON DELETE CASCADE,
  status        TEXT DEFAULT 'offered',  -- offered | accepted | completed | declined
  xp_earned     INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(request_id, helper_id)
);

-- ── Badges ────────────────────────────────────────────────────
-- Earned badges per user (journey, first, listener, streak3, streak7, etc.)
CREATE TABLE IF NOT EXISTS kw_badges (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES kw_profiles(id) ON DELETE CASCADE,
  badge_id      TEXT NOT NULL,           -- journey | first | listener | verified | streak3 | streak7 | streak30 | video1 | share1
  badge_name    TEXT,
  badge_emoji   TEXT,
  xp_at_earn    INTEGER DEFAULT 0,
  earned_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ── Daily Streak Logs ─────────────────────────────────────────
-- One row per user per day when they check in for their streak
CREATE TABLE IF NOT EXISTS kw_streak_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES kw_profiles(id) ON DELETE CASCADE,
  log_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

-- ── Row Level Security ────────────────────────────────────────
-- Enable RLS on all tables (configure policies before going live)
ALTER TABLE kw_profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE kw_help_pins    ENABLE ROW LEVEL SECURITY;
ALTER TABLE kw_messages     ENABLE ROW LEVEL SECURITY;
ALTER TABLE kw_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kw_badges       ENABLE ROW LEVEL SECURITY;
ALTER TABLE kw_streak_logs  ENABLE ROW LEVEL SECURITY;

-- Public read access for help pins (visible to all users on the map)
CREATE POLICY "Public can view open help pins"
  ON kw_help_pins FOR SELECT
  USING (status = 'open');

-- Users can insert their own pins
CREATE POLICY "Authenticated users can post help pins"
  ON kw_help_pins FOR INSERT
  WITH CHECK (true);

-- Public read access for profiles (leaderboard, user cards)
CREATE POLICY "Public can view profiles"
  ON kw_profiles FOR SELECT
  USING (true);

-- Public read access for badges
CREATE POLICY "Public can view badges"
  ON kw_badges FOR SELECT
  USING (true);
