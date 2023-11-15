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
});
