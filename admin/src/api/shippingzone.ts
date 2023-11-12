import {request} from "@strapi/helper-plugin";

const shippingZoneRequests = {
  getAllShippingZones: async () => {
    try {
      return await request('/omcommerce/shippingzone/find?populate=*', {
        method: "GET"
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  addShippingZone: async (data: any) => {
    try {
      return await request('/omcommerce/shippingzone/create', {
        method: "POST",
        body: JSON.parse(JSON.stringify({data})),
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  editShippingZone: async (id: number, data: any) => {
    try {

      return await request(`/omcommerce/shippingzone/update/${id}`, {
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
  deleteShippingZone: async (id: number) => {
    try {

      return await request(`/omcommerce/shippingzone/delete/${id}`, {
        method: "DELETE",
      });
    }
    catch (error) {
      console.error(error);
    }
  },
};

export default shippingZoneRequests;
