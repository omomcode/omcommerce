import shippingCalculator from '../../../server/services/shippingcalculator';
import calculateMaxRate from "../../../server/utils/shipping-calculator/shipping-rate-calc";
import * as countryHelper from "../../../admin/src/utils/country-helper/country-helper";

jest.mock("../../../server/utils/shipping-calculator/shipping-rate-calc");
jest.mock("../../../admin/src/utils/country-helper/country-helper");

describe('Shipping Calculator Service', () => {
  let strapi: { entityService: any };

  beforeEach(() => {
    strapi = {
      entityService: {
        findMany: jest.fn(),
        findOne: jest.fn(),
      },
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
            { id: "1", quantity: "2" },
            // Add more items to the cart as needed for testing
          ],
          country_code: 'GB',
        },
      };

      // Mock the necessary functions in strapi.entityService
      strapi.entityService.findMany.mockResolvedValue([{ amount_value: 10, weight: 2 }]);
      strapi.entityService.findOne.mockResolvedValue({ /* mock zone data */ });


      // @ts-ignore
      countryHelper.findShippingZoneBasedOnCountry.mockReturnValue({
        name: 'Domestic',
        shippingrate: [
          { condition: '', price: 5 , name: 'standard'},
        ],
      });

      // @ts-ignore
      calculateMaxRate.mockReturnValue(5);
      // Act
      // @ts-ignore
      const shippingRate = await shippingCalculator({ strapi }).calculate(mockCartData);

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

    it('should throw an error when entityService is not defined for findProduct', async () => {
      // Arrange
      strapi.entityService = undefined;

      // Act & Assert
      // @ts-ignore
      await expect(shippingCalculator({ strapi }).calculate({ data: { cart: [], country_code: 'GB' } })).rejects.toThrowError(
        'strapi.entityService is not defined'
      );
    });

    it('should throw an error when entityService is not defined for findShippingZone', async () => {
      // Arrange
      strapi.entityService = undefined;

      // Act & Assert
      // @ts-ignore
      await expect(shippingCalculator({ strapi }).calculate({ data: { cart: [], country_code: 'GB' } })).rejects.toThrowError(
        'strapi.entityService is not defined'
      );
    });

    it('should throw an error when entityService is not defined for findTimezone', async () => {
      // Arrange
      strapi.entityService = undefined;

      // Act & Assert
      // @ts-ignore
      await expect(shippingCalculator({ strapi }).calculate({ data: { cart: [], country_code: 'GB' } })).rejects.toThrowError(
        'strapi.entityService is not defined'
      );
    });

    it('should throw an error when entityService is not defined for findCurrency', async () => {
      // Arrange
      strapi.entityService = undefined;

      // Act & Assert
      // @ts-ignore
      await expect(shippingCalculator({ strapi }).calculate({ data: { cart: [], country_code: 'GB' } })).rejects.toThrowError(
        'strapi.entityService is not defined'
      );
    });

    // Add more test cases as needed based on different scenarios and conditions
  });
});
