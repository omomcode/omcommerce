import subcategoryService from '../../../server/services/subcategory';
import { ISubcategory } from '../../../types/subcategory';

describe('Subcategory Service', () => {
  let strapi: { entityService: any };
  let subcategoryData: ISubcategory;

  beforeEach(() => {
    subcategoryData = {
      title: 'Test Subcategory',
      category: 1,
      products: [1, 2], // Replace with actual product IDs
    };

    strapi = {
      entityService: {
        findMany: jest.fn().mockReturnValue([subcategoryData]),
        findOne: jest.fn().mockReturnValue(subcategoryData),
        create: jest.fn().mockImplementation((model: string, data: any) => {
          return { data: { ...subcategoryData, ...data } };
        }),
        update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
          return { data: { ...subcategoryData, ...data } };
        }),
        delete: jest.fn().mockResolvedValue(true),
      },
    };
  });

  it('should find subcategories', async () => {
    // @ts-ignore
    const foundSubcategories: any = await subcategoryService({ strapi }).find({});

    expect(strapi.entityService.findMany).toBeCalledTimes(1);
    expect(foundSubcategories).toEqual([subcategoryData]);
  });

  it('should throw an error when strapi.entityService is not defined (find)', async () => {
    // Act & Assert
    try {
      strapi.entityService = undefined;
      // @ts-ignore
      await subcategoryService({ strapi }).find({});
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should find one subcategory', async () => {
    const subcategoryId = 1; // Replace with the actual subcategory ID
    // @ts-ignore
    const foundSubcategory: any = await subcategoryService({ strapi }).findOne(subcategoryId);

    expect(strapi.entityService.findOne).toBeCalledTimes(1);
    expect(foundSubcategory).toEqual(subcategoryData);
  });

  it('should throw an error when strapi.entityService is not defined (findOne)', async () => {
    // Act & Assert
    try {
      strapi.entityService = undefined;
      const subcategoryId = 1; // Replace with the actual subcategory ID
      // @ts-ignore
      await subcategoryService({ strapi }).findOne(subcategoryId);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should create a subcategory', async () => {
    // @ts-ignore
    const createdSubcategory: any = await subcategoryService({ strapi }).create(subcategoryData);

    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(createdSubcategory.data).toEqual({ ...subcategoryData });
  });

  it('should throw an error when strapi.entityService is not defined (create)', async () => {
    // Arrange
    const initialData = {
      title: 'New Subcategory',
      category: 1,
    };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await subcategoryService({ strapi }).create(initialData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should update a subcategory', async () => {
    const subcategoryId = 1; // Replace with the actual subcategory ID
    const updateData = {
      title: 'Test Subcategory',
      category: 1,
      products: [1, 2]
    };

    // @ts-ignore
    const updatedSubcategory: any = await subcategoryService({ strapi }).update(subcategoryId, updateData);

    // Exclude the "id" field from the expectation
    // @ts-ignore
    const { id, ...expectedData } = { ...subcategoryData, ...updateData };

    expect(strapi.entityService.update).toBeCalledTimes(1);
    expect(updatedSubcategory.data).toEqual(expectedData);
  });

  it('should throw an error when strapi.entityService is not defined (update)', async () => {
    // Arrange
    const subcategoryId = 1; // Replace with the actual subcategory ID
    const updateData = {
      title: 'Updated Subcategory',
      category: 2,
    };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await subcategoryService({ strapi }).update(subcategoryId, updateData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should delete a subcategory', async () => {
    const subcategoryIdToDelete = 1; // Replace with the actual subcategory ID

    // @ts-ignore
    const isDeleted: boolean = await subcategoryService({ strapi }).delete(subcategoryIdToDelete);

    expect(strapi.entityService.delete).toBeCalledTimes(1);
    expect(isDeleted).toBe(true);
  });

  it('should throw an error when strapi.entityService is not defined (delete)', async () => {
    // Act & Assert
    try {
      strapi.entityService = undefined;
      const subcategoryIdToDelete = 1; // Replace with the actual subcategory ID
      // @ts-ignore
      await subcategoryService({ strapi }).delete(subcategoryIdToDelete);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });
});
