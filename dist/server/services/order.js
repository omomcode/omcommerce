"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(query) {
        if (strapi.entityService) {
            return await strapi.entityService.findMany("plugin::omcommerce.order", query);
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
    async findOne(id) {
        if (strapi.entityService) {
            return await strapi.entityService.findOne("plugin::omcommerce.order", id);
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
    async create(data) {
        if (strapi.entityService) {
            if (data &&
                data.order_id &&
                data.amount &&
                data.currency &&
                data.items &&
                data.shipping_fee !== undefined &&
                data.status) {
                const order = await strapi.entityService.create("plugin::omcommerce.order", { data });
                if (order) {
                    return order;
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
                data.order_id &&
                data.amount &&
                data.currency &&
                data.items &&
                data.shipping_fee !== undefined &&
                data.status) {
                const billing = await strapi.entityService.update("plugin::omcommerce.order", id, { data });
                if (billing) {
                    return billing;
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
                const orderExists = await strapi.entityService.findOne("plugin::omcommerce.order", id);
                if (!orderExists) {
                    throw new Error("Order does not exist");
                }
                const order = await strapi.entityService.delete("plugin::omcommerce.order", id);
                if (order) {
                    return order;
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
