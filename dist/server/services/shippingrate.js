"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(query) {
        console.log("QUERYQUERY");
        console.log(query);
        return await strapi.entityService.findMany("plugin::omcommerce.shippingrate", query);
    },
    async create(data) {
        return await strapi.entityService.create("plugin::omcommerce.shippingrate", data);
    },
    async update(id, data) {
        return await strapi.entityService.update("plugin::omcommerce.shippingrate", id, data);
    },
    async delete(id) {
        return await strapi.entityService.delete("plugin::omcommerce.shippingrate", id);
    },
});
