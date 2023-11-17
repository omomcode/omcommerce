import taxService from '../../server/services/tax';
import { ITaxes } from '../../types/taxes';

describe('Tax Service', () => {
  let strapi: { entityService: any };
  let taxData: ITaxes;

  beforeEach(async function () {
    taxData = {
      id: 1,
      country_code: 'US',
      state_code: 'CA',
      rate: 8.0,
      name: 'Sales Tax',
      shipping: false,
    };

    strapi = {
      entityService: {
        findMany: jest.fn().mockReturnValue([taxData]),
        create: jest.fn().mockImplementation((model: string, data: any) => {
          return {
            id: 2, // Assuming the new tax has ID 2
            ...data,
          };
        }),
        update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
          return { data: { ...taxData, ...data } };
        }),
        delete: jest.fn().mockResolvedValue(true),
      },
    };
  });

  it('should create tax information', async function () {
    const newTaxData = {
      country_code: 'US',
      state_code: 'NY',
      rate: 9.0,
      name: 'New Sales Tax',
      shipping: false,
    };

    // @ts-ignore
    const createdTax: ITaxes = await taxService({ strapi }).create(newTaxData);

    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(createdTax).not.toBeNull();
    expect(createdTax.id).toBe(2);
    expect(createdTax.country_code).toBe(newTaxData.country_code);
    // Add similar expectations for other properties of the created tax
  });

  it('should throw an error when strapi.entityService is not defined (create)', async function () {
    const newTaxData = {
      country_code: 'US',
      state_code: 'NY',
      rate: 9.0,
      name: 'New Sales Tax',
      shipping: false,
    };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await taxService({ strapi }).create(newTaxData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });



  it('should find all tax information', async function () {
    // @ts-ignore
    const foundTaxes: ITaxes[] = await taxService({ strapi }).find();

    expect(strapi.entityService.findMany).toBeCalledTimes(1);
    expect(foundTaxes).toEqual([taxData]);
  });

  it('should throw an error when strapi.entityService is not defined (find)', async function () {
    // Arrange
    const query = { /* your query here */ };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await taxService({ strapi }).find(query);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should update tax information', async function () {
    const updateData = {
      country_code: 'US',
      state_code: 'CA',
      rate: 8.5,
      name: 'Updated Sales Tax',
      shipping: true,
    };

    // @ts-ignore
    const { data: updatedTax }: { data: ITaxes } = await taxService({ strapi }).update(1, updateData);

    expect(strapi.entityService.update).toBeCalledTimes(1);
    expect(updatedTax).toEqual({ ...taxData, ...updateData });
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
      await taxService({ strapi }).update(id, data);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should delete tax information', async () => {
    const taxIdToDelete = 1;

    // @ts-ignore
    const isDeleted: boolean = await taxService({ strapi }).delete(taxIdToDelete);

    // Expect delete to be called once
    expect(strapi.entityService.delete).toBeCalledTimes(1);

    // Expect the result to be true indicating successful deletion
    expect(isDeleted).toBe(true);
  });

  it('should throw an error when strapi.entityService is not defined (delete)', async () => {
    const taxIdToDelete = 1;

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await taxService({ strapi }).delete(taxIdToDelete);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

});
