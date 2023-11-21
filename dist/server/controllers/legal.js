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
            console.log("ctxlegalcreate", ctx.request.body);
            if (!ctx.request.body ||
                !ctx.request.body.enabled ||
                (!ctx.request.body.returnPolicy && (ctx.request.body.restockingFee || ctx.request.body.returnWindow || ctx.request.body.returnShippingCost))) { // If any of the required fields is missing, throw a 400 error
                ctx.throw(400, "Invalid data");
            }
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
            console.log("ctxlegaledit", ctx.request.body);
            if (!ctx.params.id ||
                !ctx.request.body ||
                !ctx.request.body.enabled ||
                (!ctx.request.body.returnPolicy && (ctx.request.body.restockingFee || ctx.request.body.returnWindow || ctx.request.body.returnShippingCost))) { // If any of the required fields is missing, throw a 400 error
                ctx.throw(400, "Invalid data");
            }
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
