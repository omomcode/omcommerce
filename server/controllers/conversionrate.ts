import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(ctx : any) {
    try {
      return await strapi.plugin("omcommerce").service("conversionrate").find(ctx.query);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async create(ctx : any) {
    try {
      if(ctx.request.body.data.id && ctx.request.body.data && ctx.request.body.data.rate
        && ctx.request.body.data.spread && ctx.request.body.data.conversion_currency
      ) {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("conversionrate")
        .create(ctx.request.body);
      }
      else ctx.throw(500, "Invalid data");
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx : any) {
    try {
      if(ctx.request.body.data.id && ctx.request.body.data && ctx.request.body.data.rate
        && ctx.request.body.data.spread && ctx.request.body.data.conversion_currency
      ) {
        ctx.body = await strapi
          .plugin("omcommerce")
          .service("conversionrate")
          .update(ctx.params.id, ctx.request.body);
      }
      else ctx.throw(500, "Invalid data");
    } catch (err) {
      ctx.throw(500, err);
    }
  },


});
