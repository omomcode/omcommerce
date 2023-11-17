import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(ctx : any) {
    try {
      return await strapi.plugin("omcommerce").service("gmail").find(ctx.query);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async create(ctx : any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    try {
      if(ctx.request.body.data && ctx.request.body.data.client_id
        && ctx.request.body.data.client_secret && ctx.request.body.data.address &&
        ctx.request.body.data.refresh_token &&
        ctx.request.body.data.from && emailRegex.test(ctx.request.body.data.from)
      ) {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("gmail")
        .create(ctx.request.body);
      }
      else ctx.throw(500, "Invalid data");
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx : any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    try {
      if(ctx.params.id && ctx.request.body.data && ctx.request.body.data.client_id
        && ctx.request.body.data.client_secret && ctx.request.body.data.address &&
        ctx.request.body.data.refresh_token &&
        ctx.request.body.data.from && emailRegex.test(ctx.request.body.data.from)
      ) {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("gmail")
        .update(ctx.params.id, ctx.request.body);
      }
      else ctx.throw(500, "Invalid data");
    } catch (err) {
      ctx.throw(500, err);
    }
  },
});
