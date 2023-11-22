import paypalSetupService from "../../../server/services/paypalsetup";
import shippingPackageService from "../../../server/services/shippingpackage";
import ordersService from "../../../server/services/order";

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
            id: id,
            live_paypal_client_id: data.live_paypal_client_id,
            live_paypal_client_secret: data.live_paypal_client_secret,
            sandbox_paypal_client_id: data.sandbox_paypal_client_id,
            sandbox_paypal_client_secret: data.sandbox_paypal_client_secret,
            live: data.live,
          };
        }),
      },
    };
  });

  it('should create a PayPal Setup record', async function () {
    const initialData = {
      live_paypal_client_id: '532fd',
      live_paypal_client_secret: '325dsf',
      sandbox_paypal_client_id: '',
      sandbox_paypal_client_secret: '',
      live: true,
    };

    // @ts-ignore
    const createdPayPalSetup = await paypalSetupService({ strapi }).create(initialData);
    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(createdPayPalSetup.id).toBe(1);
    expect(createdPayPalSetup.live_paypal_client_id).toBe(initialData.live_paypal_client_id);
    expect(createdPayPalSetup.live_paypal_client_secret).toBe(initialData.live_paypal_client_secret);
    expect(createdPayPalSetup.sandbox_paypal_client_id).toBe(initialData.sandbox_paypal_client_id);
    expect(createdPayPalSetup.sandbox_paypal_client_secret).toBe(initialData.sandbox_paypal_client_secret);

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

  it('should handle null result from create', async () => {
    // Arrange
    const initialData = {
      live_paypal_client_id: '532fd',
      live_paypal_client_secret: '325dsf',
      sandbox_paypal_client_id: '',
      sandbox_paypal_client_secret: '',
      live: true,
    };

    // Mock the entityService.update method to return null
    strapi.entityService.create.mockResolvedValueOnce(null);

    // Act & Assert
    // @ts-ignore
    await expect(paypalSetupService({ strapi }).create(initialData)).rejects.toThrowError('Invalid database data');
  });

  it('should throw an error for invalid data when updating paypalsetup information', async () => {
    // Arrange
    const initialData = {
      live_paypal_client_id: '532fd',
      live_paypal_client_secret: '325dsf',
      sandbox_paypal_client_id: 'asdasdasdsa',
      live: false,
    };
    // Act & Assert
    // @ts-ignore
    await expect(paypalSetupService({ strapi }).create(initialData)).rejects.toThrowError('Invalid data');
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

  it('should handle null result from find', async () => {
    // Arrange

    // Mock the entityService.update method to return null
    strapi.entityService.findOne.mockResolvedValueOnce(null);


    // Act & Assert
    // @ts-ignore
    await expect(paypalSetupService({ strapi }).find()).rejects.toThrowError('Invalid Data');
  });



  it('should update a PayPal Setup record', async function () {
    const payPalSetupId = 1;
    const updateData = {
      live_paypal_client_id: '412fqas',
      live_paypal_client_secret: 'rwq42',
      sandbox_paypal_client_id: '412fqas',
      sandbox_paypal_client_secret: 'rwq42',
      live: true, };

    // @ts-ignore
    const updatedPayPalSetup = await paypalSetupService({ strapi }).update(payPalSetupId, updateData);

    expect(strapi.entityService.update).toBeCalledTimes(1);
    // Add more specific expectations based on your test scenario
    expect(updatedPayPalSetup!.id).toBe(1);
    expect(updatedPayPalSetup.live_paypal_client_id).toBe(updateData.live_paypal_client_id);
    expect(updatedPayPalSetup.live_paypal_client_secret).toBe(updateData.live_paypal_client_secret);
    expect(updatedPayPalSetup.sandbox_paypal_client_id).toBe(updateData.sandbox_paypal_client_id);
    expect(updatedPayPalSetup.sandbox_paypal_client_secret).toBe(updateData.sandbox_paypal_client_secret);
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

  it('should handle null result from update', async () => {
    // Arrange
    const id = 1; // Replace with a valid ID for your update operation
    const initialData = {
      live_paypal_client_id: '532fd',
      live_paypal_client_secret: '325dsf',
      sandbox_paypal_client_id: '123',
      sandbox_paypal_client_secret: '123',
      live: false,
    };

    // Mock the entityService.update method to return null
    strapi.entityService.update.mockResolvedValueOnce(null);

    // Act & Assert
    // @ts-ignore
    await expect(paypalSetupService({ strapi }).update(id,initialData)).rejects.toThrowError('Invalid database data');
  });

  it('should throw an error for invalid data when updating paypalsetup information', async () => {
    // Arrange
    const id = 1; // Replace with a valid ID for your update operation
    const initialData = {
      live_paypal_client_id: '532fd',
      live_paypal_client_secret: '325dsf',
      sandbox_paypal_client_secret: '123',
      live: false,
    };
    // Act & Assert
    // @ts-ignore
    await expect(paypalSetupService({ strapi }).update(id,initialData)).rejects.toThrowError('Invalid data');
  });

});
