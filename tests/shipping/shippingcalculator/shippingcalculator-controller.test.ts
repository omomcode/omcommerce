import shippingCalculatorController from '../../../server/controllers/shippingcalculator';

describe('Shipping Calculator Controller', () => {
  let strapi: { plugin: any };

  beforeEach(() => {
    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          calculate: jest.fn().mockImplementation((data: any) => {
            return data; // Replace with the expected result
          }),
        }),
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate shipping rates based on request body', async () => {
    // Arrange
    const mockRequestBody = {
      data: {
        cart: [
          { id: '1', quantity: '2' },
          // Add more items to the cart as needed for testing
        ],
        country_code: 'GB',
      },
    };

    const ctx: any = {
      request: { body: mockRequestBody },
      body: null,
    };

    // Act
    // @ts-ignore
    await shippingCalculatorController({ strapi }).calculate(ctx);

    // Assert
    expect(strapi.plugin('omcommerce').service('shippingcalculator').calculate).toBeCalledTimes(1);
    expect(ctx.body).toEqual(mockRequestBody);
  });

  it('should handle errors during calculation and throw a 500 status', async () => {
    // Arrange
    const mockError = new Error('Simulated error');

    const ctx: any = {
      request: { body: {} },
      throw: jest.fn(),
    };

    // Simulate an error in the calculate method
    strapi.plugin('omcommerce').service('shippingcalculator').calculate.mockRejectedValueOnce(mockError);

    // Act
    // @ts-ignore
    await shippingCalculatorController({ strapi }).calculate(ctx);

    // Assert
    expect(ctx.throw).toHaveBeenCalledWith(500, mockError);
    expect(ctx.body).toEqual({});
  });
});
