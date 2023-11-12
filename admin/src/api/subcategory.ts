import {request} from "@strapi/helper-plugin";

const subCategoryRequests = {
  getAllSubCategories: async () => {
    try {
      return await request('/omcommerce/subcategory/find?populate=*', {
        method: "GET"
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  addSubCategory: async (data: any) => {
    try {
      return await request('/omcommerce/subcategory/create', {
        method: "POST",
        body: JSON.parse(JSON.stringify({data})),
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  editSubCategory: async (id: number, data: any) => {
    try {
      return await request(`/omcommerce/subcategory/update/${id}`, {
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
  deleteSubCategory: async (id: number) => {
    try {

      return await request(`/omcommerce/subcategory/delete/${id}`, {
        method: "PUT",
      });
    }
    catch (error) {
      console.error(error);
    }
  },
};

export default subCategoryRequests;
