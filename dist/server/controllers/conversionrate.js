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
            if (!ctx.request.body ||
                !ctx.request.body.rate ||
                !ctx.request.body.conversion_currency) {
                // If any of the required fields is missing, throw a 500 error
                ctx.throw(400, "Invalid data");
            }
            // If none of the required fields is missing, proceed with the create
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("conversionrate")
                .create(ctx.request.body);
        }
        catch (err) {
            // Catch any other errors and throw a 500 error
            ctx.throw(500, err);
        }
    },
    async update(ctx) {
        try {
            if (!ctx.params.id ||
                !ctx.request.body ||
                !ctx.request.body.rate ||
                !ctx.request.body.conversion_currency) {
                // If any of the required fields is missing, throw a 400 error
                ctx.throw(400, "Invalid data");
            }
            // If none of the required fields is missing, proceed with the update
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("conversionrate")
                .update(ctx.params.id, ctx.request.body);
        }
        catch (err) {
            // Catch any other errors and throw a 500 error
            ctx.throw(500, err);
        }
    }
});
