import zoneService from "../../../server/services/timezone";
import setupService from "../../../server/services/setup";
import gmailService from "../../../server/services/gmail";

describe('Zone Service', () => {
  let strapi: { entityService: any; };

  beforeEach(async function () {
    strapi = {
      entityService: {
        findOne: jest.fn().mockImplementation((model: string, query: any) => {
          // Mock the behavior of findOne method
          // Return data based on your test scenario
          return {
            id: 1,
            timezone: "Central Europe Standard Time",
            measurement: "Metric",
            unit: "g",
            lengthUnit: "cm",
          };
        }),
        create: jest.fn().mockImplementation((model: string, data: any) => {
          // Mock the behavior of create method
          // Return data based on your test scenario
          return {
            id: 1,
            timezone: "Central Europe Standard Time",
            measurement: "Metric",
            unit: "g",
            lengthUnit: "cm",
          };
        }),
        update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
          // Mock the behavior of update method
          // Return data based on your test scenario
          return {
            id: 1,
            timezone: "Eastern Standard Time", // Updated timezone for testing
            measurement: "Imperial", // Updated measurement for testing
            unit: "lbs", // Updated unit for testing
            lengthUnit: "in", // Updated length unit for testing
          };
        }),
      },
    };
  });

  it('should create a zone record', async function () {
    const initialData = {
      timezone: "Central Europe Standard Time",
      measurement: "Metric",
      unit: "g",
      lengthUnit: "cm",
    };

    // @ts-ignore
    const createdZone = await zoneService({ strapi }).create(initialData);
    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(createdZone?.timezone).toBe("Central Europe Standard Time");
    // Add similar expectations for other properties
  });

  it('should handle null result from create', async () => {
    // Arrange
    const initialData = {
      timezone: "Central Europe Standard Time",
      measurement: "Metric",
      unit: "g",
      lengthUnit: "cm",
    };

    // Mock the entityService.create method to return null
    strapi.entityService.create.mockResolvedValueOnce(null);

    // Act & Assert
    // @ts-ignore
    await expect(zoneService({ strapi }).create(initialData)).rejects.toThrowError('Invalid database data');
  });

  it('should throw an error for invalid data when creating timezone information', async function () {

    const initialData = {
      timezone: "Central Europe Standard Time",
      measurement: "Metric",
      unit: "g",
      // lengthUnit: "cm",
    };
    // @ts-ignore
    await expect(zoneService({ strapi }).create(initialData)).rejects.toThrowError("Invalid data");
  });



  it('timezone: create. Should throw an error when strapi.entityService is not defined', async function () {
    // Arrange
    const initialData = {
      timezone: "Central Europe Standard Time",
      measurement: "Metric",
      unit: "g",
      lengthUnit: "cm",
    };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await zoneService({ strapi } ).create(initialData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should find a zone record', async function () {
    const query = { /* your query parameters */ };

    // @ts-ignore
    const foundZone = await zoneService({ strapi }).find(query);

    expect(strapi.entityService.findOne).toBeCalledTimes(1);

    // Check if foundZone is not null before accessing properties
    if (foundZone) {
      // Add more specific expectations based on your test scenario
      expect(foundZone.id).toBe(1);
      expect(foundZone.timezone).toBe("Central Europe Standard Time");
      // Add similar expectations for other properties
    } else {
      // Handle the case where foundZone is null if needed
      fail('Zone record not found'); // This will cause the test to fail
    }
  });

  it('should throw an error when strapi.entityService is not defined (find)', async function () {
    // Arrange
    const query = { /* your query here */ };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await zoneService({ strapi }).find(query);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should update a zone record', async function () {
    const zoneId = 1;
    const updateData = {
      timezone: "Eastern Standard Time",
      measurement: "Imperial",
      unit: "lbs",
      lengthUnit: "in",
    };

    // @ts-ignore
    const updatedZone = await zoneService({ strapi }).update(zoneId, updateData);

    expect(strapi.entityService.update).toBeCalledTimes(1);

    // Check if updatedZone is not null before accessing properties
    if (updatedZone) {
      // Add more specific expectations based on your test scenario
      expect(updatedZone.id).toBe(1);
      expect(updatedZone.timezone).toBe("Eastern Standard Time");
      // Add similar expectations for other properties
    } else {
      // Handle the case where updatedZone is null if needed
      fail('Zone record not updated'); // This will cause the test to fail
    }
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
      await zoneService({ strapi }).update(id, data);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should handle null result from update', async () => {
    // Arrange
    const zoneId = 1;
    const updateData = {
      timezone: "Central Europe Standard Time",
      measurement: "Metric",
      unit: "g",
      lengthUnit: "cm",
    };
    // Mock the entityService.update method to return null
    strapi.entityService.update.mockResolvedValueOnce(null);

    // Act & Assert
    // @ts-ignore
    await expect(zoneService({ strapi }).update(zoneId, updateData)).rejects.toThrowError('Invalid database data');
  });

  it('should throw an error for invalid data when updating zone information', async () => {
    // Arrange
    const zoneId = 1;
    const updateData = {
      timezone: "Central Europe Standard Time",
      measurement: "Metric",
      unit: "g",
      // lengthUnit: "cm",
    };

    // Act & Assert
    // @ts-ignore
    await expect(zoneService({ strapi }).update(zoneId, updateData)).rejects.toThrowError('Invalid data');
  });

});
