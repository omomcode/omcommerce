"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(query) {
        if (strapi.entityService) {
            return await strapi.entityService.findMany("plugin::omcommerce.product", {
                fields: [
                    'id',
                    'description',
                    'amount_currency_code',
                    'amount_value',
                    'amount_value_converted',
                    'Quantity',
                    'weight',
                    'measurement_unit',
                    'title',
                    'slug',
                ],
                populate: { media: true, categories: true },
                filters: query.filters
            });
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
    async findOne(id) {
        if (strapi.entityService) {
            if (id) {
                const product = await strapi.entityService.findOne("plugin::omcommerce.product", id);
                if (product) {
                    return product;
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
                data.title &&
                data.slug &&
                data.showQuantity) {
                const product = await strapi.entityService.create("plugin::omcommerce.product", data);
                if (product) {
                    return product;
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
                data.title &&
                data.slug &&
                data.showQuantity) {
                const product = await strapi.entityService.update("plugin::omcommerce.product", id, { data });
                if (product) {
                    return product;
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
                const product = await strapi.entityService.delete("plugin::omcommerce.product", id);
                if (product) {
                    return product;
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
