"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(query) {
        return await strapi.entityService.findOne("plugin::omcommerce.paypalsetup", query);
    },
    async create(data) {
        return await strapi.entityService.create("plugin::omcommerce.paypalsetup", data);
    },
    async update(id, data) {
        return await strapi.entityService.update("plugin::omcommerce.paypalsetup", id, data);
    },
});
