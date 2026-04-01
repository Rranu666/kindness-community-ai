import client from './client';

export const authApi = {
  register: async (email, password, name) => {
    const { data } = await client.post('/api/auth/register', { email, password, name });
    if (data.token) localStorage.setItem('kl_token', data.token);
    return data;
  },

  login: async (email, password) => {
    const { data } = await client.post('/api/auth/login', { email, password });
    if (data.token) localStorage.setItem('kl_token', data.token);
    return data;
  },

  me: async () => {
    const { data } = await client.get('/api/auth/me');
    return data;
  },

  updateMe: async (updates) => {
    const { data } = await client.put('/api/auth/me', updates);
    return data;
  },

  logout: () => {
    localStorage.removeItem('kl_token');
  },

  uploadFile: async (file) => {
    const form = new FormData();
    form.append('file', file);
    const { data } = await client.post('/api/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }
};
