import currencyController from "../../../server/controllers/currency";
import { ICurrency } from "../../../types/currency";

describe('Currency Controller', () => {
  let strapi: { plugin: any; };
  let currencyData: ICurrency;

  beforeEach(async function () {
    currencyData = {
      id: 1,
      currency: "EUR",
    };

    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            data: [currencyData],
          }),
          create: jest.fn().mockReturnValue({
            data: currencyData,
          }),
          update: jest.fn().mockReturnValue({
            data: {
              ...currencyData,
              currency: "USD", // Assuming an updated currency
            },
          }),
        }),
      }),
    };
  });

  it('should find currencies', async function () {
    const ctx = {
      query: {},
      body: null,
    };

    // @ts-ignore
    const result = await currencyController({ strapi }).find(ctx);

    // Expect the body to contain the mock data
    expect(result.data).toEqual([currencyData]);

    // Expect find to be called once
    expect(strapi.plugin('omcommerce').service('currency').find).toBeCalledTimes(1);
  });

  it('should create a currency', async function () {
    const ctx = {
      request: {
        body: currencyData,
      },
      body: null,
    };

    // @ts-ignore
    await currencyController({ strapi }).create(ctx);

    // Expect the body to contain the mock data for the created currency
    expect(ctx.body).toEqual({
      data: currencyData,
    });

    // Expect create to be called once
    expect(strapi.plugin('omcommerce').service('currency').create).toBeCalledTimes(1);
  });

  it('should update a currency', async function () {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          currency: "USD", // Assuming an updated currency
        },
      },
      body: null,
    };

    // @ts-ignore
    await currencyController({ strapi }).update(ctx);

    // Expect the body to contain the mock data for the updated currency
    expect(ctx.body).toEqual({
      data: {
        ...currencyData,
        currency: "USD",
      },
    });

    // Expect update to be called once
    expect(strapi.plugin('omcommerce').service('currency').update).toBeCalledTimes(1);
  });
});
