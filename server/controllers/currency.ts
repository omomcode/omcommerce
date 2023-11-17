import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(ctx : any) {
    try {
      return await strapi.plugin("omcommerce").service("currency").find(ctx.query);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async create(ctx : any) {
    try {
      if(ctx.request.body.data.id && ctx.request.body.data && ctx.request.body.data.currency) {
        ctx.body = await strapi
          .plugin("omcommerce")
          .service("currency")
          .create(ctx.request.body);
      }
      else throw new Error("Invalid data")
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx : any) {
    try {
      if(ctx.request.body.data.id && ctx.request.body.data && ctx.request.body.data.currency) {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("currency")
        .update(ctx.params.id, ctx.request.body);
      }
      else throw new Error("Invalid data")
    } catch (err) {
      ctx.throw(500, err);
    }
  },


});
