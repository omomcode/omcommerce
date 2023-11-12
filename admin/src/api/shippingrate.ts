import {request} from "@strapi/helper-plugin";

const shippingRateRequests = {
  getAllShippingRates: async () => {
    try {
      return await request('/omcommerce/shippingrate/find', {
        method: "GET"
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  addShippingRate: async (data: any) => {
    try {
      return await request('/omcommerce/shippingrate/create', {
        method: "POST",
        body: JSON.parse(JSON.stringify({data})),
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  editShippingRate: async (id: number, data: any) => {
    try {

      console.log("DATA");
      console.log(data);

      return await request(`/omcommerce/shippingrate/update/${id}`, {
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
  deleteShippingRate: async (id: number) => {
    try {

      return await request(`/omcommerce/shippingrate/delete/${id}`, {
        method: "DELETE",
      });
    }
    catch (error) {
      console.error(error);
    }
  },
};

export default shippingRateRequests;
