import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({

  async settings(ctx) {
    try {
      return await strapi.plugin("omcommerce").service("paypal").settings(ctx.query);
    } catch (err) {
      ctx.throw(500, err);
    }
  },

});
