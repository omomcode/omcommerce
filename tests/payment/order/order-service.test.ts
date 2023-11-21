import ordersService from '../../../server/services/order';
import { IOrder } from '../../../types/order';

describe('Orders Service', () => {
  let strapi: { entityService: any };
  let orderData: IOrder;

  beforeEach(() => {
    orderData = {
      order_id: 'test_order_id',
      amount: "100.0",
      currency: 'USD',
      items: "[{ id: 1, quantity: 2 }]",
      shipping_fee: "10.0",
      tax_total: "5.0",
      email: 'test@example.com',
      customer_name: 'John',
      customer_surname: 'Doe',
      address_line_1: '123 Main St',
      postal_code: '12345',
      country_code: 'US',
      status: 'PROCESSING',
    };

    strapi = {
      entityService: {
        findMany: jest.fn().mockReturnValue([orderData]),
        findOne: jest.fn().mockReturnValue(orderData),
        create: jest.fn().mockImplementation((model: string, data: any) => {
          return { data: { ...orderData, ...data } };
        }),
        update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
          return {
            order_id: data.order_id || 'test_order_id',
            amount: data.amount ||"100.0",
            currency: data.currency ||'USD',
            items: data.items ||"[{ id: 1, quantity: 2 }]",
            shipping_fee:data.shipping_fee || "10.0",
            tax_total:data.tax_total || "5.0",
            email:data.email || 'new_test@example.com',
            customer_name: data.customer_name || 'John',
            customer_surname:data.customer_surname ||  'Doe',
            address_line_1: data.address_line_1 ||'123 Main St',
            postal_code: data.postal_code || '12345',
            country_code: data.country_code || 'US',
            status: data.status || 'CREATED',
          };
        }),
        delete: jest.fn().mockResolvedValue(true),
      },
    };
  });


  it('should find one order', async () => {
    const orderId = 'test_order_id'; // Replace with the actual order ID
    // @ts-ignore
    const foundOrder: any = await ordersService({ strapi }).findOne(orderId);

    expect(strapi.entityService.findOne).toBeCalledTimes(1);
    expect(foundOrder).toEqual(orderData);
  });

  it('should throw an error when strapi.entityService is not defined (findOne)', async () => {
    // Act & Assert
    try {
      strapi.entityService = undefined;
      const orderId = 'test_order_id'; // Replace with the actual order ID
      // @ts-ignore
      await ordersService({ strapi }).findOne(orderId);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });


  it('should find orders', async () => {
    // @ts-ignore
    const foundOrders: any = await ordersService({ strapi }).find({});

    expect(strapi.entityService.findMany).toBeCalledTimes(1);
    expect(foundOrders).toEqual([orderData]);
  });

  it('should throw an error when strapi.entityService is not defined (find)', async () => {
    // Act & Assert
    try {
      strapi.entityService = undefined;
      // @ts-ignore
      await ordersService({ strapi }).find({});
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should create an order', async () => {
    const createData = {
      order_id: 'test_order_id',
      amount: "100.0",
      currency: 'USD',
      items: "[{ id: 1, quantity: 2 }]",
      shipping_fee: "10.0",
      tax_total: "5.0",
      email: 'test@example.com',
      customer_name: 'John',
      customer_surname: 'Doe',
      address_line_1: '123 Main St',
      postal_code: '12345',
      country_code: 'US',
      status: 'PROCESSING',
    };

    // @ts-ignore
    const createdOrder: any = await ordersService({ strapi }).create(createData);

    expect(strapi.entityService.create).toBeCalledTimes(1);
    // Add expectations for the created order data
  });

  it('should throw an error when strapi.entityService is not defined (create)', async () => {
    // Arrange
    const initialData = {
      // Replace with the actual data you use for creating an order
    };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await ordersService({ strapi }).create(initialData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should update an order', async () => {
    const orderId = 'test_order_id'; // Replace with the actual order ID
    const updateData = {
      order_id: 'test_order_id',
      amount: "100.0",
      currency: 'USD',
      items: "[{ id: 1, quantity: 2 }]",
      shipping_fee: "10.0",
      tax_total: "5.0",
      email: 'new_test@example.com',
      customer_name: 'John',
      customer_surname: 'Doe',
      address_line_1: '123 Main St',
      postal_code: '12345',
      country_code: 'US',
      status: 'CREATED',
    };

    // @ts-ignore
    const updatedOrder: any = await ordersService({ strapi }).update(orderId, updateData);

    expect(strapi.entityService.update).toBeCalledTimes(1);
    expect(updatedOrder).not.toBeNull();
    expect(updatedOrder.email).toBe(updateData.email);
    // Add expectations for the updated order data
  });

  it('should throw an error when strapi.entityService is not defined (update)', async () => {
    // Arrange
    const orderId = 'test_order_id'; // Replace with the actual order ID
    const updateData = {
      // Replace with the actual data you use for updating an order
    };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await ordersService({ strapi }).update(orderId, updateData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should delete an order', async () => {
    const orderIdToDelete = 1; // Replace with the actual order ID

    // @ts-ignore
    const isDeleted: boolean = await ordersService({ strapi }).delete(1);

    expect(strapi.entityService.delete).toBeCalledTimes(1);
    expect(isDeleted).toBe(true);
  });

  it('should throw an error when strapi.entityService is not defined (delete)', async () => {
    // Act & Assert
    try {
      strapi.entityService = undefined;
      const orderIdToDelete = 'test_order_id'; // Replace with the actual order ID
      // @ts-ignore
      await ordersService({ strapi }).delete(orderIdToDelete);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });
});
