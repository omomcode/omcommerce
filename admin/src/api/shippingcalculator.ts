import axios from 'axios';

const shippingcalclulatorRequests = {

  calculate: async (data: any) => {
    try {
      const response = await axios.post('/omcommerce/shippingcalculator/calculate', { data });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

}
export default shippingcalclulatorRequests;
