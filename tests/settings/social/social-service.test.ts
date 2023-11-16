import socialService from "../../../server/services/social";
import shippingPackageService from "../../../server/services/shippingpackage";
import setupService from "../../../server/services/setup";

describe('Social Service', () => {
  let strapi: { entityService: any; };

  beforeEach(async function () {
    strapi = {
      entityService: {
        findOne: jest.fn().mockImplementation((model: string, query: any) => {
          // Mock the behavior of findOne method
          // Return data based on your test scenario
          return {
            id: 1,
            instagram_enabled: true,
            facebook_enabled: false,
            pinterest_enabled: true,
            x_enabled: false,
            tiktok_enabled: true,
            instagram: 'example_instagram',
            facebook: 'example_facebook',
            pinterest: 'example_pinterest',
            x: 'example_x',
            tiktok: 'example_tiktok',
          };
        }),
        update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
          // Mock the behavior of the update method
          // Return updated data based on your test scenario
          return {
            id: 1,
            instagram_enabled: data.instagram_enabled !== undefined ? data.instagram_enabled : true,
            facebook_enabled: data.facebook_enabled !== undefined ? data.facebook_enabled : false,
            pinterest_enabled: data.pinterest_enabled !== undefined ? data.pinterest_enabled : true,
            x_enabled: data.x_enabled !== undefined ? data.x_enabled : false,
            tiktok_enabled: data.tiktok_enabled !== undefined ? data.tiktok_enabled : true,
            instagram: data.instagram !== undefined ? data.instagram : 'updated_instagram',
            facebook: data.facebook !== undefined ? data.facebook : 'updated_facebook',
            pinterest: data.pinterest !== undefined ? data.pinterest : 'updated_pinterest',
            x: data.x !== undefined ? data.x : 'updated_x',
            tiktok: data.tiktok !== undefined ? data.tiktok : 'updated_tiktok',
          };
        }),
        create: jest.fn().mockImplementation((model: string, data: any) => {
          // Mock the behavior of the create method
          // Return created data based on your test scenario
          return {
            id: 2,
            ...data,
          };
        }),
      },
    };
  });

  it('should create a social record', async function () {
    // Arrange
    const socialData = {
      instagram_enabled: true,
      facebook_enabled: false,
      pinterest_enabled: true,
      x_enabled: false,
      tiktok_enabled: true,
      instagram: 'example_instagram',
      facebook: 'example_facebook',
      pinterest: 'example_pinterest',
      x: 'example_x',
      tiktok: 'example_tiktok',
    };

    // @ts-ignore
    const createdSocial = await socialService({ strapi }).create(socialData);

    // Assert
    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(createdSocial).not.toBeNull();
    expect(createdSocial.id).toBe(2); // Adjust the expected ID based on your test scenario
    // Add similar expectations for other properties
  });



  it('should throw an error when strapi.entityService is not defined (create)', async function () {
    // Arrange
    const socialData = {
      instagram_enabled: true,
      facebook_enabled: true,
      pinterest_enabled: false,
      x_enabled: true,
      tiktok_enabled: false,
      instagram: 'instagram_account',
      facebook: 'facebook_account',
      pinterest: 'pinterest_account',
      x: 'x_account',
      tiktok: 'tiktok_account',
    };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await socialService({ strapi }).create(socialData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });



  it('should find a social record', async function () {
    const socialId = 1;

    // @ts-ignore
    const foundSocial = await socialService({ strapi }).find(socialId);

    expect(strapi.entityService.findOne).toBeCalledTimes(1);
    expect(foundSocial).not.toBeNull();
    expect(foundSocial!.id).toBe(1);
    // Add similar expectations for other properties
  });

  it('should throw an error when strapi.entityService is not defined (find)', async function () {
    // Arrange
    const query = { /* your query here */ };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await socialService({ strapi }).find(query);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });


  it('should update a social record', async function () {
    const socialId = 1;
    const updateData = {
      instagram_enabled: false,
      facebook_enabled: true,
      pinterest_enabled: false,
      x_enabled: true,
      tiktok_enabled: false,
      instagram: 'updated_instagram',
      facebook: 'updated_facebook',
      pinterest: 'updated_pinterest',
      x: 'updated_x',
      tiktok: 'updated_tiktok',
    };

    // @ts-ignore
    const updatedSocial = await socialService({ strapi }).update(socialId, updateData);

    expect(strapi.entityService.update).toBeCalledTimes(1);
    expect(updatedSocial).not.toBeNull();
    expect(updatedSocial!.id).toBe(1);
    expect(updatedSocial!.instagram_enabled).toBe(false);
    expect(updatedSocial!.facebook_enabled).toBe(true);
    // Add similar expectations for other properties
  });

  it('should throw an error when strapi.entityService is not defined (update)', async function () {
    // Arrange
    const id = 1; // Replace with a valid ID for your update operation
    const data = { /* your update data here */ };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await socialService({ strapi }).update(id, data);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

});
