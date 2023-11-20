import {Strapi} from '@strapi/strapi';
import {findShippingZoneBasedOnCountry} from "../utils/country-helper/country-helper";
import {IShippingZone} from "../../types/zonetable";
import calculateMaxRate from "../utils/shipping-calculator/shipping-rate-calc";


const calculateTotalValues = (products: any) => {
  let totalAmountValue = 0;
  let totalWeight = 0;
  for (const productArray of products) {
    for (const product of productArray) {
      if (product.amount_value) {
        totalAmountValue += product.amount_value;
      }
      if (product.weight) {
        totalWeight += product.weight;
      }
    }
  }
  return {
    totalAmountValue,
    totalWeight
  };
};


export default ({ strapi }: { strapi: Strapi }) => ({

  async calculate(data: any) {
    const products: any = [];
    const country_code = data.data.country_code;

    const findProductsForCart = async () => {

      for (const item of data.data.cart) {
        const query = {populate: '*', filters: {id: {'$eq': item.id.toString()}}}
        const product = await strapi.plugin("omcommerce").service("product").find(query);
        // const product = await strapi.services.omcommerce.product.find(query);
        if (product) {
          products.push(product);
        }
      }
    };

    const handleResult = async () => {

      const szQuery = {populate: '*'}

      // const sz = await findShippingZone(strapi,szQuery);
      const sz =await strapi.plugin("omcommerce").service("shippingzone").find(szQuery);

      const {totalAmountValue, totalWeight} = calculateTotalValues(products);

      const currency = await strapi.plugin("omcommerce").service("currency").find({});

      const timezone =await strapi.plugin("omcommerce").service("timezone").find({});

      const resolvedZone: any = findShippingZoneBasedOnCountry(country_code, sz as unknown as IShippingZone[]);
      // @ts-ignore
      return calculateMaxRate(resolvedZone.shippingrate, totalAmountValue, totalWeight, currency, timezone);

    };

    // const handleError = (error: any) => {
    //   console.error("Error while finding products for the cart:", error);
    //   return Promise.reject(error);
    // };

    return await findProductsForCart()
      .then(handleResult)
  }
});
