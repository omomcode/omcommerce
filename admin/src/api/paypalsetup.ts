import { request } from "@strapi/helper-plugin";

const paypalSetupRequests = {
  getAllPaypalSetups: async () => {
    try {
      return await request('/omcommerce/paypalsetup/find', {
        method: 'GET'
      });
    } catch (error) {
      throw error;
    }
  },
  addPaypalSetup: async (data: any) => {
    try {
      return await request('/omcommerce/paypalsetup/create', {
        method: 'POST',
        body: JSON.parse(JSON.stringify({data}))
      });
    } catch (error) {
      throw error;
    }
  },

  editPaypalSetup: async (id: number, data: any) => {
    try {
      return  await request(`/omcommerce/paypalsetup/update/${id}`, {
        method: 'PUT',
        body: JSON.parse(JSON.stringify({data}))
      });
    } catch (error) {
      throw error;
    }
  },
};

export default paypalSetupRequests;
