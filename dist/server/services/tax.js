"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(query) {
        return await strapi.entityService.findMany("plugin::omcommerce.tax", query);
    },
    async create(data) {
        return await strapi.entityService.create("plugin::omcommerce.tax", data);
    },
    async update(id, data) {
        return await strapi.entityService.update("plugin::omcommerce.tax", id, data);
    },
    async delete(id) {
        return await strapi.entityService.delete("plugin::omcommerce.tax", id);
    },
});
