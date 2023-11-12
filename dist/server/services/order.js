"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(query) {
        return await strapi.entityService.findMany("plugin::omcommerce.order", query);
    },
    async findOne(id) {
        return await strapi.entityService.findOne("plugin::omcommerce.order", id);
    },
    async create(data) {
        return await strapi.entityService.create("plugin::omcommerce.order", data);
    },
    async update(id, data) {
        return await strapi.entityService.update("plugin::omcommerce.order", id, data);
    },
    async delete(id) {
        return await strapi.entityService.delete("plugin::omcommerce.order", id);
    },
});
