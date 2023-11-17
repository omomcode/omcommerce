"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(query) {
        if (strapi.entityService) {
            return await strapi.entityService.findOne("plugin::omcommerce.billing", query);
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
    async create(data) {
        if (strapi.entityService) {
            if (data && data.name
                && data.country && data.address &&
                data.apartment &&
                data.postal && data.city) {
                const billing = await strapi.entityService.create("plugin::omcommerce.billing", data);
                if (billing.data === data) {
                    return billing.data;
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
            if (id && data && data.name
                && data.country && data.address &&
                data.apartment &&
                data.postal && data.city) {
                const billing = await strapi.entityService.update("plugin::omcommerce.billing", id, data);
                if (billing.data === data) {
                    return billing.data;
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
