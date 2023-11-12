import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(id) {
    return await strapi.entityService.findOne("plugin::omcommerce.social", id);
  },


  async create(data) {
    return await strapi.entityService.create("plugin::omcommerce.social", data);
  },

  async update(id, data) {
    return await strapi.entityService.update("plugin::omcommerce.social", id, data);
  },

});
