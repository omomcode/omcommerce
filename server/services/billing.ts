import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query: any) {
    if (strapi.entityService) {
      return await strapi.entityService.findOne("plugin::omcommerce.billing", query);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },


  async create(data: any) {
    if (strapi.entityService) {
      return await strapi.entityService.create("plugin::omcommerce.billing", data);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async update(id: any, data: any) {
    if (strapi.entityService) {
      return await strapi.entityService.update("plugin::omcommerce.billing", id, data);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },
});
