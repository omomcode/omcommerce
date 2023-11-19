import paymentController from '../../../server/controllers/payment';

describe('Payment Controller', () => {
  let strapi: { plugin: any };

  beforeEach(() => {
    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          capture: jest.fn().mockImplementation((data: any) => {
            return data; // Replace with the expected result
          }),
          orders: jest.fn().mockImplementation((data: any) => {
            return data; // Replace with the expected result
          }),
        }),
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should capture payment based on request body', async () => {
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
    await paymentController({ strapi }).capture(ctx);

    // Assert
    expect(strapi.plugin('omcommerce').service('payment').capture).toBeCalledTimes(1);
    expect(ctx.body).toEqual(mockRequestBody);
  });

  it('should get orders based on request body', async () => {
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
    await paymentController({ strapi }).orders(ctx);

    // Assert
    expect(strapi.plugin('omcommerce').service('payment').orders).toBeCalledTimes(1);
    expect(ctx.body).toEqual(mockRequestBody);
  });

  it('should handle errors during capture and throw a 500 status', async () => {
    // Arrange
    const mockError = new Error('Simulated error');

    const ctx: any = {
      request: { body: {} },
      throw: jest.fn(),
    };

    // Simulate an error in the capture method
    strapi.plugin('omcommerce').service('payment').capture.mockRejectedValueOnce(mockError);

    // Act
    // @ts-ignore
    await paymentController({ strapi }).capture(ctx);

    // Assert
    expect(ctx.throw).toHaveBeenCalledWith(500, mockError);
    expect(ctx.body).toEqual(undefined);
  });

  it('should handle errors during orders and throw a 500 status', async () => {
    // Arrange
    const mockError = new Error('Simulated error');

    const ctx: any = {
      request: { body: {} },
      throw: jest.fn(),
    };

    // Simulate an error in the orders method
    strapi.plugin('omcommerce').service('payment').orders.mockRejectedValueOnce(mockError);

    // Act
    // @ts-ignore
    await paymentController({ strapi }).orders(ctx);

    // Assert
    expect(ctx.throw).toHaveBeenCalledWith(500, mockError);
    expect(ctx.body).toEqual(undefined);
  });
});
