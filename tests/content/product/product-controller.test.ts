import productController from '../../../server/controllers/product';
import { IProduct } from '../../../types/product';

describe('Product Controller', () => {
  let strapi: { plugin: any };
  let productData: IProduct;

  beforeEach(() => {
    productData = {
      id: 1,
      title: 'Test Product',
      slug: 'test-product',
      description: 'This is a test product',
      SKU: 'ABC123',
      amount_currency_code: 'USD',
      amount_value: 19.99,
      tax_currency_code: 'USD',
      tax_value: 2.0,
      media: ['image1.jpg', 'image2.jpg'],
      compare_at_price: '29.99',
      cost_per_item: '15.00',
      chargeTax: true,
      Quantity: 100,
      Barcode: '123456789',
      showQuantity: true,
      weight: 1.5,
      measurement_unit: 'kg',
      omcommerce_tax: {id: 1,country_code: "US",
        state_code: "CA",
        rate: 0,
        name: "Domestic",
        shipping: false}, // Replace with the actual tax ID
      omcommerce_shippingzones: [{id: 1,
        name: "Test Shipping Zone",
        countries: [{code: "US",
          name: "United States",
          checked: true},],
        shippingRatesData: [{
          id: 1,
          name: "Test Shipping Rate",
          condition: "Test Condition",
          price: 10.0
        }]}],
      categories: [3, 4], // Assuming the IDs of the associated categories
      subcategory: 5, // Assuming the ID of the associated subcategory
      amount_value_converted: 25.0,
      amount_value_converted_currency_code: 'EUR',
    };

    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            data: [productData],
          }),
          findOne: jest.fn().mockResolvedValue(productData),
          delete: jest.fn().mockResolvedValue(true),
          create: jest.fn().mockReturnValue({
            data: productData,
          }),
          update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
            return { data: { ...productData, ...data } };
          }),
        }),
      }),
    };
  });

  it('should find product information', async () => {
    const ctx = {
      query: {},
      body: null,
    };

    // @ts-ignore
    const result = await productController({ strapi }).find(ctx);

    // Expect the body to contain the mock data
    expect(result.data).toEqual([productData]);

    // Expect find to be called once
    expect(strapi.plugin('omcommerce').service('product').find).toBeCalledTimes(1);
  });

  it('should find a products', async () => {
    const ctx: any = {
      query: {},
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the findOne method
    strapi.plugin('omcommerce').service('product').find.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await productController({ strapi }).find(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });

  it('should create product information', async () => {
    const newData = { ...productData, title: 'Test Product' };

    const ctx: any = {
      request: { body: newData },
      body: null,
    };

    // @ts-ignore
    await productController({ strapi }).create(ctx);

    // Use type assertion to inform TypeScript that ctx.body is not null
    expect(ctx.body!.data).toEqual(newData);

    // Expect create to be called once
    expect(strapi.plugin('omcommerce').service('product').create).toBeCalledTimes(1);
  });

  it('should create a product and handle errors', async () => {
    const ctx: any = {
      request: { body: productData },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the create method
    strapi.plugin('omcommerce').service('product').create.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await productController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });

  it('should update product information', async () => {
    const updateData = { ...productData, title: 'Test Product' };

    const ctx: any = {
      params: { id: 1 },
      request: { body: updateData },
      body: null,
    };

    // @ts-ignore
    await productController({ strapi }).update(ctx);

    // Expect the body to contain the mock data for the updated product information
    expect(ctx.body!.data).toEqual({ ...productData, ...updateData });

    // Expect update to be called once
    expect(strapi.plugin('omcommerce').service('product').update).toBeCalledTimes(1);
  });

  it('should update a product and handle errors', async () => {
    const ctx: any = {
      params: { id: 1 }, // Replace with the actual product ID
      request: { body: productData },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the update method
    strapi.plugin('omcommerce').service('product').update.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await productController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });

  it('should find a product by ID', async () => {
    const ctx: any = {
      params: { id: 1 }, // Replace with the actual product ID
      body: null,
    };

    // @ts-ignore
    await productController({ strapi }).findOne(ctx);

    // Expect findOne to be called once with the correct parameters
    expect(strapi.plugin('omcommerce').service('product').findOne).toBeCalledTimes(1);
    expect(strapi.plugin('omcommerce').service('product').findOne).toBeCalledWith(1);

    // Expect ctx.body to contain the product data
    expect(ctx.body).toEqual(productData);
  });

  it('should throw an error when finding a product by ID', async () => {
    const ctx: any = {
      params: { id: 1 }, // Replace with the actual product ID
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the findOne method
    strapi.plugin('omcommerce').service('product').findOne.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await productController({ strapi }).findOne(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });

  it('should delete a product', async () => {
    const ctx: any = {
      params: { id: 1 }, // Replace with the actual product ID
      body: null,
    };

    // @ts-ignore
    await productController({ strapi }).delete(ctx);

    // Expect delete to be called once with the correct parameters
    expect(strapi.plugin('omcommerce').service('product').delete).toBeCalledTimes(1);
    expect(strapi.plugin('omcommerce').service('product').delete).toBeCalledWith(1);

    // Expect ctx.body to contain the success status for the deleted product
    expect(ctx.body).toEqual(true);
  });

  it('should throw an error when deleting a product', async () => {
    const ctx: any = {
      params: { id: 1 }, // Replace with the actual product ID
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the delete method
    strapi.plugin('omcommerce').service('product').delete.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await productController({ strapi }).delete(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });


  // Add more test cases for other controller actions as needed
});
