import {Strapi} from "@strapi/strapi";
export default ({ strapi }: { strapi: Strapi }) => ({

  async find(ctx : any) {
    try {
      return await strapi.plugin("omcommerce").service("profile").find(ctx.query);
    } catch (err) {
      ctx.throw(500, err);
    }
  },



  async create(ctx : any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    try {
      if(ctx.request.body && ctx.request.body.name
        && ctx.request.body.phone && ctx.request.body.email &&
        ctx.request.body.region &&
        emailRegex.test(ctx.request.body.email)
      ) {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("profile")
        .create(ctx.request.body);
      }
      else ctx.throw(500, "Invalid data");
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx: any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    try {
      if(ctx.params.id && ctx.request.body && ctx.request.body.name
        && ctx.request.body.phone && ctx.request.body.email &&
        ctx.request.body.region &&
        emailRegex.test(ctx.request.body.email)
      ) {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("profile")
        .update(ctx.params.id, ctx.request.body);
      }
      else ctx.throw(500, "Invalid data");
    } catch (err) {
      ctx.throw(500, err);
    }
  },

});
