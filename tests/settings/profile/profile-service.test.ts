import profileService from "../../../server/services/profile";
import shippingPackageService from "../../../server/services/shippingpackage";
import gmailService from "../../../server/services/gmail";

describe('Profile Service', () => {
  let strapi: { entityService: any; };

  beforeEach(async function () {
    strapi = {
      entityService: {
        findOne: jest.fn().mockImplementation((model: string, query: any) => {
          // Mock the behavior of findOne method
          // Return data based on your test scenario
          return {
            id: 1,
            name: 'Your amazing store',
            phone: '+11641112233',
            email: 'office@amazingstore.com',
            region: 'GB',
          };
        }),
        create: jest.fn().mockImplementation((model: string, data: any) => {
          // Mock the behavior of create method
          // Return data based on your test scenario
          return {
            id: 1,
            name: data.name,
            phone: data.phone,
            email: data.email,
            region: data.region,
          };
        }),
        update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
          // Mock the behavior of update method
          // Return data based on your test scenario
          return {
            id: 1,
            name: 'Updated Store',
            phone: '+11641112233',
            email: 'updated-email@example.com',
            region: 'US',
          };
        }),
      },
    };
  });

  it('should create a profile', async function () {
    const profileData = {
      name: 'Your amazing store',
      phone: '+11641112233',
      email: 'office@amazingstore.com',
      region: 'GB',
    };

    // @ts-ignore
    const profile = await profileService({ strapi }).create(profileData);
    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(profile.id).toBe(1);
    expect(profile.name).toBe('Your amazing store');
  });

  it('should handle null result from create', async () => {
    // Arrange
    const profileData = {
      name: 'Your amazing store',
      phone: '+11641112233',
      email: 'office@amazingstore.com',
      region: 'GB',
    };

    // Mock the entityService.create method to return null
    strapi.entityService.create.mockResolvedValueOnce(null);

    // Act & Assert
    // @ts-ignore
    await expect(profileService({ strapi }).create(profileData)).rejects.toThrowError('Invalid database data');
  });

  it('should throw an error for invalid data when creating billing information', async function () {

    const profileData = {
      name: 'Your amazing store',
      phone: '+11641112233',
      email: 'office@amazingstore.com',
      // region: 'GB',
    };
    // @ts-ignore
    await expect(profileService({ strapi }).create(profileData)).rejects.toThrowError("Invalid data");
  });



  it('profile: create. Should throw an error when strapi.entityService is not defined', async function () {
    // Arrange
    const profileData = {
      name: 'Your amazing store',
      phone: '+11641112233',
      email: 'office@amazingstore.com',
      region: 'GB',
    };
    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await profileService({ strapi } ).create(profileData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should find a profile', async function () {
    const query = { /* your query parameters */ };

    // @ts-ignore
    const foundProfile = await profileService({ strapi }).find(query);

    expect(strapi.entityService.findOne).toBeCalledTimes(1);
    // Add more specific expectations based on your test scenario
    expect(foundProfile?.id).toBe(1);
    expect(foundProfile?.name).toBe('Your amazing store');
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
      await profileService({ strapi }).find(query);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });


  it('should update a profile', async function () {
    const profileId = 1;
    const updateData = {
      id: 1,
      name: 'Updated Store',
      phone: '+11641112233',
      email: 'updated-email@example.com',
      region: 'US',
    };

    // @ts-ignore
    const updatedProfile = await profileService({ strapi }).update(profileId, updateData);

    expect(strapi.entityService.update).toBeCalledTimes(1);
    // Add more specific expectations based on your test scenario
    expect(updatedProfile.id).toBe(1);
    expect(updatedProfile.name).toBe('Updated Store');
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
      await profileService({ strapi }).update(id, data);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should handle null result from update', async () => {
    // Arrange
    const profileId = 1;
    const updateData = {
      id: 1,
      name: 'Updated Store',
      phone: '+11641112233',
      email: 'updated-email@example.com',
      region: 'US',
    };
    // Mock the entityService.update method to return null
    strapi.entityService.update.mockResolvedValueOnce(null);

    // Act & Assert
    // @ts-ignore
    await expect(profileService({ strapi }).update(profileId, updateData)).rejects.toThrowError('Invalid database data');
  });

  it('should throw an error for invalid data when updating cunversionrate information', async () => {
    // Arrange
    const profileId = 1;
    const updateData = {
      id: 1,
      name: 'Updated Store',
      phone: '+11641112233',
      email: 'updated-email@example.com',
      // region: 'US',
    };

    // Act & Assert
    // @ts-ignore
    await expect(profileService({ strapi }).update(profileId, updateData)).rejects.toThrowError('Invalid data');
  });

});
