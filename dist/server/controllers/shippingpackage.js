"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(ctx) {
        try {
            return await strapi.plugin("omcommerce").service("shippingpackage").find(ctx.query);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async create(ctx) {
        try {
            if (!ctx.request.body ||
                !ctx.request.body.name ||
                !ctx.request.body.type ||
                ctx.request.body.length === undefined ||
                ctx.request.body.width === undefined ||
                ctx.request.body.weight === undefined ||
                ctx.request.body.default === undefined) {
                // If any of the required fields is missing, throw a 400 error
                ctx.throw(400, "Invalid data");
            }
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("shippingpackage")
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
                !ctx.request.body.name ||
                !ctx.request.body.type ||
                ctx.request.body.length === undefined ||
                ctx.request.body.width === undefined ||
                ctx.request.body.weight === undefined ||
                ctx.request.body.default === undefined) {
                // If any of the required fields is missing, throw a 400 error
                ctx.throw(400, "Invalid data");
            }
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("shippingpackage")
                .update(ctx.params.id, ctx.request.body);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async delete(ctx) {
        try {
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("shippingpackage")
                .delete(ctx.params.id);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
});
