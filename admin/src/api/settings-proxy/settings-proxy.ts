import { request } from '@strapi/helper-plugin';

const settingsProxy = {
  get: async () => {
    const data = await request(`/omcommerce/settings`, {
      method: 'GET'
    });
    return data;
  },
  set: async (data: any) => {
    return await request(`/omcommerce/settings`, {
      method: 'POST',
      body: data
    });
  }
}
export default settingsProxy;
