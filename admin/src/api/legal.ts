import { request } from "@strapi/helper-plugin";

const legalRequests = {
  getAllLegals: async () => {
    try {
      return await request('/omcommerce/legal/find', {
        method: "GET"
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  addLegal: async (data: any) => {
    try {
      return await request('/omcommerce/legal/create', {
        method: "POST",
        body: JSON.parse(JSON.stringify(data)),
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  editLegal: async (id: number, data: any) => {
    try {
      return await request(`/omcommerce/legal/update/${id}`, {
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

export default legalRequests;
