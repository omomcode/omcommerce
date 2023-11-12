"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async settings(query) {
        const tempData = await strapi.entityService.findOne("plugin::omcommerce.paypalsetup", query);
        return {
            live_paypal_client_id: tempData.live_paypal_client_id,
            live: tempData.live
        };
    }
});
