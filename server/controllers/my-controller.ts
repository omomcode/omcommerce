import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  async index(ctx: { body: any; }) {
    ctx.body = strapi
      .plugin('omcommerce')
      .service('myService')
      .getWelcomeMessage();
  },
});
