import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query: any) {
    if (strapi.entityService) {
      // @ts-ignore
      return await strapi.entityService.findMany("plugin::omcommerce.shippingpackage", query);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },
  async create(data: any) {
    if (strapi.entityService) {
      if (
        data ||
        data.name ||
        data.type ||
        data.length !== undefined ||
        data.width !== undefined ||
        data.weight !== undefined ||
        data.default !== undefined
      ) {
        const zone =  await strapi.entityService.create("plugin::omcommerce.shippingpackage", data);
        if (zone) {
          return zone;
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
        data ||
        data.name ||
        data.type ||
        data.length !== undefined ||
        data.width !== undefined ||
        data.weight !== undefined ||
        data.default !== undefined
      ) {
        const zone =  await strapi.entityService.update("plugin::omcommerce.shippingpackage", id,{data});
        if (zone) {
          return zone;
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
      return await strapi.entityService.delete("plugin::omcommerce.shippingpackage", id);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },
});
