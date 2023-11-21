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
                            'amount_value_converted',
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
            if (id) {
                const category = await strapi.entityService.findOne("plugin::omcommerce.category", id);
                if (category) {
                    return category;
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
                const category = await strapi.entityService.create("plugin::omcommerce.category", data);
                if (category) {
                    return category;
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
                const category = await strapi.entityService.update("plugin::omcommerce.category", id, { data });
                if (category) {
                    return category;
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
                const category = await strapi.entityService.delete("plugin::omcommerce.category", id);
                if (category) {
                    return category;
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
