import {request} from "@strapi/helper-plugin";

const packagesRequests = {
  getAllPackages: async () => {
    try {
      return await request('/omcommerce/shippingpackage/find?populate=*', {
        method: "GET"
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  addPackages: async (data: any) => {
    try {
      return await request('/omcommerce/shippingpackage/create', {
        method: "POST",
        body: JSON.parse(JSON.stringify(data)),
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  editPackages: async (id: number, data: any) => {
    try {
      return await request(`/omcommerce/shippingpackage/update/${id}`, {
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
  deletePackages: async (id: number) => {
    try {

      return await request(`/omcommerce/shippingpackage/delete/${id}`, {
        method: "DELETE",
      });
    }
    catch (error) {
      console.error(error);
    }
  },
};

export default packagesRequests;
