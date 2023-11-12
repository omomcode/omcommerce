import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(ctx) {
    try {
      return await strapi.plugin("omcommerce").service("shippingpackage").find(ctx.query);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async create(ctx) {
    try {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("shippingpackage")
        .create(ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx) {
    try {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("shippingpackage")
        .update(ctx.params.id, ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async delete(ctx) {
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
