import { request } from "@strapi/helper-plugin";

const currencyRequests = {
  getAllCurrency: async () => {
    try {
      return await request('/omcommerce/currency/find', {
        method: "GET"
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  addCurrency: async (data: any) => {
    try {
      return await request('/omcommerce/currency/create', {
        method: "POST",
        body: JSON.parse(JSON.stringify({data})),
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  editCurrency: async (id: number, data: any) => {
    try {

      return await request(`/omcommerce/currency/update/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.parse(JSON.stringify({data})),
      });
    }
    catch (error) {
      console.error(error);
    }
  },
};

export default currencyRequests;
