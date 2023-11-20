import categoryService from '../../../server/services/category';
import { ICategory } from '../../../types/category';

describe('Category Service', () => {
  let strapi: { entityService: any };
  let categoryData: ICategory;

  beforeEach(() => {
    categoryData = {
      title: 'Test Category',
      description: 'This is a test category',
      img: ['test-image-url'],
      products: [1, 2], // Replace with actual product IDs
      subcategories: [1, 2], // Replace with actual subcategory IDs
    };

    strapi = {
      entityService: {
        findMany: jest.fn().mockReturnValue([categoryData]),
        findOne: jest.fn().mockReturnValue(categoryData),
        create: jest.fn().mockImplementation((model: string, data: any) => {
          return { data: { ...categoryData, ...data } };
        }),
        update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
          return { data: { ...categoryData, ...data } };
        }),
        delete: jest.fn().mockResolvedValue(true),
      },
    };
  });

  it('should find categories', async () => {
    // @ts-ignore
    const foundCategories: any = await categoryService({ strapi }).find({});

    expect(strapi.entityService.findMany).toBeCalledTimes(1);
    expect(foundCategories).toEqual([categoryData]);
  });

  it('should throw an error when strapi.entityService is not defined (findMany)', async () => {
    strapi.entityService = undefined;
    // Act & Assert
    try {
      // @ts-ignore
      await categoryService({ strapi }).find({});
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should find a category by ID', async () => {
    const categoryId = 1; // Replace with the actual category ID

    // @ts-ignore
    const foundCategory: any = await categoryService({ strapi }).findOne(categoryId);

    expect(strapi.entityService.findOne).toBeCalledTimes(1);
    expect(foundCategory).toEqual(categoryData);
  });

  it('should throw an error when strapi.entityService is not defined (findOne)', async () => {
    strapi.entityService = undefined;
    const categoryId = 1; // Replace with the actual category ID
    // Act & Assert
    try {
      // @ts-ignore
      await categoryService({ strapi }).findOne(categoryId);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should create a category', async () => {
    // @ts-ignore
    const createdCategory: any = await categoryService({ strapi }).create(categoryData);

    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(createdCategory.data).toEqual({ ...categoryData });
  });

  it('should throw an error when strapi.entityService is not defined (create)', async () => {
    strapi.entityService = undefined;
    // Act & Assert
    try {
      // @ts-ignore
      await categoryService({ strapi }).create({});
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should update a category', async () => {
    const categoryId = 1; // Replace with the actual category ID
    const updateData = {
      description: 'Updated description',
    };

    // @ts-ignore
    const updatedCategory: any = await categoryService({ strapi }).update(categoryId, updateData);

    expect(strapi.entityService.update).toBeCalledTimes(1);
    expect(updatedCategory!.data.description).toBe(updateData.description);
    // Add similar expectations for other properties you want to check
  });

  it('should throw an error when strapi.entityService is not defined (update)', async () => {
    strapi.entityService = undefined;
    const categoryId = 1; // Replace with the actual category ID
    // Act & Assert
    try {
      // @ts-ignore
      await categoryService({ strapi }).update(categoryId, {});
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should delete a category', async () => {
    const categoryIdToDelete = 1; // Replace with the actual category ID

    // @ts-ignore
    const isDeleted: boolean = await categoryService({ strapi }).delete(categoryIdToDelete);

    expect(strapi.entityService.delete).toBeCalledTimes(1);
    expect(isDeleted).toBe(true);
  });

  it('should throw an error when strapi.entityService is not defined (delete)', async () => {
    strapi.entityService = undefined;
    const categoryId = 1; // Replace with the actual category ID
    // Act & Assert
    try {
      // @ts-ignore
      await categoryService({ strapi }).delete(categoryId);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

});
