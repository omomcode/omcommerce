import {Strapi} from '@strapi/strapi';

export default ({strapi}: { strapi: Strapi }) => ({

  async find(query) {
    const tempData = await strapi.entityService.findMany("plugin::omcommerce.subcategory", {query,
    fields: [
      "title",
    ],
    });
    return tempData;
  },


  async findOne(id) {
    return await strapi.entityService.findOne("plugin::omcommerce.subcategory", id);
  },

  async create(data) {
    return await strapi.entityService.create("plugin::omcommerce.subcategory", {data});
  },

  async update(id, data) {
    return await strapi.entityService.update("plugin::omcommerce.subcategory", id, {data});
  },
  async delete(id) {
    return await strapi.entityService.delete("plugin::omcommerce.subcategory", id);
  },
});
