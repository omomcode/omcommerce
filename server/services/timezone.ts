import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query: any) {
    if (strapi.entityService) {
      return await strapi.entityService.findOne("plugin::omcommerce.zone", query);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },


  async create(data: any) {
    if (strapi.entityService) {
      if (data && data.timezone
        && data.measurement && data.unit &&
        data.length_unit
      ) {

        const timezone = await strapi.entityService.create("plugin::omcommerce.zone", data);
        if (timezone) {
          return timezone;
        } else {
          throw new Error("Invalid database data")
        }
      } else {
        throw new Error("Invalid data")
      }
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async update(id: any, data: any) {
    if (strapi.entityService) {
      if (id && data && data.timezone
        && data.measurement && data.unit &&
        data.length_unit
      ) {
        const timezone = await strapi.entityService.update("plugin::omcommerce.zone", id, {data});
        if (timezone) {
          return timezone;
        } else {
          throw new Error("Invalid database data")
        }
      } else {
        throw new Error("Invalid data")
      }
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },
});
