"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(ctx) {
        try {
            return await strapi.plugin("omcommerce").service("paypalsetup").find(ctx.query);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async create(ctx) {
        try {
            if (!ctx.request.body ||
                !(ctx.request.body.live !== undefined && (((ctx.request.body.live === true) && ctx.request.body.live_paypal_client_id &&
                    ctx.request.body.live_paypal_client_secret) || ((ctx.request.body.live === false) &&
                    ctx.request.body.sandbox_paypal_client_id && ctx.request.body.sandbox_paypal_client_secret)))) {
                // If any of the required fields is missing, throw a 400 error
                ctx.throw(400, "Invalid data");
            }
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("paypalsetup")
                .create(ctx.request.body);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async update(ctx) {
        try {
            if (!ctx.params.id ||
                !ctx.request.body ||
                !(ctx.request.body.live !== undefined && (((ctx.request.body.live === true) && ctx.request.body.live_paypal_client_id &&
                    ctx.request.body.live_paypal_client_secret) || ((ctx.request.body.live === false) &&
                    ctx.request.body.sandbox_paypal_client_id && ctx.request.body.sandbox_paypal_client_secret)))) {
                // If any of the required fields is missing, throw a 400 error
                ctx.throw(400, "Invalid data");
            }
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("paypalsetup")
                .update(ctx.params.id, ctx.request.body);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
});
