import setupController from "../../../server/controllers/setup";
import { ISetup } from "../../../types/setup";

describe('Setup Controller', () => {
  let strapi: { plugin: any; };
  let setupData: ISetup;

  beforeEach(async function () {
    setupData = {
      id: 1,
      wizard_open: true,
      wizard_option: 0,
      product_type: 0,
      wizard_state: 1,
      initialized: true,
    };

    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            data: [setupData],
          }),
          create: jest.fn().mockReturnValue({
            data: setupData,
          }),
          update: jest.fn().mockReturnValue({
            data: {
              ...setupData,
              wizard_open: false, // Assuming an updated 'wizard_open' for testing
            },
          }),
        }),
      }),
    };
  });

  it('should find setup configurations', async function () {
    const ctx = {
      query: {},
      body: null,
    };

    // @ts-ignore
    const result = await setupController({ strapi }).find(ctx);

    // Expect the body to contain the mock data
    expect(result.data).toEqual([setupData]);

    // Expect find to be called once
    expect(strapi.plugin('omcommerce').service('setup').find).toBeCalledTimes(1);
  });

  it('should find setup configurations and handle error', async function () {
    const ctx = {
      query: {},
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the find method
    strapi.plugin("omcommerce").service("setup").find.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await setupController({ strapi }).find(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });


  it('should create a setup configuration', async function () {
    const ctx = {
      request: {
        body: setupData,
      },
      body: null,
    };

    // @ts-ignore
    await setupController({ strapi }).create(ctx);

    // Expect the body to contain the mock data for the created setup configuration
    expect(ctx.body).toEqual({
      data: setupData,
    });

    // Expect create to be called once
    expect(strapi.plugin('omcommerce').service('setup').create).toBeCalledTimes(1);
  });

  it('should create a setup configuration and handle error', async function () {
    const ctx = {
      request: {
        body: setupData,
      },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the create method
    strapi.plugin("omcommerce").service("setup").create.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await setupController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

  it('should update a setup configuration', async function () {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          wizard_open: false, // Assuming an updated 'wizard_open' for testing
        },
      },
      body: null,
    };

    // @ts-ignore
    await setupController({ strapi }).update(ctx);

    // Expect the body to contain the mock data for the updated setup configuration
    expect(ctx.body).toEqual({
      data: {
        ...setupData,
        wizard_open: false,
      },
    });

    // Expect update to be called once
    expect(strapi.plugin('omcommerce').service('setup').update).toBeCalledTimes(1);
  });

  it('should update a setup configuration and handle error', async function () {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          wizard_open: false, // Assuming an updated 'wizard_open' for testing
        },
      },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the update method
    strapi.plugin("omcommerce").service("setup").update.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await setupController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

});
