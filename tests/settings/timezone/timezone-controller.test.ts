import timezoneController from "../../../server/controllers/timezone";
import { ITimeZone } from "../../../types/timezone";

describe('Timezone Controller', () => {
  let strapi: { plugin: any; };
  let timezoneData: ITimeZone;

  beforeEach(async function () {
    timezoneData = {
      id: 1,
      timezone: "Central Europe Standard Time",
      measurement: "Metric",
      unit: "g",
      lengthUnit: "cm",
    };

    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            data: [timezoneData],
          }),
          create: jest.fn().mockReturnValue({
            data: timezoneData,
          }),
          update: jest.fn().mockReturnValue({
            data: {
              ...timezoneData,
              timezone: "Updated Timezone", // Assuming an updated timezone
            },
          }),
        }),
      }),
    };
  });

  it('should find timezones', async function () {
    const ctx = {
      query: {},
      body: null,
    };

    // @ts-ignore
    const result = await timezoneController({ strapi }).find(ctx);

    // Expect the body to contain the mock data
    expect(result.data).toEqual([timezoneData]);

    // Expect find to be called once
    expect(strapi.plugin('omcommerce').service('timezone').find).toBeCalledTimes(1);
  });

  it('should create a timezone', async function () {
    const ctx = {
      request: {
        body: timezoneData,
      },
      body: null,
    };

    // @ts-ignore
    await timezoneController({ strapi }).create(ctx);

    // Expect the body to contain the mock data for the created timezone
    expect(ctx.body).toEqual({
      data: timezoneData,
    });

    // Expect create to be called once
    expect(strapi.plugin('omcommerce').service('timezone').create).toBeCalledTimes(1);
  });

  it('should update a timezone', async function () {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          timezone: "Updated Timezone", // Assuming an updated timezone
        },
      },
      body: null,
    };

    // @ts-ignore
    await timezoneController({ strapi }).update(ctx);

    // Expect the body to contain the mock data for the updated timezone
    expect(ctx.body).toEqual({
      data: {
        ...timezoneData,
        timezone: "Updated Timezone",
      },
    });

    // Expect update to be called once
    expect(strapi.plugin('omcommerce').service('timezone').update).toBeCalledTimes(1);
  });
});
