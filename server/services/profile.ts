import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query) {

    const tempData = await strapi.entityService.findOne("plugin::omcommerce.profile", query);
    console.log("get dejta services profile", tempData)
    const newData : any = {
      id: tempData.id,
      name: tempData.name,
      phone: tempData.phone,
      email: tempData.email,
      region: tempData.region
    }

    return newData;
  },


  async create(data) {
    return await strapi.entityService.create("plugin::omcommerce.profile", data);
  },

  async update(id, data) {
    console.log("dejta services profile", data)

    const tempData =  await strapi.entityService.update("plugin::omcommerce.profile", id, data);
    const newData : any = {
      id: tempData.id,
      name: tempData.name,
      phone: tempData.phone,
      email: tempData.email,
      region: tempData.region
    }

    return newData;
  },

});
