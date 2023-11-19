import shippingCalculator from '../../../server/services/shippingcalculator';
import calculateMaxRate from "../../../server/utils/shipping-calculator/shipping-rate-calc";
import * as countryHelper from "../../../server/utils/country-helper/country-helper";

jest.mock("../../../server/utils/shipping-calculator/shipping-rate-calc");
jest.mock("../../../server/utils/country-helper/country-helper");

describe('Shipping Calculator Service', () => {
  let strapi: { entityService: any, plugin: any };

  beforeEach(() => {
    strapi = strapi = {
      entityService: {
        findMany: jest.fn(),
        findOne: jest.fn(),
      },
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockImplementation((serviceName: string) => {
          if (serviceName === 'product') {
            return {
              find: jest.fn().mockImplementation((data: any) => {
                // Mock implementation for the 'product' service
                return [{id: 1, amount_value: 5, name: "neki product", weight : 5}];
              }),
            };
          } else if (serviceName === 'shippingzone') {
            return {
              find: jest.fn().mockImplementation((data: any) => {
                // Mock implementation for the 'shippingzone' service
                return [{
                  name: 'Domestic',
                  countries: [{code: 'GB', name: 'United Kingdom'}],
                  shippingrate: [
                    {condition: '', price: 5, name: 'standard'},
                  ],
                }];
              }),
            };
          } else if (serviceName === 'currency') {
            return {
              find: jest.fn().mockImplementation((data: any) => {
                return {currency: "EUR"};
              }),
            };
          } else if (serviceName === 'timezone') {
            return {
              find: jest.fn().mockImplementation((data: any) => {
                return {unit: "g"};
              }),
            };
          }
          // Add more conditions for other services as needed

          // Default case, return an empty object if the service is not recognized
          return {};
        }),
      }),
    };


    // Mock console.error to capture error messages
    console.error = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculate', () => {
    it('should calculate shipping rates based on cart data', async () => {
      // Arrange
      const mockCartData = {
        data: {
          cart: [
            {id: "1", quantity: "2"},
            // Add more items to the cart as needed for testing
          ],
          country_code: 'GB',
        },
      };


      // @ts-ignore
      countryHelper.findShippingZoneBasedOnCountry.mockReturnValue({
        name: 'Domestic',
        shippingrate: [
          {condition: '', price: 5, name: 'standard'},
        ],
      });

      // @ts-ignore
      calculateMaxRate.mockReturnValue(5);
      // Act
      // @ts-ignore
      const shippingRate = await shippingCalculator({strapi}).calculate(mockCartData);

      // Assert
      // You can add specific assertions based on the expected shipping rate calculation
      expect(shippingRate).toEqual(5);

      // Ensure calculateMaxRate is called with the correct arguments
      expect(calculateMaxRate).toHaveBeenCalledWith(
        expect.any(Array), // shipping rates array
        expect.any(Number), // totalAmountValue
        expect.any(Number), // totalWeight
        expect.anything(),  // currency
        expect.anything()   // timezone
      );
    });
    });
});
