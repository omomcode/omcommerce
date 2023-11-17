import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query : any) {
    if (strapi.entityService) {
      return await strapi.entityService.findOne("plugin::omcommerce.gmail", query);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },
  async create(data : any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (strapi.entityService) {
      if(data && data.client_id
        && data.client_secret && data.address &&
        data.refresh_token &&
        data.from && emailRegex.test(data.from)
      ) {
      const gmail =  await strapi.entityService.create("plugin::omcommerce.gmail", data);
      if(gmail.data === data){
        return gmail.data;
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (strapi.entityService) {
      if(data && data.client_id
        && data.client_secret && data.address &&
        data.refresh_token &&
        data.from && emailRegex.test(data.from)
      ) {
        const gmail =  await strapi.entityService.update("plugin::omcommerce.gmail", id, data);
        if(gmail?.data === data){
          return gmail?.data;
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
