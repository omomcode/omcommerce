"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shipping_calc_1 = require("./shipping-calc");
const calculateMaxRate = (shippingRates, totalAmountValue, totalWeight, currency, timezone) => {
    let maxRate = 0;
    if (shippingRates && Array.isArray(shippingRates)) {
        for (const rate of shippingRates) {
            const { condition, price } = rate;
            if (condition.includes(currency.currency)) {
                const { minPrice, maxPrice } = (0, shipping_calc_1.parsePriceCondition)(rate.condition, currency.currency);
                const isWithinRange = totalAmountValue >= parseFloat(minPrice) && totalAmountValue <= parseFloat(maxPrice);
                if (maxRate === undefined || price > maxRate) {
                    maxRate = isWithinRange ? rate.price : maxRate;
                }
            }
            else if (condition.includes(timezone.unit)) {
                const { minWeight, maxWeight } = (0, shipping_calc_1.parseWeightCondition)(rate.condition, timezone.unit);
                const isWithinRange = totalWeight >= parseFloat(minWeight) && totalWeight <= parseFloat(maxWeight);
                if (maxRate === undefined || price > maxRate) {
                    maxRate = isWithinRange ? rate.price : maxRate;
                }
            }
            else {
                if (maxRate === undefined || (condition === "" && price > maxRate)) {
                    maxRate = price;
                }
            }
        }
    }
    return maxRate;
};
exports.default = calculateMaxRate;
