import { request } from "@strapi/helper-plugin";

const profileRequests = {
  getAllProfiles: async () => {
    try {
      return await request('/omcommerce/profile/find', {
        method: "GET"
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  addProfile: async (data: any) => {
    try {
      return await request('/omcommerce/profile/create', {
        method: "POST",
        body: JSON.parse(JSON.stringify({data})),
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  editProfile: async (id: number, data: any) => {
    try {
        return await request(`/omcommerce/profile/update/${id}`, {
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

export default profileRequests;
