import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query : any) {
    if (strapi.entityService) {
      return   await strapi.entityService.findOne("plugin::omcommerce.conversionrate", query);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },
  async create(data : any) {
    if (strapi.entityService) {
      if(data && data.rate
        && data.spread && data.conversion_currency
      ) {
        const conversion = await strapi.entityService.create("plugin::omcommerce.profile", data);
        if(conversion){
          return conversion;
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

  async update(id : any, data : any) {
    if (strapi.entityService) {
      if(id && data && data.rate
        && data.spread && data.conversion_currency
      ) {
        const conversion = await strapi.entityService.update("plugin::omcommerce.conversionrate", id, {data});
        if(conversion){
          return conversion;
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
