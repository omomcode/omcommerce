import shippingRateService from "../../../server/services/shippingrate";
import { IShippingRate } from "../../../types/rate";
import shippingPackageService from "../../../server/services/shippingpackage";

describe('Shipping Rate Service', () => {
  let strapi: { entityService: any; };

  beforeEach(async function () {
    strapi = {
      entityService: {
        findMany: jest.fn().mockImplementation((model: string, query: any) => {
          // Mock the behavior of find method
          // Return an array of data based on your test scenario
          return [
            {
              id: 1,
              name: 'Standard',
              condition: 'Test Condition',
              price: 10.0,
            },
            {
              id: 2,
              name: 'Express',
              condition: 'Test Condition 2',
              price: 20.0,
            },
            // Add more rate objects as needed
          ];
        }),
        update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
          // Mock the behavior of the update method
          // Return updated data based on your test scenario
          const updatedRate = {
            id: id,
            name: data.name !== undefined ? data.name : 'Updated Rate',
            condition: data.condition !== undefined ? data.condition : 'Updated Condition',
            price: data.price !== undefined ? data.price : 15.0,
          };
          return updatedRate;
        }),
        create: jest.fn().mockImplementation((model: string, data: any) => {
          // Mock the behavior of create method
          // Return created data based on your test scenario
          return {
            id: 3,
            name: data.name,
            condition: data.condition,
            price: data.price,
          };
        }),
        delete: jest.fn().mockImplementation((model: string, id: any) => {
          // Mock the behavior of delete method
          // Return true if deletion is successful, otherwise, throw an error
          if (id === 3) {
            return true;
          } else {
            throw new Error('Failed to delete rate');
          }
        }),
      },
    };
  });

  it('should create a shipping rate', async function () {
    const newRateData = {
      name: 'New Rate',
      condition: 'New Condition',
      price: 25.0,
    };

    // @ts-ignore
    const createdRate: IShippingRate = await shippingRateService({ strapi }).create(newRateData);

    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(createdRate).not.toBeNull();
    expect(createdRate.id).toBe(3);
    expect(createdRate.name).toBe(newRateData.name);
    // Add similar expectations for other properties of the created rate
  });


  it('should handle null result from create', async () => {
    // Arrange
    const data =  {
      name: 'New Rate',
      condition: 'New Condition',
      price: 25.0,
    };

    // Mock the entityService.create method to return null
    strapi.entityService.create.mockResolvedValueOnce(null);

    // Act & Assert
    // @ts-ignore
    await expect(shippingRateService({ strapi }).create(data)).rejects.toThrowError('Invalid database data');
  });

  it('should throw an error for invalid data when creating shipping rate', async function () {
    // Arrange
    const data = {
      // name: 'New Rate',
      condition: 'New Condition',
      price: 25.0,
    };
    // Act & Assert
    // @ts-ignore
    await expect(shippingRateService({ strapi }).create(data)).rejects.toThrowError("Invalid data");
  });



  it('shipping rates: create. Should throw an error when strapi.entityService is not defined', async function () {
    // Arrange
    const newRateData = {
      name: 'New Rate',
      condition: 'New Condition',
      price: 25.0,
    };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await shippingRateService({ strapi }).create(newRateData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should find all shipping rates', async function () {
    // @ts-ignore
    const foundRates: IShippingRate[] = await shippingRateService({ strapi }).find();

    expect(strapi.entityService.findMany).toBeCalledTimes(1);
    expect(foundRates).not.toBeNull();
    expect(foundRates.length).toBe(2);
    expect(foundRates[0].id).toBe(1);
    expect(foundRates[1].id).toBe(2);
  });

  it('should throw an error when strapi.entityService is not defined (find)', async function () {
    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await shippingRateService({ strapi }).find();
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should update a shipping rate record', async function () {
    const rateId = 1;
    const updateData = {
      name: 'Updated Rate',
      condition: 'Updated Condition',
      price: 30.0,
    };

    // @ts-ignore
    const updatedRate = await shippingRateService({ strapi }).update(rateId, updateData);

    expect(strapi.entityService.update).toBeCalledTimes(1);
    expect(updatedRate).not.toBeNull();
    expect(updatedRate!.id).toBe(1);
    expect(updatedRate!.name).toBe('Updated Rate');
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
      await shippingRateService({ strapi }).update(id, data);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should throw Invalid database data error when input data is not supplied', async function () {
    // Arrange
    const id = 1; // Replace with a valid ID for your update operation
    const data = {
      // name: 'New Rate',
      condition: 'New Condition',
      price: 25.0,
    };

    // @ts-ignore
    await expect(shippingRateService({ strapi }).update(id, data)).rejects.toThrowError("Invalid data");

  });

  it('should handle null result from update', async () => {
    // Arrange
    const id = 1;
    const data = {
      name: 'New Rate',
      condition: 'New Condition',
      price: 25.0,
    };


    // Mock the entityService.update method to return null
    strapi.entityService.update.mockResolvedValueOnce(null);

    // Act & Assert
    // @ts-ignore
    await expect(shippingRateService({ strapi }).update(id, data)).rejects.toThrowError('Invalid database data');
  });



  it('should delete a shipping rate', async function () {
    const rateIdToDelete = 3;

    // @ts-ignore
    const isDeleted: boolean = await shippingRateService({ strapi }).delete(rateIdToDelete);

    expect(strapi.entityService.delete).toBeCalledTimes(1);
    expect(isDeleted).toBe(true);
  });

  it('should throw an error when strapi.entityService is not defined (delete)', async function () {
    // Arrange
    const id = 1; // Replace with a valid ID for your delete operation

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await shippingRateService({ strapi }).delete(id);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });
});
