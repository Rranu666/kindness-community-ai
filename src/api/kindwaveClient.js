import { createClient } from '@supabase/supabase-js';

// Separate Supabase project dedicated to the KindWave app.
// Set VITE_KW_SUPABASE_URL and VITE_KW_SUPABASE_ANON_KEY in Netlify
// environment variables after creating a new Supabase project and
// running kindwave-schema.sql in its SQL Editor.
const kwUrl = import.meta.env.VITE_KW_SUPABASE_URL;
const kwKey = import.meta.env.VITE_KW_SUPABASE_ANON_KEY;

export const kwSupabase = createClient(kwUrl, kwKey);
