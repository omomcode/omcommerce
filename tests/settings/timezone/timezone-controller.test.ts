import timezoneController from "../../../server/controllers/timezone";
import { IZoneData } from "../../../types/timezone";

describe('Timezone Controller', () => {
  let strapi: { plugin: any; };
  let timezoneData: IZoneData;

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

  it('should throw an error when finding timezones', async function () {
    const ctx = {
      query: {},
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the find method
    strapi.plugin('omcommerce').service('timezone').find.mockRejectedValueOnce("Invalid data");

    // @ts-ignore
    await timezoneController({ strapi }).find(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Invalid data");
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

  it('should handle invalid data entries error when creating a timezone', async () => {
    const ctx = {
      request: {
        body: {
          timezone: 'UTC',
          // Omit one of the required fields to simulate an invalid data entry
        },
      },
      throw: jest.fn(),
    };

    // @ts-ignore
    await timezoneController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters for a 400 error
    expect(ctx.throw).toHaveBeenCalledWith(400, "Invalid data");
  });

  it('should handle error when creating a timezone', async () => {
    const ctx = {
      request: {
        body: {
          timezone: 'UTC',
          measurement: 'Metric',
          unit: 'Meter',
          lengthUnit: 'Kilometer',
          // Include all required fields to simulate a successful create
        },
      },
      throw: jest.fn(),
    };

    // Simulate an error in the create method that triggers a 500 error
    strapi.plugin("omcommerce").service("timezone").create.mockRejectedValueOnce("Internal Server Error");

    // @ts-ignore
    await timezoneController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters for a 500 error
    expect(ctx.throw).toHaveBeenCalledWith(500, "Internal Server Error");
  });


  it('should update a timezone', async function () {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          ...timezoneData,
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

  it('should handle invalid data entries error when updating a timezone', async () => {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          timezone: 'UTC',
          // Omit one of the required fields to simulate an invalid data entry
        },
      },
      throw: jest.fn(),
    };

    // @ts-ignore
    await timezoneController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters for a 400 error
    expect(ctx.throw).toHaveBeenCalledWith(400, "Invalid data");
  });

  it('should handle error when updating a timezone', async () => {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          timezone: 'UTC',
          measurement: 'Metric',
          unit: 'Meter',
          lengthUnit: 'Kilometer',
          // Include all required fields to simulate a successful update
        },
      },
      throw: jest.fn(),
    };

    // Simulate an error in the update method that triggers a 500 error
    strapi.plugin("omcommerce").service("timezone").update.mockRejectedValueOnce("Internal Server Error");

    // @ts-ignore
    await timezoneController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters for a 500 error
    expect(ctx.throw).toHaveBeenCalledWith(500, "Internal Server Error");
  });


});
