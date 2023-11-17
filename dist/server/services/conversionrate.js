"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(query) {
        if (strapi.entityService) {
            return await strapi.entityService.findOne("plugin::omcommerce.conversionrate", query);
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
    async create(data) {
        if (strapi.entityService) {
            if (data.id && data && data.rate
                && data.spread && data.conversion_currency) {
                const conversion = await strapi.entityService.create("plugin::omcommerce.profile", data);
                if (conversion.data === data) {
                    return conversion.data;
                }
                else {
                    throw new Error("Invalid database data");
                }
            }
            else {
                throw new Error("Invalid data");
            }
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
    async update(id, data) {
        if (strapi.entityService) {
            if (id && data && data.rate
                && data.spread && data.conversion_currency) {
                const conversion = await strapi.entityService.update("plugin::omcommerce.conversionrate", id, data);
                if (conversion.data === data) {
                    return conversion.data;
                }
                else {
                    throw new Error("Invalid database data");
                }
            }
            else {
                throw new Error("Invalid data");
            }
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
});
