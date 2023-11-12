"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePriceCondition = exports.parseWeightCondition = void 0;
const parseWeightCondition = (condition, measurement) => {
    const [minWeight, maxWeight] = condition.split('-').map((str) => str.replace(measurement, ''));
    return { minWeight, maxWeight };
};
exports.parseWeightCondition = parseWeightCondition;
const parsePriceCondition = (condition, currency) => {
    const [minPrice, maxPrice] = condition.split('-').map((str) => str.replace(currency, '').trim());
    return { minPrice, maxPrice };
};
exports.parsePriceCondition = parsePriceCondition;
