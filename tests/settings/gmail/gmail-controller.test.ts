import gmailConfigController from "../../../server/controllers/gmail";
import { IGmail } from "../../../types/gmail";

describe('Gmail Configuration Controller', () => {
  let strapi: { plugin: any; };
  let gmailConfigData: IGmail;

  beforeEach(async function () {
    gmailConfigData = {
      id: 1,
      client_id: "UPDATEDCLIENTID",
      client_secret: "UPDATEDCLIENTSECRET",
      refresh_token: "UPDATEDSECRETREFRESHCODE",
      from: "updated_info@example.com",
      languageRadio: "English"
    };

    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            data: [gmailConfigData],
          }),
          create: jest.fn().mockReturnValue({
            data: gmailConfigData,
          }),
          update: jest.fn().mockReturnValue({
            data: {
              ...gmailConfigData,
              from: "new_info@example.com", // Assuming an updated 'from' for testing
            },
          }),
        }),
      }),
    };
  });

  it('should find Gmail configurations', async function () {
    const ctx = {
      query: {},
      body: null,
    };

    // @ts-ignore
    const result = await gmailConfigController({ strapi }).find(ctx);

    // Expect the body to contain the mock data
    expect(result.data).toEqual([gmailConfigData]);

    // Expect find to be called once
    expect(strapi.plugin('omcommerce').service('gmail').find).toBeCalledTimes(1);
  });

  it('should handle error when finding gmail config', async () => {
    const ctx = {
      query: {},
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the find method
    strapi.plugin("omcommerce").service("gmail").find.mockRejectedValueOnce("Invalid data");

    // @ts-ignore
    await gmailConfigController({ strapi }).find(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Invalid data");
  });



  it('should create a Gmail configuration', async function () {
    const ctx = {
      request: {
        body: gmailConfigData,
      },
      body: null,
    };

    // @ts-ignore
    await gmailConfigController({ strapi }).create(ctx);

    // Expect the body to contain the mock data for the created Gmail configuration
    expect(ctx.body).toEqual({
      data: gmailConfigData,
    });

    // Expect create to be called once
    expect(strapi.plugin('omcommerce').service('gmail').create).toBeCalledTimes(1);
  });

  it('should handle invalid data entries error when creating Gmail configuration', async () => {
    const ctx = {
      request: {
        body: {
          client_id: 'someClientId',
          // Omit one of the required fields to simulate an invalid data entry
        },
      },
      throw: jest.fn(),
    };

    // @ts-ignore
    await gmailConfigController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters for a 400 error
    expect(ctx.throw).toHaveBeenCalledWith(400, "Invalid data");
  });

  it('should handle error when creating Gmail configuration', async () => {
    const ctx = {
      request: {
        body: {
          client_id: 'someClientId',
          client_secret: 'someClientSecret',
          refresh_token: 'someRefreshToken',
          from: 'test@example.com',
          // Include all required fields to simulate a successful create
        },
      },
      throw: jest.fn(),
    };

    // Simulate an error in the create method that triggers a 500 error
    strapi.plugin("omcommerce").service("gmail").create.mockRejectedValueOnce("Internal Server Error");

    // @ts-ignore
    await gmailConfigController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters for a 500 error
    expect(ctx.throw).toHaveBeenCalledWith(500, "Internal Server Error");
  });

  it('should update a Gmail configuration', async function () {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          ...gmailConfigData,
          from: "new_info@example.com", // Assuming an updated 'from' for testing
        },
      },
      body: null,
    };

    // @ts-ignore
    await gmailConfigController({ strapi }).update(ctx);

    // Expect the body to contain the mock data for the updated Gmail configuration
    expect(ctx.body).toEqual({
      data: {
        ...gmailConfigData,
        from: "new_info@example.com",
      },
    });

    // Expect update to be called once
    expect(strapi.plugin('omcommerce').service('gmail').update).toBeCalledTimes(1);
  });

  it('should handle invalid data entries error when updating Gmail configuration', async () => {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          client_id: 'someClientId',
          // Omit one of the required fields to simulate an invalid data entry
        },
      },
      throw: jest.fn(),
    };

    // @ts-ignore
    await gmailConfigController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters for a 400 error
    expect(ctx.throw).toHaveBeenCalledWith(400, "Invalid data");
  });

  it('should handle error when updating Gmail configuration', async () => {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          client_id: 'someClientId',
          client_secret: 'someClientSecret',
          refresh_token: 'someRefreshToken',
          from: 'test@example.com',
          // Include all required fields to simulate a successful update
        },
      },
      throw: jest.fn(),
    };

    // Simulate an error in the update method that triggers a 500 error
    strapi.plugin("omcommerce").service("gmail").update.mockRejectedValueOnce("Internal Server Error");

    // @ts-ignore
    await gmailConfigController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters for a 500 error
    expect(ctx.throw).toHaveBeenCalledWith(500, "Internal Server Error");
  });


});
