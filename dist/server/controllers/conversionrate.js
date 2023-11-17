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
            if (ctx.request.body.data.id && ctx.request.body.data && ctx.request.body.data.rate
                && ctx.request.body.data.spread && ctx.request.body.data.conversion_currency) {
                ctx.body = await strapi
                    .plugin("omcommerce")
                    .service("conversionrate")
                    .create(ctx.request.body);
            }
            else
                throw new Error("Invalid data");
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async update(ctx) {
        try {
            if (ctx.request.body.data.id && ctx.request.body.data && ctx.request.body.data.rate
                && ctx.request.body.data.spread && ctx.request.body.data.conversion_currency) {
                ctx.body = await strapi
                    .plugin("omcommerce")
                    .service("conversionrate")
                    .update(ctx.params.id, ctx.request.body);
            }
            else
                throw new Error("Invalid data");
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
});
