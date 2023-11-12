import { request } from "@strapi/helper-plugin";


const gmailRequests = {


  getAllGmail: async () => {

    try {
      return await request('/omcommerce/gmail/find', {
        method: 'GET'
      })
    }
    catch (error) {
      console.error(error);
    }
  },


  addGmail: async (data: any) => {

    try {
      return await request('/omcommerce/gmail/create', {
        method: 'POST',
        body: JSON.parse(JSON.stringify({data})),
      });
    }
    catch (error) {
      console.error(error);
    }
  },

  editGmail: async (id: number, data: any) => {
    try {
       return await request(`/omcommerce/gmail/update/${id}`, {
         method: 'PUT',
         body: JSON.parse(JSON.stringify({data})),
       });
    }
    catch (error) {
      console.error(error);
    }
  },
};

export default gmailRequests;
