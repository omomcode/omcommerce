"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(id) {
        return await strapi.entityService.findOne("plugin::omcommerce.social", id);
    },
    async create(data) {
        return await strapi.entityService.create("plugin::omcommerce.social", data);
    },
    async update(id, data) {
        return await strapi.entityService.update("plugin::omcommerce.social", id, data);
    },
});
