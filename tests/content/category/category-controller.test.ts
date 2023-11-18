import categoryController from '../../../server/controllers/category';
import { ICategory } from '../../../types/category';

describe('Category Controller', () => {
  let strapi: { plugin: any };
  let categoryData: ICategory;

  beforeEach(() => {
    categoryData = {
      title: 'Test Category',
      description: 'This is a test category',
      img: ['image1.jpg'],
      products: [1, 2],
      subcategories: [1, 2],
    };

    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            data: [categoryData],
          }),
          findOne: jest.fn().mockReturnValue(categoryData),
          create: jest.fn().mockImplementation((model: string, data: any) => {
            return { data: { ...categoryData, ...data } };
          }),
          update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
            return { data: { ...categoryData, ...data } };
          }),
          delete: jest.fn().mockResolvedValue(true),
        }),
      }),
    };
  });

  it('should find categories', async () => {
    const ctx = {
      query: {},
      body: null,
    };

    // @ts-ignore
    const result = await categoryController({ strapi }).find(ctx);

    // Expect the body to contain the mock data
    expect(result.data).toEqual([categoryData]);

    // Expect find to be called once
    expect(strapi.plugin('omcommerce').service('category').find).toBeCalledTimes(1);
  });

  it('should throw an error when finding categories', async () => {
    const ctx = {
      query: {},
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the find method
    strapi.plugin('omcommerce').service('category').find.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await categoryController({ strapi }).find(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });

  it('should find one category', async () => {
    const categoryId = 1; // Replace with the actual category ID
    const ctx: any = {
      params: { id: categoryId },
      body: null,
    };

    // @ts-ignore
    await categoryController({ strapi }).findOne(ctx);

    // Expect the body to contain the mock data for the found category
    expect(ctx.body).toEqual(categoryData);

    // Expect findOne to be called once
    expect(strapi.plugin('omcommerce').service('category').findOne).toBeCalledTimes(1);
    // You may also add expectations to check if findOne was called with the correct parameters
  });

  it('should throw an error when finding one category', async () => {
    const categoryId = 1; // Replace with the actual category ID
    const ctx: any = {
      params: { id: categoryId },
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the findOne method
    strapi.plugin('omcommerce').service('category').findOne.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await categoryController({ strapi }).findOne(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });

  it('should create a category', async () => {
    const newData = {
      title: 'Test Category',
      description: 'This is a test category',
      img: ['image1.jpg'],
      products: [1, 2],
      subcategories: [1, 2],
    };

    const ctx: any = {
      request: { body: newData },
      body: null,
    };

    // @ts-ignore
    await categoryController({ strapi }).create(ctx);

    // Use type assertion to inform TypeScript that ctx.body is not null
    expect(ctx.body!.data).toEqual(newData);

    // Expect create to be called once
    expect(strapi.plugin('omcommerce').service('category').create).toBeCalledTimes(1);
  });

  it('should throw an error when creating a category', async () => {
    const newData = {
      title: 'New Category',
      description: 'This is a new category',
      img: {}, // You may need to adjust this based on the actual structure of your media field
      products: [3, 4], // Replace with the actual product IDs
      subcategories: [3, 4], // Replace with the actual subcategory IDs
    };

    const ctx: any = {
      request: { body: newData },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the create method
    strapi.plugin('omcommerce').service('category').create.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await categoryController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });

  it('should update a category', async () => {
    const updateData = {
      title: 'Test Category',
      description: 'This is a test category',
      img: ['image1.jpg'],
      products: [1, 2],
      subcategories: [1, 2],
    };

    const ctx: any = {
      params: { id: 1 },
      request: { body: updateData },
      body: null,
    };

    // @ts-ignore
    await categoryController({ strapi }).update(ctx);

    // Expect the body to contain the mock data for the updated category
    expect(ctx.body!.data).toEqual({ ...categoryData, ...updateData });

    // Expect update to be called once
    expect(strapi.plugin('omcommerce').service('category').update).toBeCalledTimes(1);
  });

  it('should throw an error when updating a category', async () => {
    const updateData = {
      title: 'Updated Category',
      description: 'This category has been updated',
      img: {}, // You may need to adjust this based on the actual structure of your media field
      products: [5, 6], // Replace with the actual product IDs
      subcategories: [5, 6], // Replace with the actual subcategory IDs
    };

    const ctx: any = {
      params: { id: 1 },
      request: { body: updateData },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the update method
    strapi.plugin('omcommerce').service('category').update.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await categoryController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });

  it('should delete a category', async () => {
    const ctx: any = {
      params: { id: 1 },
      body: null,
    };

    // @ts-ignore
    await categoryController({ strapi }).delete(ctx);

    // Expect delete to be called once
    expect(strapi.plugin('omcommerce').service('category').delete).toBeCalledTimes(1);

    // Expect the body to contain the success status for the deleted category
    expect(ctx.body).toEqual(true);
  });

  it('should throw an error when deleting a category', async () => {
    const ctx: any = {
      params: { id: 1 },
      body: null,
      throw: jest.fn(),
    };

    // Simulate an error in the delete method
    strapi.plugin('omcommerce').service('category').delete.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await categoryController({ strapi }).delete(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });
});
