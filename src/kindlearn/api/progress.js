import client from './client';

export const progressApi = {
  filter: async (params = {}) => {
    const { data } = await client.get('/api/progress', { params });
    return data;
  },

  list: async () => {
    const { data } = await client.get('/api/progress');
    return data;
  },

  create: async (payload) => {
    const { data } = await client.post('/api/progress', payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await client.put(`/api/progress/${id}`, payload);
    return data;
  },

  leaderboard: async (language, mode = 'adult') => {
    const { data } = await client.get('/api/progress/leaderboard', { params: { language, mode } });
    return data;
  }
};
