import profileService from "../../../server/services/profile";

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

  it('should find a profile', async function () {
    const query = { /* your query parameters */ };

    // @ts-ignore
    const foundProfile = await profileService({ strapi }).find(query);

    expect(strapi.entityService.findOne).toBeCalledTimes(1);
    // Add more specific expectations based on your test scenario
    expect(foundProfile.id).toBe(1);
    expect(foundProfile.name).toBe('Your amazing store');
    // Add similar expectations for other properties
  });

  it('should update a profile', async function () {
    const profileId = 1;
    const updateData = { /* your update data */ };

    // @ts-ignore
    const updatedProfile = await profileService({ strapi }).update(profileId, updateData);

    expect(strapi.entityService.update).toBeCalledTimes(1);
    // Add more specific expectations based on your test scenario
    expect(updatedProfile.id).toBe(1);
    expect(updatedProfile.name).toBe('Updated Store');
    // Add similar expectations for other properties
  });
});
