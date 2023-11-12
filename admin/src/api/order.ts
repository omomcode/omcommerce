import { request } from "@strapi/helper-plugin";

const orderRequests = {
  getAllOrders: async () => {
    try {
      return await request('/omcommerce/order/find?populate=*', {
        method: 'GET'
      });
    } catch (error) {
      throw error;
    }
  },
};

export default orderRequests;
