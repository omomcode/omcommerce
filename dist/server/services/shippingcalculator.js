"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const country_helper_1 = require("../utils/country-helper/country-helper");
const shipping_rate_calc_1 = __importDefault(require("../utils/shipping-calculator/shipping-rate-calc"));
const calculateTotalValues = (products) => {
    let totalAmountValue = 0;
    let totalWeight = 0;
    for (const productArray of products) {
        for (const product of productArray) {
            if (product.amount_value) {
                totalAmountValue += product.amount_value;
            }
            if (product.weight) {
                totalWeight += product.weight;
            }
        }
    }
    return {
        totalAmountValue,
        totalWeight
    };
};
exports.default = ({ strapi }) => ({
    async calculate(data) {
        const products = [];
        const country_code = data.data.country_code;
        const findProductsForCart = async () => {
            for (const item of data.data.cart) {
                const query = { populate: '*', filters: { id: { '$eq': item.id.toString() } } };
                const product = await strapi.plugin("omcommerce").service("product").find(query);
                // const product = await strapi.services.omcommerce.product.find(query);
                if (product) {
                    products.push(product);
                }
            }
        };
        const handleResult = async () => {
            const szQuery = { populate: '*' };
            // const sz = await findShippingZone(strapi,szQuery);
            const sz = await strapi.plugin("omcommerce").service("shippingzone").find(szQuery);
            const { totalAmountValue, totalWeight } = calculateTotalValues(products);
            const currency = await strapi.plugin("omcommerce").service("currency").find({});
            const timezone = await strapi.plugin("omcommerce").service("timezone").find({});
            const resolvedZone = (0, country_helper_1.findShippingZoneBasedOnCountry)(country_code, sz);
            // @ts-ignore
            return (0, shipping_rate_calc_1.default)(resolvedZone.shippingrate, totalAmountValue, totalWeight, currency, timezone);
        };
        // const handleError = (error: any) => {
        //   console.error("Error while finding products for the cart:", error);
        //   return Promise.reject(error);
        // };
        return await findProductsForCart()
            .then(handleResult);
    }
});
