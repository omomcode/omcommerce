import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query: any) {

    if (strapi.entityService) {
      return await strapi.entityService.findOne("plugin::omcommerce.profile", query);

    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async create(data: any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (strapi.entityService) {
      if (data && data.name
        && data.phone && data.email &&
        data.region &&
        emailRegex.test(data.email)
      ) {
        const profile = await strapi.entityService.create("plugin::omcommerce.profile", data);
        if (profile) {
          return profile;
        } else {
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

  async update(id: any, data: any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (strapi.entityService) {
      if (data && data.name
        && data.phone && data.email &&
        data.region &&
        emailRegex.test(data.email)
      ) {
        const profile = await strapi.entityService.update("plugin::omcommerce.profile", id, {data});
        if (profile) {
          return profile;
        } else {
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
