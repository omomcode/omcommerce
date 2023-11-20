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
    strapi.plugin("omcommerce").service("billing").find.mockRejectedValueOnce("Invalid data");

    // @ts-ignore
    await billingController({ strapi }).find(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Invalid data");
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

  it('should handle invalid data entries error when creating billing information', async () => {
    const ctx = {
      request: {
        body: {
          name: 'New Billing Company',
          // Omit one of the required fields to simulate an invalid data entry
        },
      },
      body: null,
      throw: jest.fn(),
    };

    // @ts-ignore
    await billingController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters for a 400 error
    expect(ctx.throw).toHaveBeenCalledWith(400, "Invalid data");
  });

  it('should handle error when creating billing information', async () => {
    const ctx = {
      request: {
        body: {
          name: 'New Billing Company',
          // Include all required fields to simulate a successful create
          country: 'Some Country',
          address: 'Some Address',
          apartment: 'Some Apartment',
          postal: '12345',
          city: 'Some City',
        },
      },
      body: null,
      throw: jest.fn(),
    };

    // Simulate an error in the create method that triggers a 500 error
    strapi.plugin("omcommerce").service("billing").create.mockRejectedValueOnce("Internal Server Error");

    // @ts-ignore
    await billingController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters for a 500 error
    expect(ctx.throw).toHaveBeenCalledWith(500, "Internal Server Error");
  });


  it('should update billing information', async function () {
    const ctx = {
      params: { id: 1 }, // Assuming the ID for the billing information is 1
      request: {
        body: {
          ...billingData,
          name: 'Updated Billing Company'
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

  it('should handle invalid data entries error when updating billing information', async () => {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          name: 'Updated Billing Company',
          // Omit one of the required fields to simulate an invalid data entry
        },
      },
      body: null,
      throw: jest.fn(),
    };

    // @ts-ignore
    await billingController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters for a 400 error
    expect(ctx.throw).toHaveBeenCalledWith(400, "Invalid data");
  });

  it('should handle error when updating billing information', async () => {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          name: 'Updated Billing Company',
          // Include all required fields to simulate a successful update
          country: 'Some Country',
          address: 'Some Address',
          apartment: 'Some Apartment',
          postal: '12345',
          city: 'Some City',
        },
      },
      body: null,
      throw: jest.fn(),
    };

    // Simulate an error in the update method that triggers a 500 error
    strapi.plugin("omcommerce").service("billing").update.mockRejectedValueOnce("Internal Server Error");

    // @ts-ignore
    await billingController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters for a 500 error
    expect(ctx.throw).toHaveBeenCalledWith(500, "Internal Server Error");
  });


});
