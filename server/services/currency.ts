import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query : any) {
    if (strapi.entityService) {
      return await strapi.entityService.findOne("plugin::omcommerce.currency", query);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async create(data :any) {
    if (strapi.entityService) {
      if(data.id && data && data.currency
      ) {
      const currency = await strapi.entityService.create("plugin::omcommerce.currency", data);
        if(currency.data === data){
          return currency.data;
        }
        else {
          throw new Error("Invalid database data")
        }
      }
      else {
        throw new Error("Invalid data")
      }
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async update(id :any, data :any) {
    if (strapi.entityService) {
      if(id && data && data.currency
      ) {
        const currency = await strapi.entityService.update("plugin::omcommerce.currency", id, data);
        if(currency?.data === data){
          return currency?.data;
        }
        else {
          throw new Error("Invalid database data")
        }
      }
      else {
        throw new Error("Invalid data")
      }
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },
});
