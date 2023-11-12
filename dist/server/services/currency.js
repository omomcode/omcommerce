"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(query) {
        return await strapi.entityService.findOne("plugin::omcommerce.currency", query);
    },
    async create(data) {
        return await strapi.entityService.create("plugin::omcommerce.currency", data);
    },
    async update(id, data) {
        return await strapi.entityService.update("plugin::omcommerce.currency", id, data);
    },
});
