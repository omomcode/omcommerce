import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(ctx : any) {
    try {
      return await strapi.plugin("omcommerce").service("shippingrate").find(ctx.query);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async create(ctx : any) {
    try {
      console.log("ctxratecreate", ctx.request.body)
      if (
        !ctx.request.body ||
        !ctx.request.body.name ||
        ctx.request.body.condition == undefined ||
        ctx.request.body.price == undefined
      ) {
        // If any of the required fields is missing, throw a 400 error
        ctx.throw(400, "Invalid data");
      }
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("shippingrate")
        .create(ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx : any) {
    try {
      console.log("ctxrateedit", ctx.request.body)
      if (
        !ctx.params.id ||
        !ctx.request.body ||
        !ctx.request.body.name ||
        ctx.request.body.condition == undefined ||
        ctx.request.body.price == undefined
      ) {
        // If any of the required fields is missing, throw a 400 error
        ctx.throw(400, "Invalid data");
      }
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("shippingrate")
        .update(ctx.params.id, ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async delete(ctx : any) {
    try {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("shippingrate")
        .delete(ctx.params.id);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

});
