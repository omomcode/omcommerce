"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(ctx) {
        try {
            return await strapi.plugin("omcommerce").service("gmail").find(ctx.query);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async create(ctx) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        try {
            if (!ctx.request.body ||
                !ctx.request.body.client_id ||
                !ctx.request.body.client_secret ||
                !ctx.request.body.refresh_token ||
                !ctx.request.body.from ||
                !emailRegex.test(ctx.request.body.from)) {
                ctx.throw(400, "Invalid data");
            }
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("gmail")
                .create(ctx.request.body);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async update(ctx) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        try {
            if (!ctx.params.id ||
                !ctx.request.body ||
                !ctx.request.body.client_id ||
                !ctx.request.body.client_secret ||
                !ctx.request.body.refresh_token ||
                !ctx.request.body.from ||
                !emailRegex.test(ctx.request.body.from)) {
                ctx.throw(400, "Invalid data");
            }
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("gmail")
                .update(ctx.params.id, ctx.request.body);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    }
});
