import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query) {
    return await strapi.entityService.findOne("plugin::omcommerce.zone", query);
  },


  async create(data) {
    return await strapi.entityService.create("plugin::omcommerce.zone", data);
  },

  async update(id, data) {
    return await strapi.entityService.update("plugin::omcommerce.zone", id, data);
  },

});
