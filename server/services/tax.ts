import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query: any) {
    if (strapi.entityService) {
      return await strapi.entityService.findMany("plugin::omcommerce.tax", query);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async create(data: any) {
    if (strapi.entityService) {
      return await strapi.entityService.create("plugin::omcommerce.tax", {data});
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async update(id: any, data: any) {
    if (strapi.entityService) {
      return await strapi.entityService.update("plugin::omcommerce.tax", id, {data});
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },
  async delete(id: any) {
    if (strapi.entityService) {
      return await strapi.entityService.delete("plugin::omcommerce.tax", id);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },
});
