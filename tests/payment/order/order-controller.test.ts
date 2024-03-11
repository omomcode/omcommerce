import paypalSetupController from '../../../server/controllers/paypalsetup';
import { IPaypalSetup } from '../../../types/paypalsetup';
import billingController from "../../../server/controllers/billing";

describe('PayPal Setup Controller', () => {
  let strapi: { plugin: any };
  let paypalSetupData: IPaypalSetup;

  beforeEach(async () => {
    paypalSetupData = {
      id: 1,
      live_paypal_client_id: 'UPDATED_CLIENT_ID',
      live_paypal_client_secret: 'UPDATED_CLIENT_SECRET',
      sandbox_paypal_client_id: 'UPDATED_SANDBOX_CLIENT_ID',
      sandbox_paypal_client_secret: 'UPDATED_SANDBOX_CLIENT_SECRET',
      live: true,
      paypalSelected: true,
      payProGlobalSelected: true,
      paymentThreeSelected: false
    };

    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            data: [paypalSetupData],
          }),
          create: jest.fn().mockReturnValue({
            data: paypalSetupData,
          }),
          update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
            return { data: { ...paypalSetupData, ...data } };
          }),
        }),
      }),
    };
  });

  it('should find PayPal setup information', async () => {
    const ctx = {
      query: {},
      body: null,
    };

    // @ts-ignore
    const result = await paypalSetupController({ strapi }).find(ctx);

    // Expect the body to contain the mock data
    expect(result.data).toEqual([paypalSetupData]);

    // Expect find to be called once
    expect(strapi.plugin('omccommerce').service('paypalSetup').find).toBeCalledTimes(1);
  });

  it('should throw an error when finding PayPal setup information', async () => {
    const ctx = {
      query: {},
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the find method
    strapi.plugin('omcommerce').service('paypalSetup').find.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await paypalSetupController({ strapi }).find(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

  it('should throw an error when creating PayPal setup information', async () => {
    const newData = {
      id: 1,
      live_paypal_client_id: 'UPDATED_CLIENT_ID',
      live_paypal_client_secret: 'UPDATED_CLIENT_SECRET',
      sandbox_paypal_client_id: 'UPDATED_SANDBOX_CLIENT_ID',
      sandbox_paypal_client_secret: 'UPDATED_SANDBOX_CLIENT_SECRET',
      live: true,
      paypalSelected: true,
      payProGlobalSelected: true,
      paymentThreeSelected: false
    };

    const ctx: any = {
      request: { body: newData },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the create method
    strapi.plugin('omcommerce').service('paypalSetup').create.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await paypalSetupController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

  it('should create PayPal setup information', async () => {
    const newData = {
      id: 1,
      live_paypal_client_id: 'UPDATED_CLIENT_ID',
      live_paypal_client_secret: 'UPDATED_CLIENT_SECRET',
      sandbox_paypal_client_id: 'UPDATED_SANDBOX_CLIENT_ID',
      sandbox_paypal_client_secret: 'UPDATED_SANDBOX_CLIENT_SECRET',
      live: true,
      paypalSelected: true,
      payProGlobalSelected: true,
      paymentThreeSelected: false
    };

    const ctx: any = {
      request: { body: newData },
      body: null,
    };

    // @ts-ignore
    await paypalSetupController({ strapi }).create(ctx);

    // Use type assertion to inform TypeScript that ctx.body is not null
    expect(ctx.body!.data).toEqual(newData);

    // Expect create to be called once
    expect(strapi.plugin('omcommerce').service('paypalSetup').create).toBeCalledTimes(1);
  });

  it('should handle invalid data entries error when creating paypalsetup information', async () => {
    const updateData = {
      id: 1,
      live_paypal_client_id: 'UPDATED_CLIENT_ID',
      sandbox_paypal_client_id: 'UPDATED_SANDBOX_CLIENT_ID',
      live: false,
    };

    const ctx: any = {
      params: { id: 1 },
      request: { body: updateData },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // @ts-ignore
    await paypalSetupController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters for a 400 error
    expect(ctx.throw).toHaveBeenCalledWith(400, "Invalid data");
  });


  it('should update PayPal setup information', async () => {
    const updateData = {
      id: 1,
      live_paypal_client_id: 'UPDATED_CLIENT_ID',
      live_paypal_client_secret: 'UPDATED_CLIENT_SECRET',
      sandbox_paypal_client_id: 'UPDATED_SANDBOX_CLIENT_ID',
      sandbox_paypal_client_secret: 'UPDATED_SANDBOX_CLIENT_SECRET',
      live: true,
      paypalSelected: true,
      payProGlobalSelected: true,
      paymentThreeSelected: false
    };

    const ctx: any = {
      params: { id: 1 },
      request: { body: updateData },
      body: null,
    };

    // @ts-ignore
    await paypalSetupController({ strapi }).update(ctx);

    // Expect the body to contain the mock data for the updated PayPal setup information
    expect(ctx.body!.data).toEqual({ ...paypalSetupData, ...updateData });

    // Expect update to be called once
    expect(strapi.plugin('omcommerce').service('paypalsetup').update).toBeCalledTimes(1);
  });

  it('should handle invalid data entries error when updateing paypalsetup information', async () => {
    const updateData = {
      id: 1,
      live_paypal_client_id: 'UPDATED_CLIENT_ID',
      sandbox_paypal_client_id: 'UPDATED_SANDBOX_CLIENT_ID',
      live: false,
    };

    const ctx: any = {
      params: { id: 1 },
      request: { body: updateData },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // @ts-ignore
    await paypalSetupController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters for a 400 error
    expect(ctx.throw).toHaveBeenCalledWith(400, "Invalid data");
  });


  it('should throw an error when updating PayPal setup information', async () => {
    const updateData = {
      id: 1,
      live_paypal_client_id: 'UPDATED_CLIENT_ID',
      live_paypal_client_secret: 'UPDATED_CLIENT_SECRET',
      sandbox_paypal_client_id: 'UPDATED_SANDBOX_CLIENT_ID',
      sandbox_paypal_client_secret: 'UPDATED_SANDBOX_CLIENT_SECRET',
      live: true,
    };

    const ctx: any = {
      params: { id: 1 },
      request: { body: updateData },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the update method
    strapi.plugin('omcommerce').service('paypalSetup').update.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await paypalSetupController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

});
