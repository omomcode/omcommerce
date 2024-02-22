import {request} from "@strapi/helper-plugin";

const productcmsRequests = {
  getAllProductscms: async () => {
    try {
      return await request('/omcommerce/productcms/find?populate=*', {
        method: "GET"
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  addProductcms: async (data: any) => {
    try {
      return await request('/omcommerce/productcms/create', {
        method: "POST",
        body: JSON.parse(JSON.stringify(data)),
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  editProductcms: async (id: number, data: any) => {
    try {
      return await request(`/omcommerce/productcms/update/${id}`, {
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
  deleteProductcms: async (id: number) => {
    try {

      return await request(`/omcommerce/productcms/delete/${id}`, {
        method: "DELETE",
      });
    }
    catch (error) {
      console.error(error);
    }
  },
};

export default productcmsRequests;
