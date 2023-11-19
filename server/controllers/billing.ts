import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(ctx : any) {
    try {
      return await strapi.plugin("omcommerce").service("billing").find(ctx.query);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async create(ctx: any) {
    try {
      if (
        !ctx.request.body ||
        !ctx.request.body.name ||
        !ctx.request.body.country ||
        !ctx.request.body.address ||
        !ctx.request.body.apartment ||
        !ctx.request.body.postal ||
        !ctx.request.body.city
      ) {
        // If any of the required fields is missing, throw a 400 error
        ctx.throw(400, "Invalid data");
      }

      // If none of the required fields is missing, proceed with the create
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("billing")
        .create(ctx.request.body);
    } catch (err) {
      // Catch any other errors and throw a 500 error
      ctx.throw(500, "Internal Server Error");
    }
  },

  async update(ctx: any) {

    console.log("billing controller data");
    console.log(ctx.params.id);
    console.dir(ctx.request.body);

    try {
      if (
        !ctx.params.id ||
        !ctx.request.body ||
        !ctx.request.body.name ||
        !ctx.request.body.country ||
        !ctx.request.body.address ||
        !ctx.request.body.apartment ||
        !ctx.request.body.postal ||
        !ctx.request.body.city
      ) {
        // If any of the required fields is missing, throw a 400 error
        ctx.throw(400, "Invalid data");
      }
      // If none of the required fields is missing, proceed with the update
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("billing")
        .update(ctx.params.id, ctx.request.body);
    } catch (err) {
      ctx.throw(500, "Internal Server Error");
    }
  }



});
