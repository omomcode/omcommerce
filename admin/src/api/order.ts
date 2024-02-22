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
  deleteOrder: async (id: number) => {
    try {

      return await request(`/omcommerce/order/delete/${id}`, {
        method: "DELETE",
      });
    }
    catch (error) {
      console.error(error);
    }
  },
};

export default orderRequests;
