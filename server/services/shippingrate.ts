import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query) {
    console.log("QUERYQUERY");
    console.log(query);
    return await strapi.entityService.findMany("plugin::omcommerce.shippingrate", query);
  },


  async create(data) {
    return await strapi.entityService.create("plugin::omcommerce.shippingrate", data);
  },

  async update(id, data) {
    return await strapi.entityService.update("plugin::omcommerce.shippingrate", id, data);
  },
  async delete(id) {
    return await strapi.entityService.delete("plugin::omcommerce.shippingrate", id);
  },
});
