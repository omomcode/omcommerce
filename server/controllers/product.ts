import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(ctx : any) {
    try {
      return await strapi.plugin("omcommerce").service("product").find(ctx.query);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async findOne(ctx : any) {
    try {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("product")
        .findOne(ctx.params.id);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async create(ctx : any) {
    try {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("product")
        .create(ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx : any) {
    console.log("prodedit", ctx.request.body)
    try {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("product")
        .update(ctx.params.id, ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async delete(ctx : any) {
    try {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("product")
        .delete(ctx.params.id);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

});
