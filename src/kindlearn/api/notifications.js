import client from './client';

export const notificationsApi = {
  filter: async (params = {}) => {
    const { data } = await client.get('/api/notifications', { params });
    return data;
  },

  create: async (payload) => {
    const { data } = await client.post('/api/notifications', payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await client.put(`/api/notifications/${id}`, payload);
    return data;
  },

  // Polling-based subscription replacement
  subscribe: (callback) => {
    const poll = async () => {
      try {
        const { data } = await client.get('/api/notifications', {
          params: { dismissed: false }
        });
        callback({ type: 'list', data });
      } catch { /* ignore */ }
    };
    poll();
    const interval = setInterval(poll, 30000);
    return () => clearInterval(interval);
  }
};
