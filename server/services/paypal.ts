import {Strapi} from '@strapi/strapi';
import { ID } from '@strapi/types/dist/types/core/entity';

export default ({strapi}: { strapi: Strapi }) => ({

  async settings(query: ID) {
    console.log(query);
    // const tempData = await strapi.entityService.findOne("plugin::omcommerce.paypalsetup", query, {fields: [
    //       'live_paypal_client_id',
    //       'query'
    //   ]
    //   });
    // return tempData;
    const tempData = await strapi.entityService.findOne("plugin::omcommerce.paypalsetup", query);

    console.log(tempData);
    return {
      live_paypal_client_id: tempData.live_paypal_client_id,
      live: tempData.live
    };
  }

});
