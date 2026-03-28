import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';

export function useContentBlocks(pageSlug) {
  return useQuery({
    queryKey: ['content_blocks', pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('page_slug', pageSlug)
        .order('block_key');
      if (error) throw error;
      return data;
    },
    enabled: !!pageSlug,
  });
}

export function useUpsertContentBlock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ page_slug, block_key, content, label, content_type }) => {
      const { data, error } = await supabase
        .from('content_blocks')
        .upsert({
          page_slug,
          block_key,
          content,
          label,
          content_type: content_type || 'text',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'page_slug,block_key' })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['content_blocks', vars.page_slug] }),
  });
}

export function useAddContentBlock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vals) => {
      const { data, error } = await supabase
        .from('content_blocks')
        .insert(vals)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['content_blocks', vars.page_slug] }),
  });
}

export function useDeleteContentBlock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, page_slug }) => {
      const { error } = await supabase.from('content_blocks').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['content_blocks', vars.page_slug] }),
  });
}

// For the main site - fetch all blocks for a page
export function useAllContentBlocks() {
  return useQuery({
    queryKey: ['content_blocks_all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*');
      if (error) throw error;
      // Return as a nested map: { [pageSlug]: { [blockKey]: content } }
      const map = {};
      (data || []).forEach(b => {
        if (!map[b.page_slug]) map[b.page_slug] = {};
        map[b.page_slug][b.block_key] = b.content;
      });
      return map;
    },
  });
}
