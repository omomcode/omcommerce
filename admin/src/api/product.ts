import {request} from "@strapi/helper-plugin";

const productRequests = {
  getAllProducts: async () => {
    try {
      return await request('/omcommerce/product/find?populate=*', {
        method: "GET"
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  addProduct: async (data: any) => {
    console.log("dejtra", data)
    try {
      if (Object.keys(data).length === 0) {
        throw new Error("Data object is empty");
      }
      const requestData = JSON.parse(JSON.stringify(data));
      return await request('/omcommerce/product/create', {
        method: "POST",
        body: requestData,
      });
    } catch (error) {
      console.error(error);
    }
  },

  editProduct: async (id: number, data: any) => {
    try {
      return await request(`/omcommerce/product/update/${id}`, {
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
  deleteProduct: async (id: number) => {
    try {

      return await request(`/omcommerce/product/delete/${id}`, {
        method: "DELETE",
      });
    }
    catch (error) {
      console.error(error);
    }
  },
};

export default productRequests;
