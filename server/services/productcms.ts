import {Strapi} from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query: any) {
    if (strapi.entityService) {
      return await strapi.entityService.findMany("plugin::omcommerce.product", query);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async findOne(id: any) {
    if (strapi.entityService) {
      return await strapi.entityService.findOne("plugin::omcommerce.product", id);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async create(data: any) {
    console.log("datacreateproductcms", data)
    if (strapi.entityService) {
      const prod =  await strapi.entityService.create("plugin::omcommerce.product", data);
      return prod;
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async update(id: any, data: any) {
    console.log("id", id)
    console.log("data", data)
    if (strapi.entityService) {
      return await strapi.entityService.update("plugin::omcommerce.product", id, {data});
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async delete(id: any) {
    if (strapi.entityService) {
      return await strapi.entityService.delete("plugin::omcommerce.product", id);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

});
