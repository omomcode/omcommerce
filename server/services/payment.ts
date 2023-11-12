import { Strapi } from '@strapi/strapi';
import {capturePayment, createOrder} from "../utils/payment/paypalPaymentHelper";
import axios from "axios";

export default ({ strapi }: { strapi: Strapi }) => ({

  async capture(data) {
    const orderID = data.orderID;
    console.dir(data);
    try {
      const response = await capturePayment(orderID,strapi);
      return JSON.stringify(response);
    } catch (error) {
      console.error('Failed to create order:', error);
      return JSON.stringify({ error: 'Failed to capture order.' })
    }
  },

  async orders(data) {
    try {
      const response = await createOrder(data,strapi);
      // res.json(response);
      return JSON.stringify(response);
    } catch (error) {
      console.error('Failed to create order:', error);
      // res.status(500).json({ error: 'Failed to create order.' });
      return JSON.stringify({ error: 'Failed to create order.' })
    }
  },

});
