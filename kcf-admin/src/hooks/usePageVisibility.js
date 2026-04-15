import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';

export function usePageVisibility() {
  return useQuery({
    queryKey: ['page_visibility'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_visibility')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdatePageVisibility() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ page_slug, page_name, nav_label, updates }) => {
      const { data, error } = await supabase
        .from('page_visibility')
        .upsert(
          {
            page_slug,
            page_name: page_name || page_slug,
            nav_label: nav_label || page_name || page_slug,
            ...updates,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'page_slug' }
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['page_visibility'] }),
  });
}
