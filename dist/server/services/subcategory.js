"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(query) {
        if (strapi.entityService) {
            const tempData = await strapi.entityService.findMany("plugin::omcommerce.subcategory", {
                query,
                fields: [
                    "title",
                ],
            });
            return tempData;
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
    async findOne(id) {
        if (strapi.entityService) {
            if (id) {
                const subcategory = await strapi.entityService.findOne("plugin::omcommerce.subcategory", id);
                if (subcategory) {
                    return subcategory;
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
    async create(data) {
        if (strapi.entityService) {
            if (data &&
                data.title) {
                const subcategory = await strapi.entityService.create("plugin::omcommerce.subcategory", data);
                if (subcategory) {
                    return subcategory;
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
                data.title) {
                const subcategory = await strapi.entityService.update("plugin::omcommerce.subcategory", id, { data });
                if (subcategory) {
                    return subcategory;
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
    async delete(id) {
        if (strapi.entityService) {
            if (id) {
                const subcategory = await strapi.entityService.delete("plugin::omcommerce.subcategory", id);
                if (subcategory) {
                    return subcategory;
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
