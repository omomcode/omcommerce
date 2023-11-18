import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({

  async calculate(ctx : any) {
    try {
      ctx.body = await strapi
        .plugin("omcommerce")
        .service("shippingcalculator")
        .calculate(ctx.request.body);
    } catch (err) {
      ctx.throw(500, err);
      ctx.body = {};
    }
  },


});
