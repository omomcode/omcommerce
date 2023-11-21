import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({

  async find(query: any) {
    if (strapi.entityService) {
      return await strapi.entityService.findMany("plugin::omcommerce.order", query);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async findOne(id: any) {
    if (strapi.entityService) {
      return await strapi.entityService.findOne("plugin::omcommerce.order", id);
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  },

  async create(data: any) {
    if (strapi.entityService) {
      if (
          data &&
          data.order_id &&
          data.amount &&
          data.currency &&
          data.items &&
          data.shipping_fee !== undefined &&
          data.status
      ) {
        const billing = await strapi.entityService.create(
            "plugin::omcommerce.order",
            data
        );

        if (billing) {
          return billing;
        } else {
          throw new Error("Invalid database data");
        }
      } else {
        throw new Error("Invalid data");
      }
    } else {
      throw new Error("strapi.entityService is not defined");
    }
  },
  async update(id: any, data: any) {
    if (strapi.entityService) {
      if (
          id &&
          data &&
          data.order_id &&
          data.amount &&
          data.currency &&
          data.items &&
          data.shipping_fee !== undefined &&
          data.status
      ) {
        const billing = await strapi.entityService.update(
            "plugin::omcommerce.order", id,
            {data}
        );

        if (billing) {
          return billing;
        } else {
          throw new Error("Invalid database data");
        }
      } else {
        throw new Error("Invalid data");
      }
    } else {
      throw new Error("strapi.entityService is not defined");
    }
  },
  async delete(id: any) {
    if (strapi.entityService) {
      if (
          id
      ) {
        const billing = await strapi.entityService.update(
            "plugin::omcommerce.order", id
        );

        if (billing) {
          return billing;
        } else {
          throw new Error("Invalid database data");
        }
      } else {
        throw new Error("Invalid data");
      }
    } else {
      throw new Error("strapi.entityService is not defined");
    }
  },
});
