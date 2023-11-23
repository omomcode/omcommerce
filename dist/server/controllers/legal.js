"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(ctx) {
        try {
            return await strapi.plugin("omcommerce").service("legal").find(ctx.query);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async create(ctx) {
        try {
            console.log("legalcreatecontroller", ctx.request.body);
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("legal")
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
                .service("legal")
                .update(ctx.params.id, ctx.request.body);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
});
