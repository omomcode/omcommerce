import {Strapi} from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query: any) {
    try {
      if (strapi.entityService) {
        // @ts-ignore
        return await strapi.entityService.findMany("plugin::omcommerce.shippingzone", query);
      } else {
        throw new Error('strapi.entityService is not defined for find operation');
      }
    } catch (error) {
      console.error('Error in find operation:', error);
      throw error;
    }
  },

  async create(data: any) {
    if (strapi.entityService) {
      return await strapi.entityService.create("plugin::omcommerce.shippingzone", data);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async update(id: any, data: any) {
    if (strapi.entityService) {
      return await strapi.entityService.update("plugin::omcommerce.shippingzone", id, data);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },
  async delete(id: any) {
    if (strapi.entityService) {
      return await strapi.entityService.delete("plugin::omcommerce.shippingzone", id);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },
});
