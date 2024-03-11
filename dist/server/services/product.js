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
            return await strapi.entityService.findOne("plugin::omcommerce.product", id);
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
    async create(data) {
        if (strapi.entityService) {
            try {
                const prod = await strapi.entityService.create("plugin::omcommerce.product", { data });
                return prod;
            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
    async update(id, data) {
        if (strapi.entityService) {
            return await strapi.entityService.update("plugin::omcommerce.product", id, { data });
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
    async delete(id) {
        if (strapi.entityService) {
            return await strapi.entityService.delete("plugin::omcommerce.product", id);
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
});
