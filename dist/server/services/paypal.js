"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async settings(query) {
        console.log(query);
        // const tempData = await strapi.entityService.findOne("plugin::omcommerce.paypalsetup", query, {fields: [
        //       'live_paypal_client_id',
        //       'query'
        //   ]
        //   });
        // return tempData;
        const tempData = await strapi.entityService.findOne("plugin::omcommerce.paypalsetup", query);
        console.log(tempData);
        return {
            live_paypal_client_id: tempData.live_paypal_client_id,
            live: tempData.live
        };
    }
});
