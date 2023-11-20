import shippingRateController from "../../../server/controllers/shippingrate";
import { IShippingRate } from "../../../types/rate";

describe('Shipping Rate Controller', () => {
  let strapi: { plugin: any; };
  let shippingRateData: IShippingRate;

  beforeEach(async function () {
    shippingRateData = {
      id: 1,
      name: "standard",
      condition: "",
      price: 0
    };

    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            data: [shippingRateData],
          }),
          create: jest.fn().mockReturnValue({
            data: shippingRateData,
          }),
          update: jest.fn().mockReturnValue({
            data: {
              ...shippingRateData,
              name: 'Updated Rate', // Assuming an updated 'name' for testing
              condition:"",
              price: 1
            },
          }),
          delete: jest.fn().mockReturnValue({
            success: true,
          }),
        }),
      }),
    };
  });

  it('should find shipping rates', async function () {
    const ctx = {
      query: {},
      body: null,
    };

    // @ts-ignore
    const result = await shippingRateController({ strapi }).find(ctx);

    // Expect the body to contain the mock data
    expect(result.data).toEqual([shippingRateData]);

    // Expect find to be called once
    expect(strapi.plugin('omcommerce').service('shippingrate').find).toBeCalledTimes(1);
  });

  it('should throw an error when finding shipping rates', async () => {
    const ctx = {
      query: {},
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the find method
    strapi.plugin('omcommerce').service('shippingrate').find.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await shippingRateController({ strapi }).find(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

  it('should create a shipping rate', async function () {
    const ctx = {
      request: {
        body: shippingRateData,
      },
      body: null,
    };

    // @ts-ignore
    await shippingRateController({ strapi }).create(ctx);

    // Expect the body to contain the mock data for the created shipping rate
    expect(ctx.body).toEqual({
      data: shippingRateData,
    });

    // Expect create to be called once
    expect(strapi.plugin('omcommerce').service('shippingrate').create).toBeCalledTimes(1);
  });

  it('should throw an error when creating a shipping rate', async () => {
    const ctx = {
      request: {
        body: shippingRateData,
      },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the create method
    strapi.plugin('omcommerce').service('shippingrate').create.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await shippingRateController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

  it('should update a shipping rate', async function () {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          name: 'Updated Rate', // Assuming an updated 'name' for testing
          condition: "",
          price: 1
        },
      },
      body: null,
    };

    // @ts-ignore
    await shippingRateController({ strapi }).update(ctx);

    // Expect the body to contain the mock data for the updated shipping rate
    expect(ctx.body).toEqual({
      data: {
        ...shippingRateData,
        condition: "", price: 1,
        name: 'Updated Rate',
      },
    });

    // Expect update to be called once
    expect(strapi.plugin('omcommerce').service('shippingrate').update).toBeCalledTimes(1);
  });

  it('should throw an error when updating a shipping rate', async () => {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          name: 'Updated Rate',
        },
      },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the update method
    strapi.plugin('omcommerce').service('shippingrate').update.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await shippingRateController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

  it('should delete a shipping rate', async function () {
    const ctx = {
      params: { id: 1 },
      body: null,
    };

    // @ts-ignore
    await shippingRateController({ strapi }).delete(ctx);

    // Expect delete to be called once
    expect(strapi.plugin('omcommerce').service('shippingrate').delete).toBeCalledTimes(1);

    // Expect the body to contain the success status for the deleted shipping rate
    expect(ctx.body).toEqual({
      success: true,
    });
  });

  it('should throw an error when deleting a shipping rate', async () => {
    const ctx = {
      params: { id: 1 },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the delete method
    strapi.plugin('omcommerce').service('shippingrate').delete.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await shippingRateController({ strapi }).delete(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });
});
