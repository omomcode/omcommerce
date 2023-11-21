import orderController from '../../../server/controllers/order';
import billingController from "../../../server/controllers/billing";

describe('Order Controller', () => {
  let strapi: { plugin: any };
  let orderData: any; // Replace with your actual order data

  beforeEach(() => {
    orderData = {
      order_id: '123456',
      amount: 100.0,
      currency: 'USD',
      items: [{ /* item data */ }],
      shipping_fee: 10.0,
      tax_total: 5.0,
      discount: 'DISCOUNT_CODE',
      email: 'customer@example.com',
      customer_name: 'John',
      customer_surname: 'Doe',
      address_line_1: '123 Main St',
      address_line_2: 'Apt 4',
      admin_area_1: 'CA',
      admin_area_2: 'San Francisco',
      postal_code: '12345',
      country_code: 'US',
      status: 'pending',
    };

    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          create: jest.fn().mockImplementation((data: any) => {
            return { data };
          }),
          find: jest.fn().mockReturnValue({
            data: [orderData],
          }),
          findOne: jest.fn().mockImplementation((id: any) => {
            return { data: { ...orderData, id } };
          }),
          update: jest.fn().mockImplementation((id: any, data: any) => {
            return { data: { ...orderData, ...data, id } };
          }),
          delete: jest.fn().mockResolvedValue(true),
        }),
      }),
    };
  });

  it('should create an order', async () => {
    const ctx: any = {
      request: { body: orderData },
      body: null,
    };

    // @ts-ignore
    await orderController({ strapi }).create(ctx);

    expect(strapi.plugin('omcommerce').service('order').create).toBeCalledTimes(1);
    expect(ctx.body.data).toEqual(orderData);
  });

  it('should throw an error when creating an order', async () => {
    const ctx: any = {
      request: { body: orderData },
      throw: jest.fn(),
    };

    // Simulate an error in the create method
    strapi.plugin('omcommerce').service('order').create.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await orderController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });

  it('should handle invalid data entries error when creating order', async () => {
    const ctx = {
      request: {
        body: {
          order_id: '123456',
          // amount: 100.0,
          currency: 'USD',
          items: [{ /* item data */}],
          shipping_fee: 10.0,
          tax_total: 5.0,
          discount: 'DISCOUNT_CODE',
          email: 'customer@example.com',
          customer_name: 'John',
          customer_surname: 'Doe',
          address_line_1: '123 Main St',
          address_line_2: 'Apt 4',
          admin_area_1: 'CA',
          admin_area_2: 'San Francisco',
          postal_code: '12345',
          country_code: 'US',
          status: 'pending',
        }
      },
      throw: jest.fn(),
    };

    // @ts-ignore
    await orderController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters for a 400 error
    expect(ctx.throw).toHaveBeenCalledWith(400, "Invalid data");
  });


  it('should find orders', async () => {
    const ctx: any = {
      query: {},
      body: null,
    };

    // @ts-ignore
    const result = await orderController({ strapi }).find(ctx);

    expect(result.data).toEqual([orderData]);
    expect(strapi.plugin('omcommerce').service('order').find).toBeCalledTimes(1);
  });

  it('should throw an error when finding orders', async () => {
    const ctx: any = {
      query: {},
      throw: jest.fn(),
    };

    // Simulate an error in the find method
    strapi.plugin('omcommerce').service('order').find.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await orderController({ strapi }).find(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });

  it('should find a specific order', async () => {
    const orderId = 1; // Replace with the actual order ID
    const ctx: any = {
      params: { id: orderId },
      body: null,
    };

    // @ts-ignore
    const result : any = await orderController({ strapi }).findOne(ctx);

    expect(ctx.body.data).toEqual({ ...orderData, id: orderId });
    expect(strapi.plugin('omcommerce').service('order').findOne).toBeCalledTimes(1);
  });

  it('should throw an error when finding one order', async () => {
    const ctx: any = {
      params: { id: 1 },
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the findOne method
    strapi.plugin('omcommerce').service('order').findOne.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await orderController({ strapi }).findOne(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });


  it('should update an order', async () => {
    const orderId = 1; // Replace with the actual order ID
    const updateData = {
      order_id: '123456',
      amount: 100.0,
      currency: 'USD',
      items: [{ /* item data */ }],
      shipping_fee: 10.0,
      tax_total: 5.0,
      discount: 'DISCOUNT_CODE',
      email: 'new_customer@example.com',
      customer_name: 'John',
      customer_surname: 'Doe',
      address_line_1: '123 Main St',
      address_line_2: 'Apt 4',
      admin_area_1: 'CA',
      admin_area_2: 'San Francisco',
      postal_code: '12345',
      country_code: 'US',
      status: 'pending',
    };

    const ctx: any = {
      params: { id: orderId },
      request: { body: updateData },
      body: null,
    };

    // @ts-ignore
    await orderController({ strapi }).update(ctx);

    expect(ctx.body!.data).toEqual({ ...orderData, ...updateData, id: orderId });
    expect(strapi.plugin('omcommerce').service('order').update).toBeCalledTimes(1);
  });

  it('should throw an error when updating an order', async () => {
    const ctx: any = {
      params: { id: 2 },
      request: { body: { status: 'shipped' } },
      throw: jest.fn(),
    };

    // Simulate an error in the update method
    strapi.plugin('omcommerce').service('order').update.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await orderController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });

  it('should delete an order', async () => {
    const orderIdToDelete = 1; // Replace with the actual order ID
    const ctx: any = {
      params: { id: orderIdToDelete },
      body: null,
    };

    // @ts-ignore
    await orderController({ strapi }).delete(ctx);

    expect(strapi.plugin('omcommerce').service('order').delete).toBeCalledTimes(1);
    expect(ctx.body).toEqual(true);
  });

  it('should throw an error when deleting an order', async () => {
    const ctx: any = {
      params: { id: 3 },
      throw: jest.fn(),
    };

    // Simulate an error in the delete method
    strapi.plugin('omcommerce').service('order').delete.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await orderController({ strapi }).delete(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });

  it('should handle invalid data entries error when deleting order', async () => {
    const ctx: any = {
      params: { id: null },
      throw: jest.fn(),
    };

    // @ts-ignore
    await orderController({ strapi }).delete(ctx);

    // Expect throw to be called with the correct parameters for a 400 error
    expect(ctx.throw).toHaveBeenCalledWith(400, "Invalid data");
  });

});
