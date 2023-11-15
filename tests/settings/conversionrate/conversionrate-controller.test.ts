import conversionRateController from "../../../server/controllers/conversionRate";
import { IConversionRate } from "../../../types/conversionrate";

describe('Conversion Rate Controller', () => {
  let strapi: { plugin: any; };
  let conversionRateData: IConversionRate;

  beforeEach(async function () {
    conversionRateData = {
      id: 1,
      rate: 0.0082327,
      spread: 0.025 / 100,
      conversion_currency: "RSD",
    };

    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            data: [conversionRateData],
          }),
          create: jest.fn().mockReturnValue({
            data: conversionRateData,
          }),
          update: jest.fn().mockReturnValue({
            data: {
              ...conversionRateData,
              rate: 0.0085, // Assuming an updated rate
            },
          }),
        }),
      }),
    };
  });

  it('should find conversion rates', async function () {
    const ctx = {
      query: {},
      body: null,
    };

    // @ts-ignore
    const result = await conversionRateController({ strapi }).find(ctx);

    // Expect the body to contain the mock data
    expect(result.data).toEqual([conversionRateData]);

    // Expect find to be called once
    expect(strapi.plugin('omcommerce').service('conversionRate').find).toBeCalledTimes(1);
  });

  it('should create a conversion rate', async function () {
    const ctx = {
      request: {
        body: conversionRateData,
      },
      body: null,
    };

    // @ts-ignore
    await conversionRateController({ strapi }).create(ctx);

    // Expect the body to contain the mock data for the created conversion rate
    expect(ctx.body).toEqual({
      data: conversionRateData,
    });

    // Expect create to be called once
    expect(strapi.plugin('omcommerce').service('conversionRate').create).toBeCalledTimes(1);
  });

  it('should update a conversion rate', async function () {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          rate: 0.0085, // Assuming an updated rate
        },
      },
      body: null,
    };

    // @ts-ignore
    await conversionRateController({ strapi }).update(ctx);

    // Expect the body to contain the mock data for the updated conversion rate
    expect(ctx.body).toEqual({
      data: {
        ...conversionRateData,
        rate: 0.0085,
      },
    });

    // Expect update to be called once
    expect(strapi.plugin('omcommerce').service('conversionRate').update).toBeCalledTimes(1);
  });
});
