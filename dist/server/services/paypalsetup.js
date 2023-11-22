"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(query) {
        if (strapi.entityService) {
            const paypalsetup = await strapi.entityService.findOne("plugin::omcommerce.paypalsetup", query);
            if (paypalsetup) {
                return paypalsetup;
            }
            else {
                throw new Error('Invalid Data');
            }
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    },
    async create(data) {
        if (strapi.entityService) {
            if (data &&
                (data.live !== undefined && (((data.live === true) && data.live_paypal_client_id &&
                    data.live_paypal_client_secret) || ((data.live === false) &&
                    data.sandbox_paypal_client_id && data.sandbox_paypal_client_secret)))) {
                const paypalsetup = await strapi.entityService.create("plugin::omcommerce.paypalsetup", { data });
                if (paypalsetup) {
                    return paypalsetup;
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
                (data.live !== undefined && (((data.live === true) && data.live_paypal_client_id &&
                    data.live_paypal_client_secret) || ((data.live === false) &&
                    data.sandbox_paypal_client_id && data.sandbox_paypal_client_secret)))) {
                const paypalsetup = await strapi.entityService.update("plugin::omcommerce.paypalsetup", id, { data });
                if (paypalsetup) {
                    return paypalsetup;
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
    }
});
