import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(ctx : any) {
    try {
      return await strapi.plugin("omcommerce").service("currency").find(ctx.query);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async create(ctx: any) {
    try {
      if (
        !ctx.request.body ||
        !ctx.request.body.currency
      ) {
        ctx.throw(400, "Invalid data");
      }

      ctx.body = await strapi
        .plugin("omcommerce")
        .service("currency")
        .create(ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx: any) {
    try {
      if (
        !ctx.params.id ||
        !ctx.request.body ||
        !ctx.request.body.currency
      ) {
        ctx.throw(400, "Invalid data");
      }

      ctx.body = await strapi
        .plugin("omcommerce")
        .service("currency")
        .update(ctx.params.id, ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  }

});
