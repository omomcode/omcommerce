export const findProduct = async (strapi: any, query: any) => {
  if (strapi.entityService) {
    return await strapi.entityService.findMany("plugin::omcommerce.product", query);
  } else {
    throw new Error('strapi.entityService is not defined');
  }
}

export const findShippingZone = async (strapi: any,query: any) => {
  if (strapi.entityService) {
    return await strapi.entityService.findMany("plugin::omcommerce.shippingzone", query);
  } else {
    throw new Error('strapi.entityService is not defined');
  }
}

export const findTimezone = async (strapi: any, query: any) => {
  if (strapi.entityService) {
    return await strapi.entityService.findOne("plugin::omcommerce.zone", query);
  } else {
    throw new Error('strapi.entityService is not defined');
  }
}

export const findCurrency = async (strapi: any, query: any) => {
  if (strapi.entityService) {
    return await strapi.entityService.findOne("plugin::omcommerce.currency", query);
  } else {
    throw new Error('strapi.entityService is not defined');
  }
}
