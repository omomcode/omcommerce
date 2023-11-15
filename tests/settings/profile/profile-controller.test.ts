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

  it('should update a profile', async function () {
    const ctx = {
      params: { id: 1 }, // Assuming the ID for the profile is 1
      request: {
        body: {
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
});
