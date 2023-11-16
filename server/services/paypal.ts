import {Strapi} from '@strapi/strapi';
import { ID } from '@strapi/types/dist/types/core/entity';

export default ({strapi}: { strapi: Strapi }) => ({

  async settings(query: ID) {
    if (strapi.entityService) {
      const tempData = await strapi.entityService.findOne("plugin::omcommerce.paypalsetup", query);
      return {
        live_paypal_client_id: tempData?.live_paypal_client_id,
        live: tempData?.live
      };
    } else {
      throw new Error('strapi.entityService is not defined');
    }
  }
});
