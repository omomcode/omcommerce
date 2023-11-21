import shippingPackageController from "../../../server/controllers/shippingpackage";
import { IPackage } from "../../../types/package";

describe('Shipping Package Controller', () => {
  let strapi: { plugin: any; };
  let shippingPackageData: IPackage;

  beforeEach(async function () {
    shippingPackageData = {
      id :1,
      name: 'New Package',
      type: 'Box',
      length: 12.0,
      width: 9.5,
      height: 6.0,
      weight: 2.8,
      default: false,
    };

    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            data: [shippingPackageData],
          }),
          create: jest.fn().mockReturnValue({
            data: shippingPackageData,
          }),
          update: jest.fn().mockReturnValue({
            data: {
              ...shippingPackageData,
              name: 'Updated Package', // Assuming an updated 'name' for testing
              type: 'Box',
              length: 12.0,
              width: 9.5,
              height: 6.0,
              weight: 2.8,
              default: false,
            },
          }),
          delete: jest.fn().mockReturnValue({
            success: true,
          }),
        }),
      }),
    };
  });

  it('should find shipping packages', async function () {
    const ctx = {
      query: {},
      body: null,
    };

    // @ts-ignore
    const result = await shippingPackageController({ strapi }).find(ctx);

    // Expect the body to contain the mock data
    expect(result.data).toEqual([shippingPackageData]);

    // Expect find to be called once
    expect(strapi.plugin('omcommerce').service('shippingpackage').find).toBeCalledTimes(1);
  });

  it('should throw an error when finding shipping packages', async () => {
    const ctx = {
      query: {},
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the find method
    strapi.plugin('omcommerce').service('shippingpackage').find.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await shippingPackageController({ strapi }).find(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });


  it('should create a shipping package', async function () {
    const ctx = {
      request: {
        body: shippingPackageData,
      },
      body: null,
    };

    // @ts-ignore
    await shippingPackageController({ strapi }).create(ctx);

    // Expect the body to contain the mock data for the created shipping package
    expect(ctx.body).toEqual({
      data: shippingPackageData,
    });

    // Expect create to be called once
    expect(strapi.plugin('omcommerce').service('shippingpackage').create).toBeCalledTimes(1);
  });

  it('should throw an error when creating a shipping package', async () => {
    const ctx = {
      request: {
        body: shippingPackageData,
      },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the create method
    strapi.plugin('omcommerce').service('shippingpackage').create.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await shippingPackageController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

  it('should throw Invalid data error when creating a shipping package', async () => {


    const shippingPackage = {
      id :1,
      name: 'New Package',
      type: 'Box',
      length: 12.0,
      width: 9.5,
      default: false,
    }

    const ctx = {
      request: {
        body: shippingPackage,
      },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the create method
    strapi.plugin('omcommerce').service('shippingpackage').create.mockRejectedValueOnce("Invalid data");

    // @ts-ignore
    await shippingPackageController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(400, "Invalid data");
  });



  it('should update a shipping package', async function () {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          name: 'Updated Package', // Assuming an updated 'name' for testing
          type: 'Box',
          length: 12.0,
          width: 9.5,
          height: 6.0,
          weight: 2.8,
          default: false,
        },
      },
      body: null,
    };

    // @ts-ignore
    await shippingPackageController({ strapi }).update(ctx);

    // Expect the body to contain the mock data for the updated shipping package
    expect(ctx.body).toEqual({
      data: {
        ...shippingPackageData,
        name: 'Updated Package', // Assuming an updated 'name' for testing
        type: 'Box',
        length: 12.0,
        width: 9.5,
        height: 6.0,
        weight: 2.8,
        default: false,
      },
    });

    // Expect update to be called once
    expect(strapi.plugin('omcommerce').service('shippingpackage').update).toBeCalledTimes(1);
  });

  it('should throw an error when updating a shipping package', async () => {
    const ctx = {
      params: { id: 1 },
      request: {
        body: {
          name: 'Updated Package',
        },
      },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the update method
    strapi.plugin('omcommerce').service('shippingpackage').update.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await shippingPackageController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

  it('should delete a shipping package', async function () {
    const ctx = {
      params: { id: 1 },
      body: null,
    };

    // @ts-ignore
    await shippingPackageController({ strapi }).delete(ctx);

    // Expect delete to be called once
    expect(strapi.plugin('omcommerce').service('shippingpackage').delete).toBeCalledTimes(1);

    // Expect the body to contain the success status for the deleted shipping package
    expect(ctx.body).toEqual({
      success: true,
    });
  });

  it('should throw an error when deleting a shipping package', async () => {
    const ctx = {
      params: { id: 1 },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the delete method
    strapi.plugin('omcommerce').service('shippingpackage').delete.mockRejectedValueOnce("Simulated error");

    // @ts-ignore
    await shippingPackageController({ strapi }).delete(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, "Simulated error");
  });

});
