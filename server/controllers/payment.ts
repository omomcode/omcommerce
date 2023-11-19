import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({

  async capture(ctx : any) {
    try {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("payment")
        .capture(ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },
  async orders(ctx : any) {
    try {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("payment")
        .orders(ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

});
