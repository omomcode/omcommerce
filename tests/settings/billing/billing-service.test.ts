import billingService from "../../../server/services/billing";
import shippingPackageService from "../../../server/services/shippingpackage";

describe('Billing Service', () => {
  let strapi: { entityService: any; };

  beforeEach(async function () {
    strapi = {
      entityService: {
        findOne: jest.fn().mockImplementation((model: string, query: any) => {
          // Mock the behavior of findOne method
          // Return data based on your test scenario
          return {
            id: 1,
            name: 'Billing Company',
            country: 'US',
            address: '123 Main St',
            apartment: 'Apt 456',
            postal: '12345',
            city: 'Cityville',
          };
        }),
        create: jest.fn().mockImplementation((model: string, data: any) => {
          // Mock the behavior of create method
          // Return data based on your test scenario
          return {
            id: 1,
            name: data.name,
            country: data.country,
            address: data.address,
            apartment: data.apartment,
            postal: data.postal,
            city: data.city,
          };
        }),
        update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
          // Mock the behavior of update method
          // Return data based on your test scenario
          return {
            id: 1,
            name: 'Updated Billing Company',
            country: 'CA',
            address: '456 Oak St',
            apartment: 'Unit 789',
            postal: '54321',
            city: 'Townsville',
          };
        }),
      },
    };
  });

  it('should create a billing record', async function () {
    const billingData = {
      name: 'Billing Company',
      country: 'US',
      address: '123 Main St',
      apartment: 'Apt 456',
      postal: '12345',
      city: 'Cityville',
    };

    // @ts-ignore
    const billingRecord : any = await billingService({ strapi }).create(billingData);
    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(billingRecord.id).toBe(1);
    expect(billingRecord.name).toBe('Billing Company');
    // Add similar expectations for other properties
  });


  it('billing: create. Should throw an error when strapi.entityService is not defined', async function () {
    // Arrange
  const billingData = {
    name: 'Billing Company',
    country: 'US',
    address: '123 Main St',
    apartment: 'Apt 456',
    postal: '12345',
    city: 'Cityville',
  };
    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await billingService({ strapi } ).create(billingData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });


  it('should find a billing record', async function () {
    const query = { /* your query parameters */ };

    // @ts-ignore
    const foundBillingRecord = await billingService({ strapi }).find(query);

    expect(strapi.entityService.findOne).toBeCalledTimes(1);

    // Check if foundBillingRecord is not null before accessing properties
    if (foundBillingRecord) {
      // Add more specific expectations based on your test scenario
      expect(foundBillingRecord.id).toBe(1);
      expect(foundBillingRecord.name).toBe('Billing Company');
      // Add similar expectations for other properties
    } else {
      // Handle the case where foundBillingRecord is null if needed
      fail('Billing record not found'); // This will cause the test to fail
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
      await billingService({ strapi }).find(query);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });



  it('should update a billing record', async function () {
    const billingRecordId = 1;
    const updateData =  { name: 'Billing Company',
      country: 'US',
      address: '123 Main St',
      apartment: 'Apt 456',
      postal: '12345',
      city: 'Cityville' };

    // @ts-ignore
    const updatedBillingRecord: any = await billingService({ strapi }).update(billingRecordId, updateData);

    expect(strapi.entityService.update).toBeCalledTimes(1);

    // Check if updatedBillingRecord is not null before accessing properties
    if (updatedBillingRecord) {
      // Add more specific expectations based on your test scenario
      expect(updatedBillingRecord.id).toBe(1);
      expect(updatedBillingRecord.name).toBe('Updated Billing Company');
      // Add similar expectations for other properties
    } else {
      // Handle the case where updatedBillingRecord is null if needed
      fail('Billing record not updated'); // This will cause the test to fail
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
      await billingService({ strapi }).update(id, data);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

});
