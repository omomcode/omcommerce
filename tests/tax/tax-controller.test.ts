import taxController from '../../server/controllers/tax';
import { ITaxes } from '../../types/taxes';

describe('Tax Controller', () => {
  let strapi: { plugin: any };
  let taxData: ITaxes;

  beforeEach(async () => {
    taxData = {
      id: 1,
      country_code: 'US',
      state_code: 'CA',
      rate: 7.5,
      name: 'Sales Tax',
      shipping: true,
    };

    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            data: [taxData],
          }),
          create: jest.fn().mockReturnValue({
            data: taxData,
          }),
          update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
            return { data: { ...taxData, ...data } };
          }),
          delete: jest.fn().mockImplementation((model: string, id: any) => {
            // Mock the behavior of delete method
            // Return true if deletion is successful, otherwise, throw an error
            if (id === 1) {
              return true;
            } else {
              throw new Error('Failed to delete tax');
            }
          }),
        }),
      }),
    };
  });

  it('should find tax information', async () => {
    const ctx = {
      query: {},
      body: null,
    };

    // @ts-ignore
    const result = await taxController({ strapi }).find(ctx);

    // Expect the body to contain the mock data
    expect(result.data).toEqual([taxData]);

    // Expect find to be called once
    expect(strapi.plugin('omcommerce').service('tax').find).toBeCalledTimes(1);
  });

  it('should throw an error when finding tax information', async () => {
    const ctx = {
      query: {},
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the find method
    strapi.plugin('omcommerce').service('tax').find.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await taxController({ strapi }).find(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

  it('should create tax information', async () => {
    const newData = {
      id: 1,
      country_code: 'US',
      state_code: 'CA',
      rate: 7.5,
      name: 'Sales Tax',
      shipping: true,
    };

    const ctx: any = {
      request: { body: newData },
      body: null,
    };

    // @ts-ignore
    await taxController({ strapi }).create(ctx);

    // Use type assertion to inform TypeScript that ctx.body is not null
    expect(ctx.body!.data).toEqual(newData);

    // Expect create to be called once
    expect(strapi.plugin('omcommerce').service('tax').create).toBeCalledTimes(1);
  });

  it('should throw an error when creating tax information', async () => {
    const newData = {
      country_code: 'US',
      state_code: 'NY',
      rate: 8.0,
      name: 'Sales Tax NY',
      shipping: false,
    };

    const ctx: any = {
      request: { body: newData },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the create method
    strapi.plugin('omcommerce').service('tax').create.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await taxController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

  it('should update tax information', async () => {
    const updateData = {
      country_code: 'US',
      state_code: 'CA',
      rate: 7.5,
      name: 'Sales Tax',
      shipping: true,
    };

    const ctx: any = {
      params: { id: 1 },
      request: { body: updateData },
      body: null,
    };

    // @ts-ignore
    await taxController({ strapi }).update(ctx);

    // Expect the body to contain the mock data for the updated tax information
    const expectedData = { ...taxData, ...updateData, id: 1 };
    expect(ctx.body!.data).toEqual(expectedData);

    // Expect update to be called once
    expect(strapi.plugin('omcommerce').service('tax').update).toBeCalledTimes(1);
  });

  it('should throw an error when updating tax information', async () => {
    const updateData = {
      country_code: 'US',
      state_code: 'CA',
      rate: 8.5,
      name: 'Updated Sales Tax',
      shipping: true,
    };

    const ctx: any = {
      params: { id: 1 },
      request: { body: updateData },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the update method
    strapi.plugin('omcommerce').service('tax').update.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await taxController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

  it('should delete tax information', async () => {
    const ctx: any = {
      params: { id: 1 },
      body: null,
      throw: jest.fn(),
    };

    // Simulate a successful deletion
    strapi.plugin('omcommerce').service('tax').delete.mockResolvedValueOnce(true);

    // @ts-ignore
    await taxController({ strapi }).delete(ctx);

    // Expect delete to be called once
    expect(strapi.plugin('omcommerce').service('tax').delete).toBeCalledTimes(1);

    // Expect the body to contain the success status for the deleted tax information
    expect(ctx.body).toEqual(true);

    // Ensure that ctx.throw was not called
    expect(ctx.throw).not.toBeCalled();
  });

  it('should throw an error when deleting tax information', async () => {
    const ctx: any = {
      params: { id: 1 },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the delete method
    strapi.plugin('omcommerce').service('tax').delete.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await taxController({ strapi }).delete(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

});
