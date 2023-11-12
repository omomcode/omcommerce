"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(query) {
        const tempData = await strapi.entityService.findOne("plugin::omcommerce.profile", query);
        const newData = {
            id: tempData.id,
            name: tempData.name,
            phone: tempData.phone,
            email: tempData.email,
            region: tempData.region
        };
        return newData;
    },
    async create(data) {
        return await strapi.entityService.create("plugin::omcommerce.profile", data);
    },
    async update(id, data) {
        const tempData = await strapi.entityService.update("plugin::omcommerce.profile", id, data);
        const newData = {
            id: tempData.id,
            name: tempData.name,
            phone: tempData.phone,
            email: tempData.email,
            region: tempData.region
        };
        return newData;
    },
});
