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
    expect(strapi.plugin('omcommerce').service('gmailConfig').find).toBeCalledTimes(1);
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
    expect(strapi.plugin('omcommerce').service('gmailConfig').create).toBeCalledTimes(1);
  });

  it('should update a Gmail configuration', async function () {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
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
    expect(strapi.plugin('omcommerce').service('gmailConfig').update).toBeCalledTimes(1);
  });
});
