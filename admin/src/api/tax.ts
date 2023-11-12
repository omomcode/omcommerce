import {request} from "@strapi/helper-plugin";

const taxRequests = {
  getAllTaxes: async () => {
    try {
      return await request('/omcommerce/tax/find?populate=*', {
        method: "GET"
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  addTax: async (data: any) => {
    try {
      return await request('/omcommerce/tax/create', {
        method: "POST",
        body: JSON.parse(JSON.stringify({data})),
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  editTax: async (id: number, data: any) => {
    try {

      return await request(`/omcommerce/tax/update/${id}`, {
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
  deleteTax: async (id: number) => {
    try {

      return await request(`/omcommerce/tax/delete/${id}`, {
        method: "DELETE",
      });
    }
    catch (error) {
      console.error(error);
    }
  },
};

export default taxRequests;
