"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shipping_calc_1 = require("../utils/shipping-calculator/shipping-calc");
const country_helper_1 = require("../../admin/src/utils/country-helper/country-helper");
exports.default = ({ strapi }) => ({
    async calculate(data) {
        const products = [];
        const country_code = data.data.country_code;
        const findProduct = async (query) => {
            return await strapi.entityService.findMany("plugin::omcommerce.product", query);
        };
        const findShippingZone = async (query) => {
            return await strapi.entityService.findMany("plugin::omcommerce.shippingzone", query);
        };
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
                const product = await findProduct(query);
                if (product) {
                    products.push(product);
                }
            }
        };
        const findTimezone = async (query) => {
            return await strapi.entityService.findOne("plugin::omcommerce.zone", query);
        };
        const findCurrency = async (query) => {
            return await strapi.entityService.findOne("plugin::omcommerce.currency", query);
        };
        const handleResult = async () => {
            const szQuery = { populate: '*' };
            const sz = await findShippingZone(szQuery);
            const { totalAmountValue, totalWeight } = calculateTotalValues(products);
            const currency = await findCurrency({});
            const timezone = await findTimezone({});
            const resolvedZone = (0, country_helper_1.findShippingZoneBasedOnCountry)(country_code, sz);
            console.log("RESOLVED ZONE? in calculate");
            console.log(resolvedZone);
            // @ts-ignore
            // const rate = resolvedZone.shippingrate[0];
            // @ts-ignore
            const shippingRates = resolvedZone === null || resolvedZone === void 0 ? void 0 : resolvedZone.shippingrate;
            let maxRate = undefined;
            for (const rate of shippingRates) {
                const { condition, price } = rate;
                // @ts-ignore
                if (condition.includes(currency.currency)) {
                    // @ts-ignore
                    const { minPrice, maxPrice } = (0, shipping_calc_1.parsePriceCondition)(rate.condition, currency.currency);
                    const isWithinRange = totalAmountValue >= parseFloat(minPrice) && totalAmountValue <= parseFloat(maxPrice);
                    if (maxRate === undefined || price > maxRate) {
                        maxRate = isWithinRange ? rate.price : 0;
                    }
                }
                else { // @ts-ignore
                    if (condition.includes(timezone.unit)) {
                        // @ts-ignore
                        const { minWeight, maxWeight } = (0, shipping_calc_1.parseWeightCondition)(rate.condition, timezone.unit);
                        const isWithinRange = totalWeight >= parseFloat(minWeight) && totalWeight <= parseFloat(maxWeight);
                        if (maxRate === undefined || price > maxRate) {
                            maxRate = isWithinRange ? rate.price : 0;
                        }
                    }
                    else {
                        // console.log(rate.price);
                        if (maxRate === undefined || price > maxRate) {
                            maxRate = price;
                        }
                    }
                }
            }
            return maxRate;
        };
        const handleError = (error) => {
            console.error("Error while finding products for the cart:", error);
        };
        return await findProductsForCart()
            .then(handleResult)
            .catch(handleError);
    }
});
