import gmailService from "../../../server/services/gmail";
import shippingPackageService from "../../../server/services/shippingpackage";
import currencyService from "../../../server/services/currency";

describe('Gmail Service', () => {
  let strapi: { entityService: any; };

  beforeEach(async function () {
    strapi = {
      entityService: {
        findOne: jest.fn().mockImplementation((model: string, query: any) => {
          // Mock the behavior of findOne method
          // Return data based on your test scenario
          return {
            id: 1,
            client_id: "CLIENTID",
            client_secret: "CLIENTSECRET",
            refresh_token: "SECRETREFRESHCODE",
            from: "info@example.com",
          };
        }),
        create: jest.fn().mockImplementation((model: string, data: any) => {
          // Mock the behavior of create method
          // Return data based on your test scenario
          return {
            id: 2,
            ...data,
          };
        }),
        update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
          // Mock the behavior of update method
          // Return data based on your test scenario
          return {
            id: 1,
            client_id: "UPDATEDCLIENTID",
            client_secret: "CLIENTSECRET",
            refresh_token: "SECRETREFRESHCODE",
            from: "info@example.com",
          };
        }),
      },
    };
  });

  it('should create a Gmail record', async function () {
    const initialData = {
      client_id: "CLIENTID",
      client_secret: "CLIENTSECRET",
      refresh_token: "SECRETREFRESHCODE",
      from: "info@example.com",
    };

    // @ts-ignore
    const createdGmail: any = await gmailService({ strapi }).create(initialData);
    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(createdGmail.id).toBe(2);
    // Add similar expectations for other properties
  });

  it('should handle null result from create', async () => {
    // Arrange
    const initialData = {
      client_id: "CLIENTID",
      client_secret: "CLIENTSECRET",
      refresh_token: "SECRETREFRESHCODE",
      from: "info@example.com",
    };

    // Mock the entityService.create method to return null
    strapi.entityService.create.mockResolvedValueOnce(null);

    // Act & Assert
    // @ts-ignore
    await expect(gmailService({ strapi }).create(initialData)).rejects.toThrowError('Invalid database data');
  });

  it('should throw an error for invalid data when creating billing information', async function () {

    const initialData = {
      client_id: "CLIENTID",
      client_secret: "CLIENTSECRET",
      refresh_token: "SECRETREFRESHCODE",
      // from: "info@example.com",
    };
    // @ts-ignore
    await expect(gmailService({ strapi }).create(initialData)).rejects.toThrowError("Invalid data");
  });


  it('gmail: create. Should throw an error when strapi.entityService is not defined', async function () {
    // Arrange
    const initialData = {
      client_id: "CLIENTID",
      client_secret: "CLIENTSECRET",
      refresh_token: "SECRETREFRESHCODE",
      from: "info@example.com",
    };
    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await gmailService({ strapi } ).create(initialData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should find a Gmail record', async function () {
    const query = { /* your query parameters */ };

    // @ts-ignore
    const foundGmail = await gmailService({ strapi }).find(query);

    expect(strapi.entityService.findOne).toBeCalledTimes(1);

    // Check if foundGmail is not null before accessing properties
    if (foundGmail) {
      // Add more specific expectations based on your test scenario
      expect(foundGmail.id).toBe(1);
      expect(foundGmail.client_id).toBe("CLIENTID");
      // Add similar expectations for other properties
    } else {
      // Handle the case where foundGmail is null if needed
      fail('Gmail record not found'); // This will cause the test to fail
    }
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
      await gmailService({ strapi }).find(query);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });


  it('should update a Gmail record', async function () {
    const gmailId = 1;
    const updateData = {
      id: 1,
      client_id: "UPDATEDCLIENTID", // Updated client_id for testing
      client_secret: "UPDATEDCLIENTSECRET", // Updated client_secret for testing
      refresh_token: "UPDATEDSECRETREFRESHCODE", // Updated refresh_token for testing
      from: "updated_info@example.com", // Updated from for testing
    };

    // @ts-ignore
    const updatedGmail : any = await gmailService({ strapi }).update(gmailId, updateData);

    expect(strapi.entityService.update).toBeCalledTimes(1);

    // Check if updatedGmail is not null before accessing properties
    if (updatedGmail) {
      // Add more specific expectations based on your test scenario
      expect(updatedGmail.id).toBe(1);
      expect(updatedGmail.client_id).toBe("UPDATEDCLIENTID");
      // Add similar expectations for other properties
    } else {
      // Handle the case where updatedGmail is null if needed
      fail('Gmail record not updated'); // This will cause the test to fail
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
      await gmailService({ strapi }).update(id, data);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should handle null result from update', async () => {
    // Arrange
    const gmailId = 1;
    const updateData = {
      id: 1,
      client_id: "UPDATEDCLIENTID", // Updated client_id for testing
      client_secret: "UPDATEDCLIENTSECRET", // Updated client_secret for testing
      refresh_token: "UPDATEDSECRETREFRESHCODE", // Updated refresh_token for testing
      from: "updated_info@example.com", // Updated from for testing
    };
    // Mock the entityService.update method to return null
    strapi.entityService.update.mockResolvedValueOnce(null);

    // Act & Assert
    // @ts-ignore
    await expect(gmailService({ strapi }).update(gmailId, updateData)).rejects.toThrowError('Invalid database data');
  });

  it('should throw an error for invalid data when updating gmail information', async () => {
    // Arrange
    const gmailId = 1;
    const updateData = {
      id: 1,
      client_id: "UPDATEDCLIENTID", // Updated client_id for testing
      client_secret: "UPDATEDCLIENTSECRET", // Updated client_secret for testing
      refresh_token: "UPDATEDSECRETREFRESHCODE", // Updated refresh_token for testing
      // from: "updated_info@example.com", // Updated from for testing
    };

    // Act & Assert
    // @ts-ignore
    await expect(gmailService({ strapi }).update(gmailId, updateData)).rejects.toThrowError('Invalid data');
  });

});
