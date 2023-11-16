import billingController from "../../../server/controllers/billing";
import { IBilling } from "../../../types/billing";

describe('Billing Controller', () => {
  let strapi: { plugin: any; };
  let billingData: IBilling;

  beforeEach(async function () {
    billingData = {
      id: 1,
      name: 'Billing Company',
      country: 'US',
      address: '123 Main St',
      apartment: 'Apt 456',
      postal: "123456",
      city: 'Cityville',
    };

    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            data: [billingData],
          }),
          create: jest.fn().mockReturnValue({
            data: billingData,
          }),
          update: jest.fn().mockReturnValue({
            data: {
              ...billingData,
              name: 'Updated Billing Company',
            },
          }),
        }),
      }),
    };
  });

  it('should find billing information', async function () {
    const ctx = {
      query: {},
      body: null,
    };

    // @ts-ignore
    const result = await billingController({ strapi }).find(ctx);

    // Expect the body to contain the mock data
    expect(result.data).toEqual([billingData]);

    // Expect find to be called once
    expect(strapi.plugin('omcommerce').service('billing').find).toBeCalledTimes(1);
  });

  it('should handle error when finding billing information', async () => {
    const ctx = {
      query: {},
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the find method
    strapi.plugin("omcommerce").service("billing").find.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await billingController({ strapi }).find(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });


  it('should create billing information', async function () {
    const ctx = {
      request: {
        body: billingData,
      },
      body: null,
    };

    // @ts-ignore
    await billingController({ strapi }).create(ctx);

    // Expect the body to contain the mock data for the created billing information
    expect(ctx.body).toEqual({
      data: billingData,
    });

    // Expect create to be called once
    expect(strapi.plugin('omcommerce').service('billing').create).toBeCalledTimes(1);
  });

  it('should handle error when creating billing information', async () => {
    const ctx = {
      request: {
        body: billingData,
      },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the create method
    strapi.plugin("omcommerce").service("billing").create.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await billingController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });



  it('should update billing information', async function () {
    const ctx = {
      params: { id: 1 }, // Assuming the ID for the billing information is 1
      request: {
        body: {
          name: 'Updated Billing Company',
        },
      },
      body: null,
    };

    // @ts-ignore
    await billingController({ strapi }).update(ctx);

    // Expect the body to contain the mock data for the updated billing information
    expect(ctx.body).toEqual({
      data: {
        ...billingData,
        name: 'Updated Billing Company',
      },
    });

    // Expect update to be called once
    expect(strapi.plugin('omcommerce').service('billing').update).toBeCalledTimes(1);
  });

  it('should handle error when updating billing information', async () => {
    const ctx = {
      params: { id: 1 }, // Assuming the ID for the billing information is 1
      request: {
        body: {
          name: 'Updated Billing Company',
        },
      },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the update method
    strapi.plugin("omcommerce").service("billing").update.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await billingController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });


});
