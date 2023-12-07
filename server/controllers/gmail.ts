import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(ctx : any) {
    try {
      return await strapi.plugin("omcommerce").service("gmail").find(ctx.query);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async create(ctx: any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    try {
      if (
        !ctx.request.body ||
        !ctx.request.body.client_id ||
        !ctx.request.body.client_secret ||
        !ctx.request.body.refresh_token ||
        !ctx.request.body.from ||
        !emailRegex.test(ctx.request.body.from) ||
        !(ctx.request.body.languageRadio === "English" || ctx.request.body.languageRadio === "Serbian")
      ) {
        ctx.throw(400, "Invalid data");
      }

      ctx.body = await strapi
        .plugin("omcommerce")
        .service("gmail")
        .create(ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  async update(ctx: any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    try {
      if (
        !ctx.params.id ||
        !ctx.request.body ||
        !ctx.request.body.client_id ||
        !ctx.request.body.client_secret ||
        !ctx.request.body.refresh_token ||
        !ctx.request.body.from ||
        !emailRegex.test(ctx.request.body.from)||
        !(ctx.request.body.languageRadio === "English" || ctx.request.body.languageRadio === "Serbian")
      ) {
        ctx.throw(400, "Invalid data");
      }

      ctx.body = await strapi
        .plugin("omcommerce")
        .service("gmail")
        .update(ctx.params.id, ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  }
});
