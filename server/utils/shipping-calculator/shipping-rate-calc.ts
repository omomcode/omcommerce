import { IShippingRate } from '../../../types/rate';
import {parsePriceCondition, parseWeightCondition} from "./shipping-calc";

const calculateMaxRate = (
  shippingRates: IShippingRate[] | undefined,
  totalAmountValue: number,
  totalWeight: number,
  currency: { currency: string },
  timezone: { unit: string }
): number | undefined => {
  let maxRate = 0;

  if (shippingRates && Array.isArray(shippingRates)) {
    for (const rate of shippingRates) {
      const { condition, price } = rate;

      if (condition.includes(currency.currency)) {
        const { minPrice, maxPrice } = parsePriceCondition(rate.condition, currency.currency);
        const isWithinRange = totalAmountValue >= parseFloat(minPrice) && totalAmountValue <= parseFloat(maxPrice);

        if (maxRate === undefined || price > maxRate) {
          maxRate = isWithinRange ? rate.price : maxRate;
        }
      }
      else if (condition.includes(timezone.unit)) {
        const { minWeight, maxWeight } = parseWeightCondition(rate.condition, timezone.unit);
        const isWithinRange = totalWeight >= parseFloat(minWeight) && totalWeight <= parseFloat(maxWeight);

        if (maxRate === undefined || price > maxRate) {
          maxRate = isWithinRange ? rate.price : maxRate;
        }
      }
      else {
        if (maxRate === undefined || (condition === "" && price > maxRate )) {
          maxRate = price;
        }
      }
    }
  }

  return maxRate;
};

export default calculateMaxRate;
