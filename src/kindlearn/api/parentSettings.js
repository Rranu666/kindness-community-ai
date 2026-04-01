import client from './client';

export const parentSettingsApi = {
  list: async () => {
    const { data } = await client.get('/api/parent-settings');
    return data;
  },

  create: async (payload) => {
    const { data } = await client.post('/api/parent-settings', payload);
    return data;
  },

  update: async (id, payload) => {
    const { data } = await client.put(`/api/parent-settings/${id}`, payload);
    return data;
  }
};
