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
            if (ctx.request.body.data && ctx.request.body.data.client_id
                && ctx.request.body.data.client_secret && ctx.request.body.data.address &&
                ctx.request.body.data.refresh_token &&
                ctx.request.body.data.from && emailRegex.test(ctx.request.body.data.from)) {
                ctx.body = await strapi
                    .plugin("omcommerce")
                    .service("gmail")
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
            if (ctx.params.id && ctx.request.body.data && ctx.request.body.data.client_id
                && ctx.request.body.data.client_secret && ctx.request.body.data.address &&
                ctx.request.body.data.refresh_token &&
                ctx.request.body.data.from && emailRegex.test(ctx.request.body.data.from)) {
                ctx.body = await strapi
                    .plugin("omcommerce")
                    .service("gmail")
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
