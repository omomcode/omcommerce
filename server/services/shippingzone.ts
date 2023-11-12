import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query) {
    return await strapi.entityService.findMany("plugin::omcommerce.shippingzone", query);
  },


  async create(data) {
    return await strapi.entityService.create("plugin::omcommerce.shippingzone", data);
  },

  async update(id, data) {
    return await strapi.entityService.update("plugin::omcommerce.shippingzone", id, data);
  },
  async delete(id) {
    return await strapi.entityService.delete("plugin::omcommerce.shippingzone", id);
  },
});
