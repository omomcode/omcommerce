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
            if (ctx.params.id && ctx.request.body.data && ctx.request.body.data.name
                && ctx.request.body.data.phone && ctx.request.body.data.email &&
                ctx.request.body.data.region &&
                emailRegex.test(ctx.request.body.data.email)) {
                ctx.body = await strapi
                    .plugin("omcommerce")
                    .service("profile")
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        try {
            if (ctx.params.id && ctx.request.body.data && ctx.request.body.data.name
                && ctx.request.body.data.phone && ctx.request.body.data.email &&
                ctx.request.body.data.region &&
                emailRegex.test(ctx.request.body.data.email)) {
                ctx.body = await strapi
                    .plugin("omcommerce")
                    .service("profile")
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
