import {Strapi} from '@strapi/strapi';

export default ({strapi}: { strapi: Strapi }) => ({

  async find(query: any) {
    if (strapi.entityService) {
      const tempData = await strapi.entityService.findMany("plugin::omcommerce.subcategory", {
        query,
        fields: [
          "title",
        ],
      });
      return tempData;
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async findOne(id: any) {
    if (strapi.entityService) {
      return await strapi.entityService.findOne("plugin::omcommerce.subcategory", id);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async create(data: any) {
    if (strapi.entityService) {
      return await strapi.entityService.create("plugin::omcommerce.subcategory", data);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async update(id: any, data: any) {
    if (strapi.entityService) {
      return await strapi.entityService.update("plugin::omcommerce.subcategory", id, data);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },
  async delete(id: any) {
    if (strapi.entityService) {
      return await strapi.entityService.delete("plugin::omcommerce.subcategory", id);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },
});
