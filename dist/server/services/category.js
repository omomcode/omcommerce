"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(query) {
        if (strapi.entityService) {
            const tempData = await strapi.entityService.findMany("plugin::omcommerce.category", {
                fields: [
                    "title",
                    "description",
                ],
                populate: {
                    img: true, products: {
                        fields: [
                            'id',
                            'description',
                            'amount_currency_code',
                            'amount_value',
                            'amount_value_rsd',
                            'Quantity',
                            'weight',
                            'measurement_unit',
                            'title',
                            'slug',
                        ]
                    }
                },
                filters: query.filters
            });
            return tempData;
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
    async findOne(id) {
        if (strapi.entityService) {
            return await strapi.entityService.findOne("plugin::omcommerce.category", id);
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
    async create(data) {
        if (strapi.entityService) {
            return await strapi.entityService.create("plugin::omcommerce.category", data);
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
    async update(id, data) {
        if (strapi.entityService) {
            return await strapi.entityService.update("plugin::omcommerce.category", id, data);
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
    async delete(id) {
        if (strapi.entityService) {
            return await strapi.entityService.delete("plugin::omcommerce.category", id);
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
});
