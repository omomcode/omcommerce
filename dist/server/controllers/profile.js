"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(ctx) {
        try {
            return await strapi.plugin("omcommerce").service("profile").find(ctx.query);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async create(ctx) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        try {
            if (ctx.request.body && ctx.request.body.name
                && ctx.request.body.phone && ctx.request.body.email &&
                ctx.request.body.region &&
                emailRegex.test(ctx.request.body.email)) {
                ctx.body = await strapi
                    .plugin("omcommerce")
                    .service("profile")
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        try {
            if (ctx.params.id && ctx.request.body && ctx.request.body.name
                && ctx.request.body.phone && ctx.request.body.email &&
                ctx.request.body.region &&
                emailRegex.test(ctx.request.body.email)) {
                ctx.body = await strapi
                    .plugin("omcommerce")
                    .service("profile")
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
