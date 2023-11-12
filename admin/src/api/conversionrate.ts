import { request } from "@strapi/helper-plugin";

const conversionRequests = {
  getAllConversionRate: async () => {
    try {
      return await request('/omcommerce/conversionrate/find', {
        method: "GET"
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  addConversion: async (data: any) => {
    try {
      return await request('/omcommerce/conversionrate/create', {
        method: "POST",
        body: JSON.parse(JSON.stringify({data})),
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  editConversion: async (id: number, data: any) => {
    try {

      console.log("DATA");
      console.log(data);

      return await request(`/omcommerce/conversionrate/update/${id}`, {
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

export default conversionRequests;
