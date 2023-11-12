import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query) {
    console.log("kveri", query.filters);
    const tempData = await strapi.entityService.findMany("plugin::omcommerce.product", {
      fields: [
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
      ],
      populate: { media: true, categories: true },
      filters:
        query.filters
    });

    return tempData;

  },

  async findOne(id) {
    return await strapi.entityService.findOne("plugin::omcommerce.product", id);
  },

  async create(data) {
    return await strapi.entityService.create("plugin::omcommerce.product", data);
  },

  async update(id, data) {
    return await strapi.entityService.update("plugin::omcommerce.product", id, data);
  },

  async delete(id) {
    return await strapi.entityService.delete("plugin::omcommerce.product", id);
  },

});
