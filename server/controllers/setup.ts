import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(ctx: any) {
    try {
      return await strapi.plugin("omcommerce").service("setup").find(ctx.query);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async create(ctx: any) {
    try {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("setup")
        .create(ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx: any) {
    try {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("setup")
        .update(ctx.params.id, ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
});
