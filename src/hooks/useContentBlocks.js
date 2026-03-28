import { useState, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';

let _cache = null;

export function useContentBlocks() {
  const [blocks, setBlocks] = useState(_cache || {});

  useEffect(() => {
    if (_cache) { setBlocks(_cache); return; }
    supabase
      .from('content_blocks')
      .select('page_slug, block_key, content')
      .then(({ data }) => {
        if (data) {
          const map = {};
          data.forEach(b => {
            if (!map[b.page_slug]) map[b.page_slug] = {};
            map[b.page_slug][b.block_key] = b.content;
          });
          _cache = map;
          setBlocks(map);
        }
      });
  }, []);

  // Get text for a specific page+key, fallback to default if not set
  const t = (pageSlug, key, defaultText = '') => {
    const val = blocks[pageSlug]?.[key];
    return (val !== undefined && val !== null && val !== '') ? val : defaultText;
  };

  return { blocks, t };
}
