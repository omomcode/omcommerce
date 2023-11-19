"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async find(ctx) {
        try {
            return await strapi.plugin("omcommerce").service("shippingzone").find(ctx.query);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async create(ctx) {
        console.log("ctxbodyzonecreate", ctx.request.body);
        try {
            const zones = await this.find(ctx);
            if (!ctx.request.body ||
                !ctx.request.body.name ||
                !Array.isArray(ctx.request.body.countries) ||
                !ctx.request.body.countries.length) {
                // If any of the required fields is missing, throw a 400 error
                ctx.throw(400, "Invalid data");
            }
            else if (ctx.request.body.countries.some(item => zones.countries.includes(item))) {
                ctx.throw(400, "Invalid data");
            }
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("shippingzone")
                .create(ctx.request.body);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async update(ctx) {
        console.log("ctxbodyzoneupdate", ctx.request.body);
        try {
            const zones = await this.find(ctx);
            if (!ctx.params.id ||
                !ctx.request.body ||
                !ctx.request.body.name ||
                !Array.isArray(ctx.request.body.countries) ||
                !ctx.request.body.countries.length) {
                // If any of the required fields is missing, throw a 400 error
                ctx.throw(400, "Invalid data");
            }
            else if (ctx.request.body.countries.some(item => zones.countries.includes(item))) {
                ctx.throw(400, "Invalid data");
            }
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("shippingzone")
                .update(ctx.params.id, ctx.request.body);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
    async delete(ctx) {
        try {
            if (!ctx.params.id) {
                ctx.throw(400, "Invalid data");
            }
            ctx.body = await strapi
                .plugin("omcommerce")
                .service("shippingzone")
                .delete(ctx.params.id);
        }
        catch (err) {
            ctx.throw(500, err);
        }
    },
});
