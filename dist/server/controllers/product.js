"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(ctx) {
        try {
            return await strapi.plugin("omcommerce").service("product").find(ctx.query);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async findOne(ctx) {
        try {
            if (!ctx.params.id) { // If any of the required fields is missing, throw a 400 error
                ctx.throw(400, "Invalid data");
            }
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("product")
                .findOne(ctx.params.id);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async create(ctx) {
        try {
            if (!ctx.request.body ||
                !ctx.request.body.title ||
                !ctx.request.body.slug ||
                !ctx.request.body.showQuantity) { // If any of the required fields is missing, throw a 400 error
                ctx.throw(400, "Invalid data");
            }
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("product")
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
                !ctx.request.body.title ||
                !ctx.request.body.slug ||
                !ctx.request.body.showQuantity) { // If any of the required fields is missing, throw a 400 error
                ctx.throw(400, "Invalid data");
            }
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("product")
                .update(ctx.params.id, ctx.request.body);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async delete(ctx) {
        try {
            if (!ctx.params.id) { // If any of the required fields is missing, throw a 400 error
                ctx.throw(400, "Invalid data");
            }
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("product")
                .delete(ctx.params.id);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
});
