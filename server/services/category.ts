import {Strapi} from '@strapi/strapi';

export default ({strapi}: { strapi: Strapi }) => ({

  async find(query) {
    const tempData = await strapi.entityService.findMany("plugin::omcommerce.category", {
    fields: [
      "title",
      "description",
    ],
      populate: { img: true, products: {fields: [
            'id',
            'description',
            'amount_currency_code',
            'amount_value',
            'amount_value_rsd',
            'Quantity',
            'weight',
            'measurement_unit',
            'title',
            'slug',
          ]} },
      filters:
      query.filters
    });
    return tempData;
  },


  async findOne(id) {
    console.log("find one");
    console.log(id);
    return await strapi.entityService.findOne("plugin::omcommerce.category", id);
  },

  async create(data) {
    return await strapi.entityService.create("plugin::omcommerce.category", data);
  },

  async update(id, data) {
    return await strapi.entityService.update("plugin::omcommerce.category", id, data);
  },
  async delete(id) {
    return await strapi.entityService.delete("plugin::omcommerce.category", id);
  },
});
