import { parseWeightCondition, parsePriceCondition } from '../../../server/utils/shipping-calculator/shipping-calc';

describe('parseWeightCondition function', () => {
  test('should correctly parse weight conditions', () => {
    const condition = '10kg-20kg';
    const measurement = 'kg';
    const result = parseWeightCondition(condition, measurement);

    expect(result).toEqual({ minWeight: '10', maxWeight: '20' });
  });

  // Add more test cases for parseWeightCondition if needed
});

describe('parsePriceCondition function', () => {
  test('should correctly parse price conditions', () => {
    const condition = ' $50 - $100 ';
    const currency = '$';
    const result = parsePriceCondition(condition, currency);

    expect(result).toEqual({ minPrice: '50', maxPrice: '100' });
  });

});
