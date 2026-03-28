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
    mutationFn: async ({ page_slug, updates }) => {
      const { data, error } = await supabase
        .from('page_visibility')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('page_slug', page_slug)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['page_visibility'] }),
  });
}
