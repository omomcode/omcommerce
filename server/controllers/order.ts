import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(ctx : any) {
    try {
      return await strapi.plugin("omcommerce").service("order").find(ctx.query);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async findOne(ctx : any) {
    try {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("order")
        .findOne(ctx.params.id);
    } catch (err) {
      ctx.throw(500, err);
    }
  },


  async create(ctx : any) {
    try {
      if (
          !ctx.request.body ||
          !ctx.request.body.order_id ||
          !ctx.request.body.amount ||
          !ctx.request.body.currency ||
          !ctx.request.body.items ||
          ctx.request.body.shipping_fee === undefined ||
          !ctx.request.body.status
      ) {
        // If any of the required fields is missing, throw a 400 error
        ctx.throw(400, "Invalid data");
      }
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("order")
        .create(ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx : any) {
    try {
      if (
          !ctx.params.id ||
          !ctx.request.body ||
          !ctx.request.body.order_id ||
          !ctx.request.body.amount ||
          !ctx.request.body.currency ||
          !ctx.request.body.items ||
          ctx.request.body.shipping_fee === undefined ||
          !ctx.request.body.status
      ) {
        // If any of the required fields is missing, throw a 400 error
        ctx.throw(400, "Invalid data");
      }
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("order")
        .update(ctx.params.id, ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async delete(ctx : any) {
    try {
      if (
          !ctx.params.id
      ) {
        // If any of the required fields is missing, throw a 400 error
        ctx.throw(400, "Invalid data");
      }
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("order")
        .delete(ctx.params.id);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

});
