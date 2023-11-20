import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query: any) {
    if (strapi.entityService) {
      return await strapi.entityService.findMany("plugin::omcommerce.shippingrate", query);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async create(data: any) {
    if (strapi.entityService) {
      if (
        data ||
        data.name ||
        data.condition !== undefined ||
        data.price !== undefined
      ) {
        const rate =  await strapi.entityService.create("plugin::omcommerce.shippingrate", data);
        if (rate) {
          return rate;
        } else {
          throw new Error("Invalid database data");
        }
      } else {
        throw new Error("Invalid data");
      }
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async update(id: any, data: any) {
    if (strapi.entityService) {
      if (
        id ||
        data ||
        data.name ||
        data.condition !== undefined ||
        data.price !== undefined
      ) {
        const rate =  await strapi.entityService.update("plugin::omcommerce.shippingrate",id, {data});
        if (rate) {
          return rate;
        } else {
          throw new Error("Invalid database data");
        }
      } else {
        throw new Error("Invalid data");
      }
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },
  async delete(id: any) {
    if (strapi.entityService) {
      return await strapi.entityService.delete("plugin::omcommerce.shippingrate", id);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },
});
