import client from './client';

export const contactApi = {
  send: async (form) => {
    const { data } = await client.post('/api/contact', form);
    return data;
  }
};
