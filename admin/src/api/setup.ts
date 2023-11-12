import { request } from "@strapi/helper-plugin";

const setupRequests = {
  getAllSetups: async () => {
    try {
      return await request('/omcommerce/setup/find', {
        method: "GET"
      });
    }
    catch (error) {
      console.error(error);
      return undefined;
    }
  },

  addSetup: async (data: any) => {
    try {
      return await request('/omcommerce/setup/create', {
        method: "POST",
        body: JSON.parse(JSON.stringify({data})),
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  editSetup: async (id: number, data: any) => {
    try {
      return await request(`/omcommerce/setup/update/${id}`, {
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

export default setupRequests;
