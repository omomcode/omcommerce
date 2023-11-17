import socialController from "../../../server/controllers/social";
import { ISocialData } from "../../../types/social";

describe('Social Controller', () => {
  let strapi: { plugin: any; };
  let socialData: ISocialData;

  beforeEach(async function () {
    socialData = {
      id: 1,
      instagram_enabled: true,
      facebook_enabled: false,
      pinterest_enabled: false,
      x_enabled: true,
      tiktok_enabled: false,
      instagram: 'updated_instagram',
      facebook: 'updated_facebook',
      pinterest: 'updated_pinterest',
      x: 'updated_x',
      tiktok: 'updated_tiktok',
    };

    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue(socialData),
          create: jest.fn().mockReturnValue({
            data: { ...socialData, id: 2 },
          }),
          update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
            return { data: { ...socialData, ...data } };
          }),
        }),
      }),
    };
  });

  it('should find a social record', async function () {
    const ctx = {
      params: { id: 1 },
      body: null,
    };

    // @ts-ignore
    const result = await socialController({ strapi }).find(ctx);

    // Expect the body to contain the mock data
    expect(result).toEqual(socialData);

    // Expect find to be called once
    expect(strapi.plugin('omcommerce').service('social').find).toBeCalledTimes(1);
  });

  it('should throw an error when finding a social record', async function () {
    const ctx = {
      params: { id: 1 },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the find method
    strapi.plugin('omcommerce').service('social').find.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await socialController({ strapi }).find(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

  it('should create a social record', async function () {
    const ctx = {
      request: {
        body: socialData,
      },
      body: null,
    };

    // @ts-ignore
    const createdSocial = await socialController({ strapi }).create(ctx);

    // Expect the body to contain the mock data for the created social record
    expect(ctx.body).toEqual({
      data: { ...socialData, id: 2 },
    });

    // Expect create to be called once
    expect(strapi.plugin('omcommerce').service('social').create).toBeCalledTimes(1);
  });

  it('should throw an error when creating a social record', async function () {
    const ctx = {
      request: {
        body: socialData,
      },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the create method
    strapi.plugin('omcommerce').service('social').create.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await socialController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

  it('should update a social record', async function () {
    // Arrange
    const updateData = {
      id: 1,
      instagram_enabled: true,
      facebook_enabled: false,
      pinterest_enabled: false,
      x_enabled: true,
      tiktok_enabled: false,
      instagram: 'updated_instagram',
      facebook: 'updated_facebook',
      pinterest: 'updated_pinterest',
      x: 'updated_x',
      tiktok: 'updated_tiktok',
    };

    const ctx = {
      params: { id: 1 },
      request: { body: updateData },
      body: null,
    };

    // Act
    // @ts-ignore
    await socialController({ strapi }).update(ctx);

    // Assert
    // Expect the body to contain the mock data for the updated social record
    expect(ctx.body).toEqual({
      data: { ...socialData, ...updateData },
    });

    // Expect update to be called once
    expect(strapi.plugin('omcommerce').service('social').update).toBeCalledTimes(1);
  });

  it('should throw an error when updating a social record', async function () {
    // Arrange
    const updateData = {
      id: 1,
      instagram_enabled: true,
      facebook_enabled: false,
      pinterest_enabled: false,
      x_enabled: true,
      tiktok_enabled: false,
      instagram: 'updated_instagram',
      facebook: 'updated_facebook',
      pinterest: 'updated_pinterest',
      x: 'updated_x',
      tiktok: 'updated_tiktok',
    };

    const ctx = {
      params: { id: 1 },
      request: { body: updateData },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the update method
    strapi.plugin('omcommerce').service('social').update.mockRejectedValueOnce("Simulated error");

    // Act
    // @ts-ignore
    await socialController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

});
