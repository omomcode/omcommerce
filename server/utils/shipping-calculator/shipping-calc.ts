export const parseWeightCondition = (condition: string,measurement: string) => {
  const [minWeight, maxWeight] = condition.split('-').map((str) => str.replace(measurement, ''));
  return { minWeight, maxWeight };
};

export const parsePriceCondition = (condition: string, currency: string) => {
  const [minPrice, maxPrice] = condition.split('-').map((str) => str.replace(currency, '').trim());
  return { minPrice, maxPrice };
};

