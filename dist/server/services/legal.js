"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(query) {
        if (strapi.entityService) {
            return await strapi.entityService.findOne("plugin::omcommerce.legal", query);
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
    async create(data) {
        if (strapi.entityService) {
            if (data &&
                data.enable &&
                (data.returnPolicy || !(data.returnWindow || data.restockingFee || data.returnShippingCost))) {
                const legal = await strapi.entityService.create("plugin::omcommerce.legal", data);
                if (legal) {
                    return legal;
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
            throw new Error("strapi.entityService is not defined");
        }
    },
    async update(id, data) {
        if (strapi.entityService) {
            if (id &&
                data &&
                data.enable &&
                (data.returnPolicy || !(data.returnWindow || data.restockingFee || data.returnShippingCost))) {
                const legal = await strapi.entityService.update("plugin::omcommerce.legal", id, { data });
                if (legal) {
                    return legal;
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
            throw new Error("strapi.entityService is not defined");
        }
    },
});
