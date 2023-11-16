import paypalSetupService from "../../../server/services/paypalsetup";
import shippingPackageService from "../../../server/services/shippingpackage";

describe('PayPal Setup Service', () => {
  let strapi: { entityService: any; };

  beforeEach(async function () {
    strapi = {
      entityService: {
        findOne: jest.fn().mockImplementation((model: string, query: any) => {
          // Mock the behavior of findOne method
          // Return data based on your test scenario
          return {
            id: 1,
            live_paypal_client_id: '',
            live_paypal_client_secret: '',
            sandbox_paypal_client_id: '',
            sandbox_paypal_client_secret: '',
            live: false,
          };
        }),
        create: jest.fn().mockImplementation((model: string, data: any) => {
          // Mock the behavior of create method
          // Return data based on your test scenario
          return {
            id: 1,
            live_paypal_client_id: data.live_paypal_client_id,
            live_paypal_client_secret: data.live_paypal_client_secret,
            sandbox_paypal_client_id: data.sandbox_paypal_client_id,
            sandbox_paypal_client_secret: data.sandbox_paypal_client_secret,
            live: data.live,
          };
        }),
        update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
          // Mock the behavior of update method
          // Return data based on your test scenario
          return {
            id: 1,
            live_paypal_client_id: 'UPDATED_CLIENT_ID', // Updated live_paypal_client_id for testing
            live_paypal_client_secret: 'UPDATED_CLIENT_SECRET', // Updated live_paypal_client_secret for testing
            sandbox_paypal_client_id: 'UPDATED_SANDBOX_CLIENT_ID', // Updated sandbox_paypal_client_id for testing
            sandbox_paypal_client_secret: 'UPDATED_SANDBOX_CLIENT_SECRET', // Updated sandbox_paypal_client_secret for testing
            live: true, // Updated live for testing
          };
        }),
      },
    };
  });

  it('should create a PayPal Setup record', async function () {
    const initialData = {
      live_paypal_client_id: '',
      live_paypal_client_secret: '',
      sandbox_paypal_client_id: '',
      sandbox_paypal_client_secret: '',
      live: false,
    };

    // @ts-ignore
    const createdPayPalSetup = await paypalSetupService({ strapi }).create(initialData);
    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(createdPayPalSetup.id).toBe(1);
    expect(createdPayPalSetup.live_paypal_client_id).toBe('');
    // Add similar expectations for other properties
  });

  it('paypalsetup: create. Should throw an error when strapi.entityService is not defined', async function () {
    // Arrange
    const initialData = {
      live_paypal_client_id: '',
      live_paypal_client_secret: '',
      sandbox_paypal_client_id: '',
      sandbox_paypal_client_secret: '',
      live: false,
    };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await paypalSetupService({ strapi } ).create(initialData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });


  it('should find a PayPal Setup record', async function () {
    const query = { /* your query parameters */ };

    // @ts-ignore
    const foundPayPalSetup = await paypalSetupService({ strapi }).find(query);

    expect(strapi.entityService.findOne).toBeCalledTimes(1);
    // Add more specific expectations based on your test scenario
    expect(foundPayPalSetup!.id).toBe(1);
    expect(foundPayPalSetup!.live_paypal_client_id).toBe('');
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
      await paypalSetupService({ strapi }).find(query);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should update a PayPal Setup record', async function () {
    const payPalSetupId = 1;
    const updateData = { /* your update data */ };

    // @ts-ignore
    const updatedPayPalSetup = await paypalSetupService({ strapi }).update(payPalSetupId, updateData);

    expect(strapi.entityService.update).toBeCalledTimes(1);
    // Add more specific expectations based on your test scenario
    expect(updatedPayPalSetup!.id).toBe(1);
    expect(updatedPayPalSetup!.live_paypal_client_id).toBe('UPDATED_CLIENT_ID');
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
      await paypalSetupService({ strapi }).update(id, data);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

});
