"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(query) {
        if (strapi.entityService) {
            const tempData = await strapi.entityService.findOne("plugin::omcommerce.profile", query);
            const newData = {
                id: tempData === null || tempData === void 0 ? void 0 : tempData.id,
                name: tempData === null || tempData === void 0 ? void 0 : tempData.name,
                phone: tempData === null || tempData === void 0 ? void 0 : tempData.phone,
                email: tempData === null || tempData === void 0 ? void 0 : tempData.email,
                region: tempData === null || tempData === void 0 ? void 0 : tempData.region
            };
            return newData;
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
    async create(data) {
        if (strapi.entityService) {
            return await strapi.entityService.create("plugin::omcommerce.profile", data);
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
    async update(id, data) {
        if (strapi.entityService) {
            const tempData = await strapi.entityService.update("plugin::omcommerce.profile", id, data);
            const newData = {
                id: tempData === null || tempData === void 0 ? void 0 : tempData.id,
                name: tempData === null || tempData === void 0 ? void 0 : tempData.name,
                phone: tempData === null || tempData === void 0 ? void 0 : tempData.phone,
                email: tempData === null || tempData === void 0 ? void 0 : tempData.email,
                region: tempData === null || tempData === void 0 ? void 0 : tempData.region
            };
            return newData;
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
});
