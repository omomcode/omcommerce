import paypalController from '../../../server/controllers/paypal';
import { IPaypal } from '../../../types/paypal';

describe('PayPal Controller', () => {
  let strapi: { plugin: any };
  let paypalData: IPaypal;

  beforeEach(async () => {
    paypalData = {
      id: 1,
      live_paypal_client_id: 'UPDATED_CLIENT_ID',
      live: true,
    };

    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          settings: jest.fn().mockReturnValue({
            data: [paypalData],
          }),
        }),
      }),
    };
  });

  it('should find PayPal information', async () => {
    const ctx = {
      query: {},
      body: null,
    };

    // @ts-ignore
    const result = await paypalController({ strapi }).settings(ctx);

    // Expect the body to contain the mock data
    expect(result.data).toEqual([paypalData]);

    // Expect find to be called once
    expect(strapi.plugin('omcommerce').service('paypal').settings).toBeCalledTimes(1);
  });

  it('should throw an error when finding PayPal information', async () => {
    const ctx = {
      query: {},
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the find method
    strapi.plugin('omcommerce').service('paypal').settings.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await paypalController({ strapi }).settings(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });
});
