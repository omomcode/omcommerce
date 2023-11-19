import { request } from "@strapi/helper-plugin";

const billingRequests = {
  getAllBilling: async () => {
    try {
      return await request('/omcommerce/billing/find', {
        method: "GET"
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  addBilling: async (data: any) => {
    try {
      return await request('/omcommerce/billing/create', {
        method: "POST",
        body: JSON.parse(JSON.stringify(data)),
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  editBilling: async (id: number, data: any) => {
    try {


      return await request(`/omcommerce/billing/update/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.parse(JSON.stringify(data)),
      });
    }
    catch (error) {
      console.error(error);
    }
  },
};

export default billingRequests;
