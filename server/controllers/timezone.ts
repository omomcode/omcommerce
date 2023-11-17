import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(ctx : any) {
    try {
      return await strapi.plugin("omcommerce").service("timezone").find(ctx.query);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async create(ctx : any) {
    try {
      if(ctx.request.body.data && ctx.request.body.data.timezone
        && ctx.request.body.data.measurement && ctx.request.body.data.unit &&
        ctx.request.body.data.lengthUnit
      ) {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("timezone")
        .create(ctx.request.body);
      }
      else ctx.throw(500, "Invalid data");
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx : any) {
    try {
      if(ctx.request.body.data && ctx.request.body.data.timezone
        && ctx.request.body.data.measurement && ctx.request.body.data.unit &&
        ctx.request.body.data.lengthUnit
      ) {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("timezone")
        .update(ctx.params.id, ctx.request.body);
      }
      else ctx.throw(500, "Invalid data");
    } catch (err) {
      ctx.throw(500, err);
    }
  },


});
