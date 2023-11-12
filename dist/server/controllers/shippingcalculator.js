"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async calculate(ctx) {
        try {
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("shippingcalculator")
                .calculate(ctx.request.body);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
});
