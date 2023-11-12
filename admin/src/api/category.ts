import {request} from "@strapi/helper-plugin";

const categoryRequests = {
  getAllCategories: async () => {
    try {
      return await request('/omcommerce/category/find?populate=*', {
        method: "GET"
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  addCategory: async (data: any) => {
    try {
      return await request('/omcommerce/category/create', {
        method: "POST",
        body: JSON.parse(JSON.stringify({data})),
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  editCategory: async (id: number, data: any) => {
    try {
      return await request(`/omcommerce/category/update/${id}`, {
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
  deletecategory: async (id: number) => {
    try {

      return await request(`/omcommerce/category/delete/${id}`, {
        method: "PUT",
      });
    }
    catch (error) {
      console.error(error);
    }
  },
};

export default categoryRequests;
