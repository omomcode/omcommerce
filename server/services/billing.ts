import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query: any) {
    if (strapi.entityService) {
      return await strapi.entityService.findOne("plugin::omcommerce.billing", query);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },


  async create(data: any) {
    if (strapi.entityService) {

      if(data && data.name
        && data.country && data.address &&
        data.apartment &&
        data.postal && data.city
      ) {
        const billing = await strapi.entityService.create("plugin::omcommerce.billing", data);

        if(billing){
          return billing;
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

  async update(id: any, data: any) {
    if (strapi.entityService) {
      console.log("jebeni dejta", data)
      console.log("jebeni dejta ajdi", id)
      if(id && data && data.name
        && data.country && data.address &&
        data.apartment &&
        data.postal && data.city
      ) {
      const billing =  await strapi.entityService.update("plugin::omcommerce.billing", id, {data});
        console.log("jebeni billing", billing)
      if(billing){
        return billing;
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
