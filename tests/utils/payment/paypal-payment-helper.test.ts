import axios from 'axios';
import { capturePayment, createOrder, generateAccessToken, handleResponse} from '../../../server/utils/payment/paypalPaymentHelper'
import {sendMail} from "../../../server/services/sendmail";
// Import other dependencies or mocks as needed

jest.mock('axios');

describe('Payment Service', () => {
  let strapi: { entityService: any, plugin: any };

  beforeEach(() => {
    strapi = {
      entityService: {
        findMany: jest.fn(),
        findOne: jest.fn(),
      },
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockImplementation((serviceName: string) => {
          if (serviceName === 'product') {
            return {
              find: jest.fn().mockImplementation((data: any) => {
                // Mock implementation for the 'product' service
                return [{id: 1, amount_value: 5, name: "some product", weight : 5},{id: 0, amount_value: 5, name: "some other product", weight : 5}];
              }),
            };
          } else if (serviceName === 'shippingcalculator') {
            return {
              calculate: jest.fn().mockImplementation((data: any) => {
                // Mock implementation for the 'shippingzone' service
                return 20;
              }),
            };
          }
          else if (serviceName === 'currency') {
            return {
              find: jest.fn().mockImplementation((data: any) => {
                // Mock implementation for the 'shippingzone' service
                return {
                  currency: "USD"
                };
              }),
            };
          }
          else if (serviceName === 'order') {
            return {
              find: jest.fn().mockImplementation((query: any) => {
                // Mock implementation for the 'order' service
                return [{ /* mock order data here based on query */ }];
              }),
              update: jest.fn().mockImplementation((orderId: string, updatedData: any) => {
                // Mock implementation for updating an order
                return updatedData;
              }),
              create: jest.fn().mockImplementation((data: any) => {
                // Mock implementation for the 'order' service
                return [{ /* mock order data here based on query */ }];
              }),
            };
          }
          else if (serviceName === 'gmail') {
            return {
              find: jest.fn().mockImplementation((data: any) => {
                // Mock implementation for the 'gmail' service
                return [{ /* mock gmail data here */ }];
              }),
            };
          }
          else if (serviceName === 'paypalsetup') {
            return {
              find: jest.fn().mockImplementation((data: any) => {
                // Mock implementation for the 'paypalsetup' service
                return {
                  live: true,
                  live_paypal_client_id: 'your_live_client_id',
                  live_paypal_client_secret: 'your_live_client_secret',
                  sandbox_paypal_client_id: 'your_sandbox_client_id',
                  sandbox_paypal_client_secret: 'your_sandbox_client_secret',
                };
              }),
            };
          }
          // Add more conditions for other services as needed

          // Default case, return an empty object if the service is not recognized
          return {};
        }),
      }),
    };


    // Mock console.error to capture error messages
    console.error = jest.fn();
  });

  describe('capturePayment', () => {
    it('captures payment successfully and sends email for COMPLETED status', async () => {
      // Set up the test data, including the order ID
      const orderID = 'your_test_order_id';

      // Mock the axios.post function to return a successful response
      jest.spyOn(axios, 'post').mockResolvedValue({
        status: 200,
        data: {
          payer: {
            email_address: 'test@example.com',
            name: {
              given_name: 'John',
              surname: 'Doe',
            },
          },
          purchase_units: [
            {
              shipping: {
                address: {
                  address_line_1: '123 Main St',
                  address_line_2: 'Apt 4',
                  admin_area_1: 'CA',
                  admin_area_2: 'Los Angeles',
                  country_code: 'US',
                  postal_code: '90001',
                },
              },
            },
          ],
          status: 'COMPLETED',
        },
      });

      // Call the capturePayment function with the mocked strapi object
      const result = await capturePayment(orderID, strapi);

      // Add your assertions based on the expected behavior of capturePayment
      // For example, you can check if the result is as expected or if certain functions were called
      expect(result.status).toEqual("COMPLETED");
      // Add more assertions as needed
    });
    it('captures payment successfully and sends email for COMPLETED status in sandbox environment', async () => {
      // Set up the test data, including the order ID
      const orderID = 'your_test_order_id';

      // Mock the process.env.STRAPI_ADMIN_PAYPAL_ENVIRONMENT for this specific test
      // @ts-ignore
      strapi = {
        entityService: {
          findMany: jest.fn(),
          findOne: jest.fn(),
        },
        plugin: jest.fn().mockReturnValue({
          service: jest.fn().mockImplementation((serviceName: string) => {
            if (serviceName === 'product') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'product' service
                  return [{id: 1, amount_value: 5, name: "some product", weight : 5},{id: 0, amount_value: 5, name: "some other product", weight : 5}];
                }),
              };
            } else if (serviceName === 'shippingcalculator') {
              return {
                calculate: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'shippingzone' service
                  return 20;
                }),
              };
            }
            else if (serviceName === 'currency') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'shippingzone' service
                  return {
                    currency: "USD"
                  };
                }),
              };
            }
            else if (serviceName === 'order') {
              return {
                find: jest.fn().mockImplementation((query: any) => {
                  // Mock implementation for the 'order' service
                  return [{ /* mock order data here based on query */ }];
                }),
                update: jest.fn().mockImplementation((orderId: string, updatedData: any) => {
                  // Mock implementation for updating an order
                  return updatedData;
                }),
                create: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'order' service
                  return [{ /* mock order data here based on query */ }];
                }),
              };
            }
            else if (serviceName === 'gmail') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'gmail' service
                  return [{ /* mock gmail data here */ }];
                }),
              };
            }
            else if (serviceName === 'paypalsetup') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'paypalsetup' service
                  return {
                    live: false,
                    live_paypal_client_id: 'your_live_client_id',
                    live_paypal_client_secret: 'your_live_client_secret',
                    sandbox_paypal_client_id: 'your_sandbox_client_id',
                    sandbox_paypal_client_secret: 'your_sandbox_client_secret',
                  };
                }),
              };
            }
            return {};
          }),
        }),
      };

      // Mock the axios.post function to return a successful response
      jest.spyOn(axios, 'post').mockResolvedValue({
        status: 200,
        data: {
          payer: {
            email_address: 'test@example.com',
            name: {
              given_name: 'John',
              surname: 'Doe',
            },
          },
          purchase_units: [
            {
              shipping: {
                address: {
                  address_line_1: '123 Main St',
                  address_line_2: 'Apt 4',
                  admin_area_1: 'CA',
                  admin_area_2: 'Los Angeles',
                  country_code: 'US',
                  postal_code: '90001',
                },
              },
            },
          ],
          status: 'COMPLETED',
        },
      });

      // Call the capturePayment function with the mocked strapi object
      const result = await capturePayment(orderID, strapi);

      // Add your assertions based on the expected behavior of capturePayment
      // For example, you can check if the result is as expected or if certain functions were called
      expect(result.status).toEqual("COMPLETED");
      // Add more assertions as needed

      // Clean up the environment variable mock after the test
      jest.restoreAllMocks();
    });

    it('logs an error when payment capture fails', async () => {
      // Set up the test data, including the order ID
      const orderID = 'your_test_order_id';

      // Mock the axios.post function to throw an error
      jest.spyOn(axios, 'post').mockRejectedValue(new Error('Test error'));

      // Spy on console.error to capture the error message
      const consoleErrorSpy = jest.spyOn(console, 'error');

      // Call the capturePayment function with the mocked strapi object
      await capturePayment(orderID, strapi);

      // Expect that console.error was called with the expected error message
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', expect.any(Error));

      // Clean up the mocks
      jest.restoreAllMocks();
    });
    it('logs an error when failed to generate access token', async () => {
      // Mock the axios.post function in generateAccessToken to throw an error
      jest.spyOn(axios, 'post').mockRejectedValue(new Error('Test error in generateAccessToken'));

      // Spy on console.error to capture the error message
      const consoleErrorSpy = jest.spyOn(console, 'error');

      // Call the generateAccessToken function
      await generateAccessToken(strapi);

      // Expect that console.error was called with the expected error message
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to generate Access Token:', expect.any(Error));

      // Clean up the mocks
      jest.restoreAllMocks();
    });
    // Add more test cases as needed
  });

  describe('createOrder', () => {
    it('creates an order successfully', async () => {
      // Mock the axios.post function to return a successful response
      jest.spyOn(axios, 'post').mockResolvedValue({
        status: 200,
        data: {
          id: 'test_order_id',
          status: 'CREATED',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: '100.00',
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: '80.00',
                  },
                  shipping: {
                    currency_code: 'USD',
                    value: '20.00',
                  },
                },
              },
              items: [
                {
                  name: 'Product 1',
                  description: 'Description for Product 1',
                  SKU: 'SKU_001',
                  unit_amount: {
                    currency_code: 'USD',
                    value: '40.00',
                  },
                  quantity: 2,
                },
              ],
            },
          ],
        },
      });
      // Call the createOrder function with the mocked strapi object

      const result = await createOrder({ cart: [{ id: "1", quantity: 2 }] , country_code:"USD"}, strapi);
      // Add your assertions based on the expected behavior of createOrder
      expect(result.status).toEqual('CREATED');



      // Add more assertions as needed
    });
    it('logs an error when failed to create an order', async () => {
      // Mock the axios.post function to throw an error
      jest.spyOn(axios, 'post').mockRejectedValue(new Error('Test error during order creation'));

      // Spy on console.error to capture the error message
      const consoleErrorSpy = jest.spyOn(console, 'error');

      // Call the createOrder function with the mocked strapi object
      await createOrder({ cart: [{ id: 1, quantity: 2 }], country_code: 'USD' }, strapi);

      // Expect that console.error was called with the expected error message
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', expect.any(Error));

      // Clean up the mocks
      jest.restoreAllMocks();
    });
    it('creates an order successfully with live as false', async () => {
      // Mock the paypalsetup service to return live as false
      strapi = {
        entityService: {
          findMany: jest.fn(),
          findOne: jest.fn(),
        },
        plugin: jest.fn().mockReturnValue({
          service: jest.fn().mockImplementation((serviceName: string) => {
            if (serviceName === 'product') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'product' service
                  return [{id: 1, amount_value: 5, name: "some product", weight : 5},{id: 0, amount_value: 5, name: "some other product", weight : 5}];
                }),
              };
            } else if (serviceName === 'shippingcalculator') {
              return {
                calculate: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'shippingzone' service
                  return 20;
                }),
              };
            }
            else if (serviceName === 'currency') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'shippingzone' service
                  return {
                    currency: "USD"
                  };
                }),
              };
            }
            else if (serviceName === 'order') {
              return {
                find: jest.fn().mockImplementation((query: any) => {
                  // Mock implementation for the 'order' service
                  return [{ /* mock order data here based on query */ }];
                }),
                update: jest.fn().mockImplementation((orderId: string, updatedData: any) => {
                  // Mock implementation for updating an order
                  return updatedData;
                }),
                create: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'order' service
                  return [{ /* mock order data here based on query */ }];
                }),
              };
            }
            else if (serviceName === 'gmail') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'gmail' service
                  return [{ /* mock gmail data here */ }];
                }),
              };
            }
            else if (serviceName === 'paypalsetup') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'paypalsetup' service
                  return {
                    live: false,
                    live_paypal_client_id: 'your_live_client_id',
                    live_paypal_client_secret: 'your_live_client_secret',
                    sandbox_paypal_client_id: 'your_sandbox_client_id',
                    sandbox_paypal_client_secret: 'your_sandbox_client_secret',
                  };
                }),
              };
            }
            return {};
          }),
        }),
      };
      jest.spyOn(axios, 'post').mockResolvedValue({
        status: 200,
        data: {
          id: 'test_order_id',
          status: 'CREATED',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: '100.00',
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: '80.00',
                  },
                  shipping: {
                    currency_code: 'USD',
                    value: '20.00',
                  },
                },
              },
              items: [
                {
                  name: 'Product 1',
                  description: 'Description for Product 1',
                  SKU: 'SKU_001',
                  unit_amount: {
                    currency_code: 'USD',
                    value: '40.00',
                  },
                  quantity: 2,
                },
              ],
            },
          ],
        },
      });
      // Call the createOrder function with the mocked strapi object
      const result = await createOrder({ cart: [{ id: "1", quantity: 2 }], country_code: "USD" }, strapi);

      // Add your assertions based on the expected behavior of createOrder with live as false
      expect(result.status).toEqual('CREATED');
      // Add more assertions as needed
    });


  });

  describe('handleResponse', () => {
    it('throws an error with the error message from response.text()', async () => {
      // Mock a failed response with status code 400 and an error message
      const errorResponse = {
        status: 400,
        text: jest.fn().mockResolvedValue('This is an error message from the server'),
      };

      // Call the handleResponse function with the mocked response
      await expect(handleResponse(errorResponse)).rejects.toThrowError(
        'This is an error message from the server'
      );

      // Clean up the mocks
      jest.restoreAllMocks();
    });
  });

});
