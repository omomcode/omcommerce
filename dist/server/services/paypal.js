"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async settings(query) {
        if (strapi.entityService) {
            const tempData = await strapi.entityService.findOne("plugin::omcommerce.paypalsetup", query);
            return {
                live_paypal_client_id: tempData === null || tempData === void 0 ? void 0 : tempData.live_paypal_client_id,
                live: tempData === null || tempData === void 0 ? void 0 : tempData.live
            };
        }
        else {
            throw new Error('strapi.entityService is not defined');
        }
    }
});
