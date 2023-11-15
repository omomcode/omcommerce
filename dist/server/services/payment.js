"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paypalPaymentHelper_1 = require("../utils/payment/paypalPaymentHelper");
exports.default = ({ strapi }) => ({
    async capture(data) {
        const orderID = data.orderID;
        try {
            const response = await (0, paypalPaymentHelper_1.capturePayment)(orderID, strapi);
            return JSON.stringify(response);
        }
        catch (error) {
            console.error('Failed to create order:', error);
            return JSON.stringify({ error: 'Failed to capture order.' });
        }
    },
    async orders(data) {
        try {
            const response = await (0, paypalPaymentHelper_1.createOrder)(data, strapi);
            return JSON.stringify(response);
        }
        catch (error) {
            console.error('Failed to create order:', error);
            // res.status(500).json({ error: 'Failed to create order.' });
            return JSON.stringify({ error: 'Failed to create order.' });
        }
    },
});
