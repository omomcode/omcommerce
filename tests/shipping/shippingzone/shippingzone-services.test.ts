import shippingzoneService from "../../../server/services/shippingzone";
import {IShippingZone} from "../../../types/zonetable";
import {ICountry} from "../../../types/country";
import {IProfile} from "../../../types/profile";
import {string} from "prop-types";

describe('Shipping Zone Service', () => {
  let strapi: { entityService: any; };

  beforeEach(async function () {
    strapi = {
      entityService: {
        // Mocking findOne, update, and other methods as needed
        // ...
        findMany: jest.fn().mockImplementation((model: string, query: any) => {
          // Mock the behavior of the findMany method
          // Return an array of results based on your test scenario
          return [
            {
              id: 1,
              name: 'Domestic Zone',
              countries: [{ code: 'GB', name: 'United Kingdom' }],
              // Add other properties as needed
            },
            {
              id: 2,
              name: 'International Zone',
              countries: [{ code: 'US', name: 'United States' }],
              // Add other properties as needed
            },
          ];
        }),
        // Mock the create method
        create: jest.fn().mockImplementation((model: string, data: any) => {
          // Mock the behavior of the create method
          // Return created data based on your test scenario
          return {
            id: 1,
            ...data,
          };
        }),
        // Mock the update method
        update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
          // Mock the behavior of the update method
          // Return updated data based on your test scenario
          if (id === 1) {
            return {
              id: 1,
              name: data.name || 'Updated Domestic Zone',
              countries: data.countries || [{ code: 'GB', name: 'United Kingdom' }],
              // Add other properties as needed
            };
          } else if (id === 2) {
            return {
              id: 2,
              name: data.name || 'International Zone',
              countries: data.countries || [{ code: 'US', name: 'United States' }],
              // Add other properties as needed
            };
          } else {
            return null;
          }
        }),

        // Mock the delete method
        delete: jest.fn().mockImplementation((model: string, query: any) => {
          // Mock the behavior of the delete method
          // Return a success/failure status based on your test scenario
          const zoneId = query?.id;
          if (zoneId === 1 || zoneId === 2) {
            return { success: true };
          } else {
            return { success: false };
          }
        }),
      },
    };
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error to its original implementation
    // @ts-ignore
    console.error.mockRestore();
  });

  it('should find all shipping zones', async function () {
    // Arrange
    const profileData = {
      name: 'Your amazing store',
      phone: '+11641112233',
      email: 'office@amazingstore.com',
      region: 'GB',
    };

    const countriesData: { code: string; name: string }[] = [
      { code: 'GB', name: 'United Kingdom' },
      // Add other country data as needed
    ];

    const DomesticZone: { name: string; countries: { code: string; name: string }[] } = {
      name: 'Domestic Zone',
      countries: [],
      // Add other properties as needed
    };

    const InternationalZone: { name: string; countries: { code: string; name: string }[] } = {
      name: 'International Zone',
      countries: [],
      // Add other properties as needed
    };

    // Act
    const country: { code: string; name: string } | undefined = countriesData.find((country) => country.code === profileData.region);
    if (country !== undefined) {
      DomesticZone.countries.push(country);
    }
    // @ts-ignore
    const domesticZone = await shippingzoneService({ strapi }).create(DomesticZone);

    InternationalZone.countries = countriesData.filter(country => country.code !== profileData.region);
    // @ts-ignore
    const internationalZone = await shippingzoneService({ strapi }).create(InternationalZone);

    // @ts-ignore
    const foundZones = await shippingzoneService({ strapi }).find({});

    // Assert
    expect(foundZones).not.toBeNull();
    expect(foundZones?.length).toBe(2);

    // @ts-ignore
    const domesticFound = foundZones.find((zone: { name: string; }) => zone.name === 'Domestic Zone');
    // @ts-ignore
    const internationalFound = foundZones.find((zone: { name: string; }) => zone.name === 'International Zone');

    expect(domesticFound).not.toBeNull();
    expect(internationalFound).not.toBeNull();
    // Add similar expectations for other properties of the found zones
  });


  it('should handle find operation error and log to console.error', async function () {
    // Arrange
    const errorMsg = 'Error during find operation';
    strapi.entityService.findMany.mockImplementationOnce(() => {
      throw new Error(errorMsg);
    });

    // Act & Assert
    await expect(async () => {
      // @ts-ignore
      await shippingzoneService({ strapi }).find({});
    }).rejects.toThrowError(errorMsg);

    expect(console.error).toHaveBeenCalledWith('Error in find operation:', expect.any(Error));
  });


  it('should handle undefined strapi.entityService and throw an error (findMany)', async function () {
    // Arrange
    strapi.entityService = undefined;

    // Act & Assert
    await expect(async () => {
      // @ts-ignore
      await shippingzoneService({ strapi }).find({});
    }).rejects.toThrowError('strapi.entityService is not defined for find operation');

    expect(console.error).toHaveBeenCalledWith('Error in find operation:', expect.any(Error));
  });






  it('should create shipping zones', async function () {
    // Arrange
    const profileData: IProfile= {
      id: 1,
      name: 'Your amazing store',
      phone: '+11641112233',
      email: 'office@amazingstore.com',
      region: 'GB',
    };

    const countriesData: { code: string; name: string }[] = [
      { code: 'GB', name: 'United Kingdom' },
      // Add other country data as needed
    ];

    // Define shipping zone data
    const DomesticZone: IShippingZone= {
      id: 1,
      name: 'Domestic Zone',
      countries: [],
      shippingRatesData :[]
      // Add other properties as needed
    };

    const InternationalZone: IShippingZone = {
      id: 2,
      name: 'International Zone',
      countries: [],
      shippingRatesData :[]
      // Add other properties as needed
    };

    // Act
    const country: { code: string; name: string } | undefined = countriesData.find((country) => country.code === profileData.region);
    if (country !== undefined) {
      DomesticZone.countries.push(country);
    }
    // @ts-ignore
    const domesticZone = await shippingzoneService({ strapi }).create(DomesticZone);

    InternationalZone.countries = countriesData.filter(country => country.code !== profileData.region);
    // @ts-ignore
    const internationalZone = await shippingzoneService({ strapi }).create(InternationalZone);
    // Assert
    expect(strapi.entityService.create).toBeCalledTimes(2);
    expect(domesticZone).not.toBeNull();
    expect(domesticZone.id).toBe(1); // Adjust the expected ID based on your test scenario
    // Add similar expectations for other properties of the domesticZone

    expect(internationalZone).not.toBeNull();
    expect(internationalZone.id).toBe(2); // Adjust the expected ID based on your test scenario
    // Add similar expectations for other properties of the internationalZone
  });
  it('should update a shipping zone', async function () {
    // Arrange
    const zoneId = 1;
    const updateData = {
      name: 'Updated Domestic Zone',
      countries: [{ code: 'US', name: 'United States' }],
      // Add other properties as needed
    };

    // Act
    // @ts-ignore
    const updatedZone = await shippingzoneService({ strapi }).update(zoneId, updateData);

    // Assert
    expect(strapi.entityService.update).toBeCalledTimes(1);
    expect(updatedZone).not.toBeNull();
    expect(updatedZone!.id).toBe(1);
    expect(updatedZone!.name).toBe('Updated Domestic Zone');
    // Add similar expectations for other properties of the updatedZone
  });

  it('should handle undefined strapi.entityService and throw an error (update)', async function () {
    // Arrange
    const zoneId = 1; // Replace with a valid ID for your update operation
    const updateData = { /* your update data here */ };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await shippingzoneService({ strapi }).update(zoneId, updateData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });


  it('should handle undefined strapi.entityService and throw an error (delete)', async function () {
    // Arrange
    const zoneId = 1; // Replace with a valid ID for your delete operation

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await shippingzoneService({ strapi }).delete(zoneId);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });
  it('shipping zones: create. Should throw an error when strapi.entityService is not defined', async function () {
    // Arrange
    const newZoneData = {
      name: 'New Zone',
      countries: [
        { code: 'FR', name: 'France' },
        // Add other country data as needed
      ],
      // Add other zone data as needed
    };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await shippingzoneService({ strapi }).create(newZoneData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should delete a shipping zone', async function () {
    // Arrange
    const zoneId = {
      id: 1};

    // Act
    // @ts-ignore
    const deleteResult = await shippingzoneService({ strapi }).delete(zoneId);

    // Assert
    expect(strapi.entityService.delete).toBeCalledTimes(1);

    // Check if the deletion was successful
    if (deleteResult?.success !== true) {
      // Log additional information about the failure
      console.error('Deletion failed. Additional information:', deleteResult);
    }

    expect(deleteResult?.success).toBe(true);
  });
  // Add other tests for find, update, etc.
});
