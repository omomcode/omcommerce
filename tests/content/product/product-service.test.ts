import productService from '../../../server/services/product';
import { IProduct } from '../../../types/product';

describe('Product Service', () => {
  let strapi: { entityService: any };
  let productData: IProduct;

  beforeEach(() => {
    productData = {
      id: 1,
      title: 'Test Product',
      slug: 'test-product',
      description: 'This is a test product',
      amount_currency_code: 'USD',
      amount_value: 29.99,
      tax_currency_code: 'USD',
      tax_value: 2.0,
      chargeTax: true,
      Quantity: 50,
      showQuantity: true,
      weight: 1.5,
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
        }]}], // Replace with the actual shipping zone IDs
      categories: [1, 2], // Replace with the actual category IDs
      subcategory: 1, // Replace with the actual subcategory ID
    };

    strapi = {
      entityService: {
        findMany: jest.fn().mockReturnValue([productData]),
        findOne: jest.fn().mockReturnValue(productData),
        create: jest.fn().mockImplementation((model: string, data: any) => {
          return { data: { ...data } };
        }),
        update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
          return { data: { ...productData, ...data } };
        }),
        delete: jest.fn().mockResolvedValue(true),
      },
    };
  });

  it('should find products based on query', async () => {
    const query = {
      filters: { /* your filters here */ },
    };

    // @ts-ignore
    const foundProducts: any[] = await productService({ strapi }).find(query);

    expect(strapi.entityService.findMany).toBeCalledTimes(1);
    expect(foundProducts).toEqual([productData]);

  });

  it('should throw an error when strapi.entityService is not defined (find)', async () => {
    // Act & Assert
    try {
      strapi.entityService = undefined;
      // @ts-ignore
      await productService({ strapi }).find({});
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });


  it('should find a product by ID', async () => {
    const productIdToFind = 1; // Replace with the actual product ID

    // @ts-ignore
    const foundProduct: any = await productService({ strapi }).findOne(productIdToFind);

    expect(strapi.entityService.findOne).toBeCalledTimes(1);
    expect(foundProduct).toEqual(productData);
  });


  it('should throw an error when strapi.entityService is not defined (findOne)', async () => {

    strapi.entityService = undefined;
    // Act & Assert
    try {
      // @ts-ignore
      await productService({ strapi }).findOne(1);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });


  it('should create a product', async () => {
    // @ts-ignore
    const createdProduct: any = await productService({ strapi }).create(productData);

    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(createdProduct.data.data).toEqual({ ...productData });
  });

  it('should throw an error when strapi.entityService is not defined (create)', async () => {

    strapi.entityService = undefined;
    // Act & Assert
    try {
      // @ts-ignore
      await productService({ strapi }).create(productData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should update a product', async () => {
    const productId = 1; // Replace with the actual product ID
    const updateData = {
      amount_value: 29.99,
      Quantity: 50,
    };

    // @ts-ignore
    const updatedProduct: any = await productService({ strapi }).update(productId, updateData);

    expect(strapi.entityService.update).toBeCalledTimes(1);
    expect(updatedProduct!.data.Quantity).toBe(updateData.Quantity);
    expect(updatedProduct!.data.amount_value).toBe(updateData.amount_value);
    // Add similar expectations for other properties you want to check
  });

  it('should throw an error when strapi.entityService is not defined (update)', async () => {

    strapi.entityService = undefined;
    // Act & Assert
    try {
      // @ts-ignore
      await productService({ strapi }).update(1, productData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should delete a product', async () => {
    const productIdToDelete = 1; // Replace with the actual product ID

    // @ts-ignore
    const isDeleted: boolean = await productService({ strapi }).delete(productIdToDelete);

    expect(strapi.entityService.delete).toBeCalledTimes(1);
    expect(isDeleted).toBe(true);
  });

  it('should throw an error when strapi.entityService is not defined (delete)', async () => {
    strapi.entityService = undefined;
    // Act & Assert
    try {
      // @ts-ignore
      await productService({ strapi }).delete(1);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

});
