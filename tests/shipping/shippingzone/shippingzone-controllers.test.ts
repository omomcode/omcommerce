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

      // Add other properties as needed
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
});
