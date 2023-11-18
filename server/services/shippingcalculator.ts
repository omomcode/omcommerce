import {Strapi} from '@strapi/strapi';
import {findShippingZoneBasedOnCountry} from "../../admin/src/utils/country-helper/country-helper";
import {IShippingZone} from "../../types/zonetable";
import {findCurrency, findProduct, findShippingZone, findTimezone} from "../utils/entity-helper/entity-helper";
import calculateMaxRate from "../utils/shipping-calculator/shipping-rate-calc";


export default ({ strapi }: { strapi: Strapi }) => ({

  async calculate(data: any) {
    const products: any = [];
    const country_code = data.data.country_code;
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

    const findProductsForCart = async () => {

      for (const item of data.data.cart) {
        // const product = await getProduct(item.id);
        // const query = `populate=*&[filters][id][$eq]=${item.id}`
        const query = {populate: '*', filters: {id: {'$eq': item.id.toString()}}}

        const product = await findProduct(strapi,query);
        if (product) {
          products.push(product);
        }
      }
    };
    
    const handleResult = async () => {

      const szQuery = {populate: '*'}
      const sz = await findShippingZone(strapi,szQuery);

      const {totalAmountValue, totalWeight} = calculateTotalValues(products);

      const currency = await findCurrency(strapi,{});
      const timezone = await findTimezone(strapi,{});

      const resolvedZone: any = findShippingZoneBasedOnCountry(country_code, sz as unknown as IShippingZone[]);

      // @ts-ignore
      // if (resolvedZone) {
      return calculateMaxRate(resolvedZone.shippingrate, totalAmountValue, totalWeight, currency, timezone);
      // } else {
      //   // Handle the case where shippingRates is not iterable
      //   console.error('Shipping rates are not iterable');
      //   return null; // or handle it according to your requirements
      // }
    };

    const handleError = (error: any) => {
      console.error("Error while finding products for the cart:", error);
      return Promise.reject(error);
    };

    return await findProductsForCart()
      .then(handleResult)
      .catch(handleError);

  }
});
