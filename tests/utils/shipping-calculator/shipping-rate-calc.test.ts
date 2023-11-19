import calculateMaxRate from '../../../server/utils/shipping-calculator/shipping-rate-calc';
import { IShippingRate } from '../../../types/rate';

describe('calculateMaxRate function', () => {
  const mockShippingRates: IShippingRate[] = [
    { id: 1, name: 'Rate 1', condition: 'EUR 10EUR-EUR 100EUR', price: 15 },
    { id: 2, name: 'Rate 2', condition: 'EUR 100-EUR 200', price: 25 },
    { id: 3, name: 'Rate 3', condition: '2kg-5kg', price: 30 },
    { id: 4, name: 'Rate 4', condition: '5kg-10kg', price: 40 },
    { id: 5, name: 'Default Rate', condition: '', price: 10 },
  ];

  test('should return undefined when shippingRates is undefined', () => {
    const result = calculateMaxRate(undefined, 100, 5, { currency: 'USD' }, { unit: 'kg' });
    expect(result).toBe(0);
  });

  test('should return the correct max rate based on total amount value', () => {
    const result = calculateMaxRate(mockShippingRates, 50, 1, { currency: 'EUR' }, { unit: 'kg' });
    expect(result).toBe(15);
  });

  test('should return the correct max rate based on total weight', () => {
    const result = calculateMaxRate(mockShippingRates, 15, 7, { currency: 'USD' }, { unit: 'kg' });
    expect(result).toBe(40);
  });

  test('should return the default max rate when no matching conditions are found', () => {
    const result = calculateMaxRate(mockShippingRates, 9, 1, { currency: 'EUR' }, { unit: 'lb' });
    expect(result).toBe(10);
  });

  // Add more test cases as needed
});
