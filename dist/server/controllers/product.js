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
