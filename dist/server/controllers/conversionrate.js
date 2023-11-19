"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(ctx) {
        try {
            return await strapi.plugin("omcommerce").service("conversionrate").find(ctx.query);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async create(ctx) {
        try {
            if (ctx.request.body && ctx.request.body.rate
                && ctx.request.body.spread && ctx.request.body.conversion_currency) {
                ctx.body = await strapi
                    .plugin("omcommerce")
                    .service("conversionrate")
                    .create(ctx.request.body);
            }
            else
                ctx.throw(500, "Invalid data");
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async update(ctx) {
        try {
            if (ctx.params.id && ctx.request.body && ctx.request.body.rate
                && ctx.request.body.spread && ctx.request.body.conversion_currency) {
                ctx.body = await strapi
                    .plugin("omcommerce")
                    .service("conversionrate")
                    .update(ctx.params.id, ctx.request.body);
            }
            else
                ctx.throw(500, "Invalid data");
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
});
