import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query: any) {

    if (strapi.entityService) {
      const tempData = await strapi.entityService.findOne("plugin::omcommerce.profile", query);
      const newData: any = {
        id: tempData?.id,
        name: tempData?.name,
        phone: tempData?.phone,
        email: tempData?.email,
        region: tempData?.region
      }
      return newData;
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async create(data: any) {
    if (strapi.entityService) {
      return await strapi.entityService.create("plugin::omcommerce.profile", data);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async update(id: any, data: any) {
    if (strapi.entityService) {
      const tempData = await strapi.entityService.update("plugin::omcommerce.profile", id, data);
      const newData: any = {
        id: tempData?.id,
        name: tempData?.name,
        phone: tempData?.phone,
        email: tempData?.email,
        region: tempData?.region
      }
      return newData;
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },
});
