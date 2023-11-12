import axios from 'axios';
import {request} from "@strapi/helper-plugin";

const timezoneRequests = {
  getAllTimezone: async () => {
    try {
      return await request('/omcommerce/timezone/find', {
        method: "GET"
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  addTimezone: async (data: any) => {
    try {
      return await request('/omcommerce/timezone/create', {
        method: "POST",
        body: JSON.parse(JSON.stringify({data})),
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  editTimezone: async (id: number, data: any) => {
    try {

      return await request(`/omcommerce/timezone/update/${id}`, {
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

export default timezoneRequests;
