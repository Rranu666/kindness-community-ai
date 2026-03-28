import { useState, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';

let _cache = null;

export function usePageVisibility() {
  const [visibility, setVisibility] = useState(_cache || {});

  useEffect(() => {
    if (_cache) { setVisibility(_cache); return; }
    supabase
      .from('page_visibility')
      .select('page_slug, is_visible')
      .then(({ data }) => {
        if (data) {
          const map = {};
          data.forEach(p => { map[p.page_slug] = p.is_visible; });
          _cache = map;
          setVisibility(map);
        }
      });
  }, []);

  const isVisible = (slug) => visibility[slug] !== false; // default true if not in DB
  return { visibility, isVisible };
}
