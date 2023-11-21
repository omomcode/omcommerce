import {request} from "@strapi/helper-plugin";

const shippingcalclulatorRequests = {

  calculate: async (data: any) => {
    try {
      return await request('/omcommerce/shippingrate/calculate', {
        method: "POST",
        body: JSON.parse(JSON.stringify(data)),
      });
    }
    catch (error) {
      console.error(error);
    }
    // try {
    //   const response = await axios.post('/omcommerce/shippingcalculator/calculate',  data );
    //   return response.data;
    // } catch (error) {
    //   throw error;
    // }
  },

}
export default shippingcalclulatorRequests;
