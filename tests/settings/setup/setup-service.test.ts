import setupService from "../../../server/services/setup";
import shippingPackageService from "../../../server/services/shippingpackage";
import gmailService from "../../../server/services/gmail";
import currencyService from "../../../server/services/currency";

describe('Setup Service', () => {
  let strapi: { entityService: any; };

  beforeEach(async function () {
    strapi = {
      entityService: {
        findOne: jest.fn().mockImplementation((model: string, query: any) => {
          // Mock the behavior of findOne method
          // Return data based on your test scenario
          return {
            id: 1,
            wizard_open: true,
            wizard_option: 0,
            product_type: 0,
            wizard_state: 1,
            initialized: true,
          };
        }),
        create: jest.fn().mockImplementation((model: string, data: any) => {
          // Mock the behavior of create method
          // Return data based on your test scenario
          return {
            id: 1,
            wizard_open: data.wizard_open,
            wizard_option: data.wizard_option,
            product_type: data.product_type,
            wizard_state: data.wizard_state,
            initialized: data.initialized,
          };
        }),
        update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
          // Mock the behavior of update method
          // Return data based on your test scenario
          return {
            id: 1,
            wizard_open: data.wizard_open !== undefined ? data.wizard_open : true,
            wizard_option: data.wizard_option !== undefined ? data.wizard_option : 0,
            product_type: data.product_type !== undefined ? data.product_type : 0,
            wizard_state: data.wizard_state !== undefined ? data.wizard_state : 1,
            initialized: data.initialized !== undefined ? data.initialized : true,
          };
        }),
      },
    };
  });

  it('should create a Setup record', async function () {
    const initialData = {
      wizard_open: true,
      wizard_option: 0,
      product_type: 0,
      wizard_state: 1,
      initialized: true,
    };

    // @ts-ignore
    const createdSetup = await setupService({ strapi }).create(initialData);
    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(createdSetup.id).toBe(1);
    expect(createdSetup.wizard_open).toBe(true);
    // Add similar expectations for other properties
  });

  it('setup: create. Should throw an error when strapi.entityService is not defined', async function () {
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
      await setupService({ strapi } ).create(initialData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should find a Setup record', async function () {
    const query = { /* your query parameters */ };

    // @ts-ignore
    const foundSetup = await setupService({ strapi }).find(query);

    expect(strapi.entityService.findOne).toBeCalledTimes(1);
    // Check for null explicitly before making assertions
    expect(foundSetup).not.toBeNull();
    // Make assertions assuming foundSetup is not null
    expect(foundSetup!.id).toBe(1);
    expect(foundSetup!.wizard_open).toBe(true);
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
      await setupService({ strapi }).find(query);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should update a Setup record', async function () {
    const setupId = 1;
    const updateData = {
      wizard_open: false, // Set the wizard_open property to false for the update
      wizard_option: 0,
      product_type: 0,
      wizard_state: 1,
      initialized: true,
    }

    // @ts-ignore
    const updatedSetup = await setupService({ strapi }).update(setupId, updateData);

    expect(strapi.entityService.update).toBeCalledTimes(1);
    // Check for null explicitly before making assertions
    expect(updatedSetup).not.toBeNull();
    // Make assertions assuming updatedSetup is not null
    expect(updatedSetup!.id).toBe(1);
    expect(updatedSetup!.wizard_open).toBe(false); // Updated for testing
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
      await setupService({ strapi }).update(id, data);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });


});
