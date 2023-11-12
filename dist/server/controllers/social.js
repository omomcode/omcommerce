"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async findOne(ctx) {
        try {
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("social")
                .find(ctx.params.id);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async create(ctx) {
        try {
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("social")
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
                .service("social")
                .update(ctx.params.id, ctx.request.body);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
});
