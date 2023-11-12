import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query) {
    return await strapi.entityService.findOne("plugin::omcommerce.setup", query);
  },


  async create(data) {
    return await strapi.entityService.create("plugin::omcommerce.setup", data);
  },

  async update(id, data) {
    return await strapi.entityService.update("plugin::omcommerce.setup", id, data);
  },

});
