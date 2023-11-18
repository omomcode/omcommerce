import {Strapi} from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query: any) {
    if (strapi.entityService) {
      return await strapi.entityService.findMany("plugin::omcommerce.product", {
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
        populate: {media: true, categories: true},
        filters:
        query.filters
      });
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async findOne(id: any) {
    if (strapi.entityService) {
      return await strapi.entityService.findOne("plugin::omcommerce.product", id);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async create(data: any) {
    if (strapi.entityService) {
      return await strapi.entityService.create("plugin::omcommerce.product", data);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async update(id: any, data: any) {
    if (strapi.entityService) {
      return await strapi.entityService.update("plugin::omcommerce.product", id, data);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async delete(id: any) {
    if (strapi.entityService) {
      return await strapi.entityService.delete("plugin::omcommerce.product", id);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

});
