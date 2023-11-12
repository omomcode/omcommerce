"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(query) {
        return await strapi.entityService.findOne("plugin::omcommerce.setup", query);
    },
    async create(data) {
        return await strapi.entityService.create("plugin::omcommerce.setup", data);
    },
    async update(id, data) {
        return await strapi.entityService.update("plugin::omcommerce.setup", id, data);
    },
});
