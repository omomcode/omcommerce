"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async settings(ctx) {
        try {
            return await strapi.plugin("omcommerce").service("paypal").settings(ctx.query);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
});
