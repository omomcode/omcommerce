import shippingZoneController from "../../../server/controllers/shippingzone";
import { IShippingZone } from "../../../types/zonetable";

describe('Shipping Zone Controller', () => {
  let strapi: { plugin: any; };
  let shippingZoneData: IShippingZone;

  beforeEach(async function () {
    shippingZoneData = {
      id: 1,
      name: 'Domestic Zone',
      countries: [{ code: 'US', name: 'United States' }],
      shippingRatesData: []
    };

    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            data: [shippingZoneData],
          }),
          create: jest.fn().mockReturnValue({
            data: shippingZoneData,
          }),
          update: jest.fn().mockReturnValue({
            data: {
              ...shippingZoneData,
              name: 'Updated Zone',
            },
          }),
          delete: jest.fn().mockReturnValue({
            success: true,
          }),
        }),
      }),
    };
  });

  it('should find all shipping zones', async function () {
    const ctx = {
      query: {},
      body: null,
    };

    // @ts-ignore
    const result = await shippingZoneController({ strapi }).find(ctx);

    // Expect the body to contain the mock data
    expect(result.data).toEqual([shippingZoneData]);

    // Expect find to be called once
    expect(strapi.plugin('omcommerce').service('shippingzone').find).toBeCalledTimes(1);
  });

  it('should throw an error when finding shipping zones', async () => {
    const ctx = {
      query: {},
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the find method
    strapi.plugin('omcommerce').service('shippingzone').find.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await shippingZoneController({ strapi }).find(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });it('should throw an error when finding shipping zones', async () => {
    const ctx = {
      query: {},
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the find method
    strapi.plugin('omcommerce').service('shippingzone').find.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await shippingZoneController({ strapi }).find(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

  it('should create a shipping zone', async function () {
    const ctx = {
      request: {
        body: shippingZoneData,
      },
      body: null,
    };

    // @ts-ignore
    await shippingZoneController({ strapi }).create(ctx);

    // Expect the body to contain the mock data for the created shipping zone
    expect(ctx.body).toEqual({
      data: shippingZoneData,
    });

    // Expect create to be called once
    expect(strapi.plugin('omcommerce').service('shippingzone').create).toBeCalledTimes(1);
  });

  it('should throw an error when creating a shipping zone', async () => {
    const ctx = {
      request: {
        body: shippingZoneData,
      },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the create method
    strapi.plugin('omcommerce').service('shippingzone').create.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await shippingZoneController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

  it('should throw Invalid data error when creating a shipping zone', async () => {

    const shippingZone = {
      id: 1,
      countries: [{ code: 'US', name: 'United States' }],
      shippingRatesData: []
    };

    const ctx = {
      request: {
        body: shippingZone,
      },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the create method
    strapi.plugin('omcommerce').service('shippingzone').create.mockRejectedValueOnce("Invalid data");

    // @ts-ignore
    await shippingZoneController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(400, "Invalid data");
  });



  it('should update a shipping zone', async function () {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          name: 'Updated Zone',
        },
      },
      body: null,
    };

    // @ts-ignore
    await shippingZoneController({ strapi }).update(ctx);

    // Expect the body to contain the mock data for the updated shipping zone
    expect(ctx.body).toEqual({
      data: {
        ...shippingZoneData,
        name: 'Updated Zone',
      },
    });

    // Expect update to be called once
    expect(strapi.plugin('omcommerce').service('shippingzone').update).toBeCalledTimes(1);
  });

  it('should throw an error when updating a shipping zone', async () => {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          name: 'Updated Zone',
        },
      },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the update method
    strapi.plugin('omcommerce').service('shippingzone').update.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await shippingZoneController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

  it('should throw Invalid data error when updating a shipping zone', async () => {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
        },
      },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the update method
    strapi.plugin('omcommerce').service('shippingzone').update.mockRejectedValueOnce("Invalid data");

    // @ts-ignore
    await shippingZoneController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(400, "Invalid data");
  });



  it('should delete a shipping zone', async function () {
    const ctx = {
      params: { id: 1 },
      body: null,
    };

    // @ts-ignore
    await shippingZoneController({ strapi }).delete(ctx);

    // Expect delete to be called once
    expect(strapi.plugin('omcommerce').service('shippingzone').delete).toBeCalledTimes(1);

    // Expect the body to contain the success status for the deleted shipping zone
    expect(ctx.body).toEqual({
      success: true,
    });
  });

  it('should throw an error when deleting a shipping zone', async () => {
    const ctx = {
      params: { id: 1 },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the delete method
    strapi.plugin('omcommerce').service('shippingzone').delete.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await shippingZoneController({ strapi }).delete(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

});
