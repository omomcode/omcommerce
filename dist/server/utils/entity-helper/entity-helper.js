"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCurrency = exports.findTimezone = exports.findShippingZone = exports.findProduct = void 0;
const findProduct = async (strapi, query) => {
    if (strapi.entityService) {
        return await strapi.entityService.findMany("plugin::omcommerce.product", query);
    }
    else {
        throw new Error('strapi.entityService is not defined');
    }
};
exports.findProduct = findProduct;
const findShippingZone = async (strapi, query) => {
    if (strapi.entityService) {
        return await strapi.entityService.findMany("plugin::omcommerce.shippingzone", query);
    }
    else {
        throw new Error('strapi.entityService is not defined');
    }
};
exports.findShippingZone = findShippingZone;
const findTimezone = async (strapi, query) => {
    if (strapi.entityService) {
        return await strapi.entityService.findOne("plugin::omcommerce.zone", query);
    }
    else {
        throw new Error('strapi.entityService is not defined');
    }
};
exports.findTimezone = findTimezone;
const findCurrency = async (strapi, query) => {
    if (strapi.entityService) {
        return await strapi.entityService.findOne("plugin::omcommerce.currency", query);
    }
    else {
        throw new Error('strapi.entityService is not defined');
    }
};
exports.findCurrency = findCurrency;
