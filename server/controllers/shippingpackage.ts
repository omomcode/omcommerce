import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(ctx : any) {
    try {
      return await strapi.plugin("omcommerce").service("shippingpackage").find(ctx.query);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async create(ctx : any) {
    try {
      if (
        !ctx.request.body ||
        !ctx.request.body.name ||
        !ctx.request.body.type ||
        ctx.request.body.length === undefined ||
        ctx.request.body.width === undefined ||
        ctx.request.body.weight === undefined ||
        ctx.request.body.default === undefined
      ) {
        // If any of the required fields is missing, throw a 400 error
        ctx.throw(400, "Invalid data");
      }
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("shippingpackage")
        .create(ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx : any) {
    try {
      if (
        !ctx.params.id ||
        !ctx.request.body ||
        !ctx.request.body.name ||
        !ctx.request.body.type ||
        ctx.request.body.length === undefined ||
        ctx.request.body.width === undefined ||
        ctx.request.body.weight === undefined ||
        ctx.request.body.default === undefined
      ) {
        // If any of the required fields is missing, throw a 400 error
        ctx.throw(400, "Invalid data");
      }
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("shippingpackage")
        .update(ctx.params.id, ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async delete(ctx : any) {
    try {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("shippingpackage")
        .delete(ctx.params.id);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

});
