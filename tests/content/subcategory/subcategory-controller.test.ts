import subcategoryController from '../../../server/controllers/subcategory';

describe('Subcategory Controller', () => {
  let strapi: { plugin: any };
  let subcategoryData: any; // Update this with your actual subcategory data structure

  beforeEach(() => {
    // Replace this with your actual subcategory data
    subcategoryData = {
      id: 1,
      title: 'Subcategory 1',
      category: 1,
    };

    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          findOne: jest.fn().mockReturnValue(subcategoryData),
          find: jest.fn().mockReturnValue([subcategoryData]),
          create: jest.fn().mockReturnValue(subcategoryData),
          update: jest.fn().mockReturnValue(subcategoryData),
          delete: jest.fn().mockReturnValue(true),
        }),
      }),
    };
  });

  it('should find one subcategory', async () => {
    const subcategoryId = 1; // Replace with the actual subcategory ID
    const ctx: any = {
      params: { id: subcategoryId },
      body: null,
    };

    // @ts-ignore
    await subcategoryController({ strapi }).findOne(ctx);

    // Expect the body to contain the mock data for the found subcategory
    expect(ctx.body).toEqual(subcategoryData);

    // Expect findOne to be called once
    expect(strapi.plugin('omcommerce').service('subcategory').findOne).toBeCalledTimes(1);
    // You may also add expectations to check if findOne was called with the correct parameters
  });

  it('should throw an error when finding one subcategory', async () => {
    const subcategoryId = 1; // Replace with the actual subcategory ID
    const ctx: any = {
      params: { id: subcategoryId },
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the findOne method
    strapi.plugin('omcommerce').service('subcategory').findOne.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await subcategoryController({ strapi }).findOne(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });

  it('should find subcategories', async () => {
    const ctx: any = {
      query: {},
      body: null,
    };

    // @ts-ignore
    const subcategory = await subcategoryController({ strapi }).find(ctx);

    // Expect the body to contain the mock data for the found subcategories
    expect(subcategory).toEqual([subcategoryData]);

    // Expect find to be called once
    expect(strapi.plugin('omcommerce').service('subcategory').find).toBeCalledTimes(1);
    // You may also add expectations to check if find was called with the correct parameters
  });

  it('should throw an error when finding subcategories', async () => {
    const ctx: any = {
      query: {},
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the find method
    strapi.plugin('omcommerce').service('subcategory').find.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await subcategoryController({ strapi }).find(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });

  it('should create a subcategory', async () => {
    const newSubcategoryData = {
      id: 1,
      title: 'Subcategory 1',
      category: 1,
    };

    const ctx: any = {
      request: { body: newSubcategoryData },
      body: null,
    };

    // @ts-ignore
    await subcategoryController({ strapi }).create(ctx);

    // Use type assertion to inform TypeScript that ctx.body is not null
    expect(ctx.body).toEqual(subcategoryData);

    // Expect create to be called once
    expect(strapi.plugin('omcommerce').service('subcategory').create).toBeCalledTimes(1);
    // You may also add expectations to check if create was called with the correct parameters
  });

  it('should throw an error when creating a subcategory', async () => {
    const newSubcategoryData = {
      title: 'New Subcategory',
      category: 1, // Replace with the actual category ID
      // ... other properties
    };

    const ctx: any = {
      request: { body: newSubcategoryData },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the create method
    strapi.plugin('omcommerce').service('subcategory').create.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await subcategoryController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });


  it('should update a subcategory', async () => {
    const updateData = {
      title: 'Subcategory 1',
      category: 1,
    };

    const ctx: any = {
      params: { id: 1 },
      request: { body: updateData },
      body: null,
    };

    // @ts-ignore
    await subcategoryController({ strapi }).update(ctx);

    // Expect the body to contain the mock data for the updated subcategory
    expect(ctx.body).toEqual({ id: 1, ...subcategoryData, ...updateData });

    // Expect update to be called once
    expect(strapi.plugin('omcommerce').service('subcategory').update).toBeCalledTimes(1);
    // You may also add expectations to check if update was called with the correct parameters
  });

  it('should throw an error when updating a subcategory', async () => {
    const updateData = {
      title: 'Updated Subcategory',
      // ... other properties to update
    };

    const ctx: any = {
      params: { id: 1 },
      request: { body: updateData },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the update method
    strapi.plugin('omcommerce').service('subcategory').update.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await subcategoryController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });

  it('should delete a subcategory', async () => {
    const ctx: any = {
      params: { id: 1 },
      body: null,
    };

    // @ts-ignore
    await subcategoryController({ strapi }).delete(ctx);

    // Expect delete to be called once
    expect(strapi.plugin('omcommerce').service('subcategory').delete).toBeCalledTimes(1);

    // Expect the body to contain the success status for the deleted subcategory
    expect(ctx.body).toEqual(true);
  });

  it('should throw an error when deleting a subcategory', async () => {
    const ctx: any = {
      params: { id: 1 },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the delete method
    strapi.plugin('omcommerce').service('subcategory').delete.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await subcategoryController({ strapi }).delete(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });

});
