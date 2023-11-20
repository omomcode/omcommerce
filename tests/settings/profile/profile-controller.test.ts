import profileController from "../../../server/controllers/profile";
import {IProfile} from "../../../types/profile";

describe('Profile Controller', () => {
  let strapi: { plugin: any; };
  let profileData: IProfile;

  beforeEach(async function () {
    profileData = {
      id: 1,
      name: 'Your amazing store',
      phone: '+11641112233',
      email: 'office@amazingstore.com',
      region: 'GB',
    };

    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            data: [profileData],
          }),
          create: jest.fn().mockReturnValue({
            data: profileData,
          }),
          update: jest.fn().mockReturnValue({
            data: {
              ...profileData,
              name: 'Updated Store',
            },
          }),
        }),
      }),
    };
  });

  it('should find profiles', async function () {
    const ctx = {
      query: {},
      body: null,
    };

    // @ts-ignore
    const result = await profileController({ strapi }).find(ctx);

    // Expect the body to contain the mock data
    expect(result.data).toEqual([profileData]);

    // Expect find to be called once
    expect(strapi.plugin('omcommerce').service('profile').find).toBeCalledTimes(1);
  });

  it('should handle error when finding profiles', async function () {
    const ctx = {
      query: {},
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the find method
    strapi.plugin("omcommerce").service("profile").find.mockRejectedValueOnce("Invalid data");

    // @ts-ignore
    await profileController({ strapi }).find(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Invalid data");
  });

  it('should create a profile', async function () {
    const ctx = {
      request: {
        body: profileData,
      },
      body: null,
    };

    // @ts-ignore
    await profileController({ strapi }).create(ctx);

    // Expect the body to contain the mock data for the created profile
    expect(ctx.body).toEqual({
      data: profileData,
    });

    // Expect create to be called once
    expect(strapi.plugin('omcommerce').service('profile').create).toBeCalledTimes(1);
  });

  it('should handle invalid data entries error when creating a profile', async () => {
    const ctx = {
      request: {
        body: {
          name: 'John Doe',
          // Omit one of the required fields to simulate an invalid data entry
        },
      },
      throw: jest.fn(),
    };

    // @ts-ignore
    await profileController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters for a 400 error
    expect(ctx.throw).toHaveBeenCalledWith(400, "Invalid data");
  });

  it('should handle error when creating a profile', async () => {
    const ctx = {
      request: {
        body: {
          name: 'John Doe',
          phone: '1234567890',
          email: 'john@example.com',
          region: 'Some Region',
          // Include all required fields to simulate a successful create
        },
      },
      throw: jest.fn(),
    };

    // Simulate an error in the create method that triggers a 500 error
    strapi.plugin("omcommerce").service("profile").create.mockRejectedValueOnce("Internal Server Error");

    // @ts-ignore
    await profileController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters for a 500 error
    expect(ctx.throw).toHaveBeenCalledWith(500, "Internal Server Error");
  });


  it('should update a profile', async function () {
    const ctx = {
      params: { id: 1 }, // Assuming the ID for the profile is 1
      request: {
        body: {
          ...profileData,
          name: 'Updated Store',
        },
      },
      body: null,
    };

    // @ts-ignore
    await profileController({ strapi }).update(ctx);

    // Expect the body to contain the mock data for the updated profile
    expect(ctx.body).toEqual({
      data: {
        ...profileData,
        name: 'Updated Store',
      },
    });

    // Expect update to be called once
    expect(strapi.plugin('omcommerce').service('profile').update).toBeCalledTimes(1);
  });

  it('should handle invalid data entries error when updating a profile', async () => {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          name: 'John Doe',
          // Omit one of the required fields to simulate an invalid data entry
        },
      },
      throw: jest.fn(),
    };

    // @ts-ignore
    await profileController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters for a 400 error
    expect(ctx.throw).toHaveBeenCalledWith(400, "Invalid data");
  });

  it('should handle error when updating a profile', async () => {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          name: 'John Doe',
          phone: '1234567890',
          email: 'john@example.com',
          region: 'Some Region',
          // Include all required fields to simulate a successful update
        },
      },
      throw: jest.fn(),
    };

    // Simulate an error in the update method that triggers a 500 error
    strapi.plugin("omcommerce").service("profile").update.mockRejectedValueOnce("Internal Server Error");

    // @ts-ignore
    await profileController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters for a 500 error
    expect(ctx.throw).toHaveBeenCalledWith(500, "Internal Server Error");
  });

});
