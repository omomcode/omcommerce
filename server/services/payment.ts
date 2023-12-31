import { Strapi } from '@strapi/strapi';
import {capturePayment, createOrder} from "../utils/payment/paypalPaymentHelper";
import axios from "axios";

export default ({ strapi }: { strapi: Strapi }) => ({

  async capture(data : any) {
    const orderID = data.orderID;
    try {
      const response = await capturePayment(orderID,strapi);
      return JSON.stringify(response);
    } catch (error) {
      return JSON.stringify({ error: 'Failed to capture order.' })
    }
  },

  async orders(data : any) {
    try {

      const response = await createOrder(data,strapi);

      return JSON.stringify(response);
    } catch (error: any) {
      console.log("greska", error)
      return JSON.stringify({error: error.message})
    }
  },

});
