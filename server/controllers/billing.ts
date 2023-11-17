import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(ctx : any) {
    try {
      return await strapi.plugin("omcommerce").service("billing").find(ctx.query);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async create(ctx : any) {
    try {
      if(ctx.request.body.data.id && ctx.request.body.data && ctx.request.body.data.name
        && ctx.request.body.data.country && ctx.request.body.data.address &&
        ctx.request.body.data.apartment &&
        ctx.request.body.data.postal && ctx.request.body.data.city
      ) {
        ctx.body = await strapi
          .plugin("omcommerce")
          .service("billing")
          .create(ctx.request.body);
      }
      else throw new Error("Invalid data")
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx : any) {
    try {
      if(ctx.params.id && ctx.request.body.data && ctx.request.body.data.name
      && ctx.request.body.data.country && ctx.request.body.data.address &&
        ctx.request.body.data.apartment &&
        ctx.request.body.data.postal && ctx.request.body.data.city
      ) {
        ctx.body = await strapi
          .plugin("omcommerce")
          .service("billing")
          .update(ctx.params.id, ctx.request.body);
      }
      else throw new Error("Invalid data")
    } catch (err) {
      ctx.throw(500, err);
    }
  },


});
