"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const country_helper_1 = require("../../admin/src/utils/country-helper/country-helper");
const entity_helper_1 = require("../utils/entity-helper/entity-helper");
const shipping_rate_calc_1 = __importDefault(require("../utils/shipping-calculator/shipping-rate-calc"));
exports.default = ({ strapi }) => ({
    async calculate(data) {
        const products = [];
        const country_code = data.data.country_code;
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
        const findProductsForCart = async () => {
            for (const item of data.data.cart) {
                // const product = await getProduct(item.id);
                // const query = `populate=*&[filters][id][$eq]=${item.id}`
                const query = { populate: '*', filters: { id: { '$eq': item.id.toString() } } };
                const product = await (0, entity_helper_1.findProduct)(strapi, query);
                if (product) {
                    products.push(product);
                }
            }
        };
        const handleResult = async () => {
            const szQuery = { populate: '*' };
            const sz = await (0, entity_helper_1.findShippingZone)(strapi, szQuery);
            const { totalAmountValue, totalWeight } = calculateTotalValues(products);
            const currency = await (0, entity_helper_1.findCurrency)(strapi, {});
            const timezone = await (0, entity_helper_1.findTimezone)(strapi, {});
            const resolvedZone = (0, country_helper_1.findShippingZoneBasedOnCountry)(country_code, sz);
            // @ts-ignore
            // if (resolvedZone) {
            return (0, shipping_rate_calc_1.default)(resolvedZone.shippingrate, totalAmountValue, totalWeight, currency, timezone);
            // } else {
            //   // Handle the case where shippingRates is not iterable
            //   console.error('Shipping rates are not iterable');
            //   return null; // or handle it according to your requirements
            // }
        };
        const handleError = (error) => {
            console.error("Error while finding products for the cart:", error);
            return Promise.reject(error);
        };
        return await findProductsForCart()
            .then(handleResult)
            .catch(handleError);
    }
});
