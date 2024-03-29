import axios from 'axios';
import { capturePayment, createOrder, generateAccessToken, handleResponse} from '../../../server/utils/payment/paypalPaymentHelper'
import {sendMail} from "../../../server/services/sendmail";
import {IProduct} from "../../../types/product";
import {ITaxes} from "../../../types/taxes";
import {IShippingZone} from "../../../types/zonetable";
import productService from "../../../server/services/product";
import {IShippingRate} from "../../../types/rate";
import Countries from "../../../admin/src/components/Shipping/Countries/Countries";
// Import other dependencies or mocks as needed

jest.mock('axios');

describe('Payment Service', () => {
  let strapi: { entityService: any, plugin: any };
  let productData: IProduct;
  beforeEach(() => {
      // @ts-ignore
    productData = {
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
    }]}]
        , // Replace with the actual shipping zone IDs
          categories: [1, 2], // Replace with the actual category IDs
          subcategory: 1, // Replace with the actual subcategory ID
      };

    strapi = {
      entityService: {
        findMany: jest.fn(),
        findOne: jest.fn(),
          update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
              return { data: {
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
                  omcommerce_tax: 1, // Replace with the actual tax ID
                  omcommerce_shippingzones: [1, 2], // Replace with the actual shipping zone IDs
                  categories: [1, 2], // Replace with the actual category IDs
                  subcategory: 1, // Replace with the actual subcategory ID
                }};
          }),
      },
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockImplementation((serviceName: string) => {
          if (serviceName === 'product') {
            return {
              find: jest.fn().mockImplementation((data: any) => {
                // Mock implementation for the 'product' service
                return [{id: 1, title: 'Product 1',
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
                  omcommerce_tax: 1, // Assuming the ID of the associated tax record
                  omcommerce_shippingzones: [1, 2], // Assuming the IDs of the associated shipping zones
                  categories: [3, 4], // Assuming the IDs of the associated categories
                  subcategory: 5, // Assuming the ID of the associated subcategory
                  amount_value_converted: 25.0,
                  amount_value_converted_currency_code: 'EUR',},
                  {id: 2, amount_value: 5,
                  title: "some other product", weight : 5, Quantity: 5, slug: "prod2",
                    chargeTax: false, showQuantity: false}];
              }),
            };
          }
          else if (serviceName === 'shippingcalculator') {
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

                return [{
                  "id": "test_order_id",
                  "status": "CREATED",
                  "purchase_units": [
                    {
                      "amount": {
                        "currency_code": "USD",
                        "value": "100.00",
                        "breakdown": {
                          "item_total": {
                            "currency_code": "USD",
                            "value": "80.00"
                          },
                          "shipping": {
                            "currency_code": "USD",
                            "value": "20.00"
                          }
                        }
                      },
                    }
                  ],
                  "items": [
                    {
                      "name": "Product 1",
                      "description": "Description for Product 1",
                      "SKU": "SKU_001",
                      "unit_amount": {
                        "currency_code": "USD",
                        "value": "40.00"
                      },
                      "quantity": 2
                    }
                  ]
                }
                ];
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
                return {
                  client_id: 'mockClientId',
                  client_secret: 'mockClientSecret',
                  refresh_token: 'mockRefreshToken',
                  from: 'mock@gmail.com',
                  languageRadio: 'English'
                };
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
          update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
            return { data: {
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
                omcommerce_tax: 1, // Replace with the actual tax ID
                omcommerce_shippingzones: [1, 2], // Replace with the actual shipping zone IDs
                categories: [1, 2], // Replace with the actual category IDs
                subcategory: 1, // Replace with the actual subcategory ID
              }};
          }),
        },
        plugin: jest.fn().mockReturnValue({
          service: jest.fn().mockImplementation((serviceName: string) => {
            if (serviceName === 'product') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'product' service
                  return [{id: 1, title: 'Product 1',
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
                    omcommerce_tax: 1, // Assuming the ID of the associated tax record
                    omcommerce_shippingzones: [1, 2], // Assuming the IDs of the associated shipping zones
                    categories: [3, 4], // Assuming the IDs of the associated categories
                    subcategory: 5, // Assuming the ID of the associated subcategory
                    amount_value_converted: 25.0,
                    amount_value_converted_currency_code: 'EUR',},
                    {id: 2, amount_value: 5,
                      title: "some other product", weight : 5, Quantity: 5, slug: "prod2",
                      chargeTax: false, showQuantity: false}];
                }),
              };
            }
            else if (serviceName === 'shippingcalculator') {
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

                  return [{
                    "id": "test_order_id",
                    "status": "CREATED",
                    "purchase_units": [
                      {
                        "amount": {
                          "currency_code": "USD",
                          "value": "100.00",
                          "breakdown": {
                            "item_total": {
                              "currency_code": "USD",
                              "value": "80.00"
                            },
                            "shipping": {
                              "currency_code": "USD",
                              "value": "20.00"
                            }
                          }
                        },
                      }
                    ],
                    "items": [
                      {
                        "name": "Product 1",
                        "description": "Description for Product 1",
                        "SKU": "SKU_001",
                        "unit_amount": {
                          "currency_code": "USD",
                          "value": "40.00"
                        },
                        "quantity": 2
                      }
                    ]
                  }
                  ];
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
                  return {
                    client_id: 'mockClientId',
                    client_secret: 'mockClientSecret',
                    refresh_token: 'mockRefreshToken',
                    from: 'mock@gmail.com',
                    languageRadio: 'English'
                  };
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
            // Add more conditions for other services as needed

            // Default case, return an empty object if the service is not recognized
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
    it('should throw an error when there are no valid PayPal credentials', async () => {

      // Arrange
      // Mock PayPal credentials to be invalid (return null data)
      const strapi2 = {
        plugin: jest.fn().mockReturnValue({
          service: jest.fn().mockImplementation((serviceName: string) => {
            if (serviceName === 'paypalsetup') {
              return {
                find: jest.fn().mockResolvedValue(null), // Ensure it resolves to null
              };
            }
            // Add more conditions for other services as needed
            return {};
          }),
        })
      }


      const orderID = "1";

      // Act and Assert
      await expect(capturePayment(orderID, strapi2)).rejects.toEqual(new Error("No valid paypal credentials"));
    });
    it('should throw an error when when could not be fetched', async () => {

      // Arrange
      const strapi2 = {
        plugin: jest.fn().mockReturnValue({
          service: jest.fn().mockImplementation((serviceName: string) => {
            if (serviceName === 'product') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'product' service
                  return [{id: 1, title: 'Product 1',
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
                    omcommerce_tax: 1, // Assuming the ID of the associated tax record
                    omcommerce_shippingzones: [1, 2], // Assuming the IDs of the associated shipping zones
                    categories: [3, 4], // Assuming the IDs of the associated categories
                    subcategory: 5, // Assuming the ID of the associated subcategory
                    amount_value_converted: 25.0,
                    amount_value_converted_currency_code: 'EUR',},
                    {id: 2, amount_value: 5,
                      title: "some other product", weight : 5, Quantity: 5, slug: "prod2",
                      chargeTax: false, showQuantity: false}];
                }),
              };
            }
            else if (serviceName === 'paypalsetup') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
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
            else if (serviceName === 'order') {
              return {
                find: jest.fn().mockImplementation((query: any) => {
                  // Mock implementation for the 'order' service

                  return null;
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
            // Add more conditions for other services as needed
            return {};
          }),
        })
      }
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

      const orderID = "1";

      // Act and Assert
      await expect(capturePayment(orderID, strapi2)).rejects.toEqual(new Error("Order data could not be fetched"));
    });
    it('should throw an error when when  could not update product quantity', async () => {

      // Arrange
      const strapi2 = {
        plugin: jest.fn().mockReturnValue({
          service: jest.fn().mockImplementation((serviceName: string) => {
            if (serviceName === 'product') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'product' service
                  return null
                }),
              };
            }
            else if (serviceName === 'paypalsetup') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
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
            else if (serviceName === 'order') {
              return {
                find: jest.fn().mockImplementation((query: any) => {
                  // Mock implementation for the 'order' service

                  return [{
                    "id": "test_order_id",
                    "status": "CREATED",
                    "purchase_units": [
                      {
                        "amount": {
                          "currency_code": "USD",
                          "value": "100.00",
                          "breakdown": {
                            "item_total": {
                              "currency_code": "USD",
                              "value": "80.00"
                            },
                            "shipping": {
                              "currency_code": "USD",
                              "value": "20.00"
                            }
                          }
                        },
                        "items": [
                          {
                            "name": "Product 1",
                            "description": "Description for Product 1",
                            "SKU": "SKU_001",
                            "unit_amount": {
                              "currency_code": "USD",
                              "value": "40.00"
                            },
                            "quantity": 2
                          }
                        ]
                      }
                    ]
                  }
                  ];
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
            // Add more conditions for other services as needed
            return {};
          }),
        })
      }
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

      const orderID = "1";

      // Act and Assert
      await expect(capturePayment(orderID, strapi2)).rejects.toEqual(new Error("Invalid products data"));
    });
    it('should throw an error when sender email data is invalid', async () => {

      // Arrange
      const strapi2 = {
        entityService: {
          update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
            return { data: {
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
                omcommerce_tax: 1, // Replace with the actual tax ID
                omcommerce_shippingzones: [1, 2], // Replace with the actual shipping zone IDs
                categories: [1, 2], // Replace with the actual category IDs
                subcategory: 1, // Replace with the actual subcategory ID
              }};
          }),
        },
        plugin: jest.fn().mockReturnValue({
          service: jest.fn().mockImplementation((serviceName: string) => {
            if (serviceName === 'product') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'product' service
                  return [{id: 1, title: 'Product 1',
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
                    omcommerce_tax: 1, // Assuming the ID of the associated tax record
                    omcommerce_shippingzones: [1, 2], // Assuming the IDs of the associated shipping zones
                    categories: [3, 4], // Assuming the IDs of the associated categories
                    subcategory: 5, // Assuming the ID of the associated subcategory
                    amount_value_converted: 25.0,
                    amount_value_converted_currency_code: 'EUR',},
                  ];
                }),
              };
            }
            else if (serviceName === 'shippingcalculator') {
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

                  return [{
                    "id": "test_order_id",
                    "status": "CREATED",
                    "purchase_units": [
                      {
                        "amount": {
                          "currency_code": "USD",
                          "value": "100.00",
                          "breakdown": {
                            "item_total": {
                              "currency_code": "USD",
                              "value": "80.00"
                            },
                            "shipping": {
                              "currency_code": "USD",
                              "value": "20.00"
                            }
                          }
                        },
                      }
                    ],
                    "items": [
                      {
                        "name": "Product 1",
                        "description": "Description for Product 1",
                        "SKU": "SKU_001",
                        "unit_amount": {
                          "currency_code": "USD",
                          "value": "40.00"
                        },
                        "quantity": 2
                      }
                    ]
                  }
                  ];
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
                  return null;
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
            return {};
          }),
        })
      }
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

      const orderID = "1";

      // Act and Assert
      await expect(capturePayment(orderID, strapi2)).rejects.toEqual(new Error("Sender email data invalid"));
    });
    it('should throw an error when order could not be completed', async () => {

      // Arrange
      const strapi2 = {
        entityService: {
          update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
            return { data: {
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
                omcommerce_tax: 1, // Replace with the actual tax ID
                omcommerce_shippingzones: [1, 2], // Replace with the actual shipping zone IDs
                categories: [1, 2], // Replace with the actual category IDs
                subcategory: 1, // Replace with the actual subcategory ID
              }};
          }),
        },
        plugin: jest.fn().mockReturnValue({
          service: jest.fn().mockImplementation((serviceName: string) => {
            if (serviceName === 'product') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'product' service
                  return [{id: 1, title: 'Product 1',
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
                    omcommerce_tax: 1, // Assuming the ID of the associated tax record
                    omcommerce_shippingzones: [1, 2], // Assuming the IDs of the associated shipping zones
                    categories: [3, 4], // Assuming the IDs of the associated categories
                    subcategory: 5, // Assuming the ID of the associated subcategory
                    amount_value_converted: 25.0,
                    amount_value_converted_currency_code: 'EUR',},
                    {id: 2, amount_value: 5,
                      title: "some other product", weight : 5, Quantity: 5, slug: "prod2",
                      chargeTax: false, showQuantity: false}];
                }),
              };
            }
            else if (serviceName === 'shippingcalculator') {
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

                  return [{
                    "id": "test_order_id",
                    "status": "CREATED",
                    "purchase_units": [
                      {
                        "amount": {
                          "currency_code": "USD",
                          "value": "100.00",
                          "breakdown": {
                            "item_total": {
                              "currency_code": "USD",
                              "value": "80.00"
                            },
                            "shipping": {
                              "currency_code": "USD",
                              "value": "20.00"
                            }
                          }
                        },
                      }
                    ],
                    "items": [
                      {
                        "name": "Product 1",
                        "description": "Description for Product 1",
                        "SKU": "SKU_001",
                        "unit_amount": {
                          "currency_code": "USD",
                          "value": "40.00"
                        },
                        "quantity": 2
                      }
                    ]
                  }
                  ];
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
                  return {
                    client_id: 'mockClientId',
                    client_secret: 'mockClientSecret',
                    refresh_token: 'mockRefreshToken',
                    from: 'mock@gmail.com',
                  };
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
            return {};
          }),
        })
      }
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
          items: [
            {
              name: "Product 1",
              description: "Description for Product 1",
              SKU: "SKU_001",
              unit_amount: {
                currency_code: "USD",
                value: "40.00"
              },
              quantity: 2
            }
          ],
          status: 'NOT COMPLETED',
        },
      });

      const orderID = "1";

      // Act and Assert
      await expect(capturePayment(orderID, strapi2)).rejects.toEqual(new Error("Order could not be completed"));
    });
    it('should throw an error when order could not be captured', async () => {

      // Arrange
      const strapi2 = {
        entityService: {
          update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
            return { data: {
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
                omcommerce_tax: 1, // Replace with the actual tax ID
                omcommerce_shippingzones: [1, 2], // Replace with the actual shipping zone IDs
                categories: [1, 2], // Replace with the actual category IDs
                subcategory: 1, // Replace with the actual subcategory ID
              }};
          }),
        },
        plugin: jest.fn().mockReturnValue({
          service: jest.fn().mockImplementation((serviceName: string) => {
            if (serviceName === 'product') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'product' service
                  return [{id: 1, title: 'Product 1',
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
                    omcommerce_tax: 1, // Assuming the ID of the associated tax record
                    omcommerce_shippingzones: [1, 2], // Assuming the IDs of the associated shipping zones
                    categories: [3, 4], // Assuming the IDs of the associated categories
                    subcategory: 5, // Assuming the ID of the associated subcategory
                    amount_value_converted: 25.0,
                    amount_value_converted_currency_code: 'EUR',},
                    {id: 2, amount_value: 5,
                      title: "some other product", weight : 5, Quantity: 5, slug: "prod2",
                      chargeTax: false, showQuantity: false}];
                }),
              };
            }
            else if (serviceName === 'shippingcalculator') {
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

                  return [{
                    "id": "test_order_id",
                    "status": "CREATED",
                    "purchase_units": [
                      {
                        "amount": {
                          "currency_code": "USD",
                          "value": "100.00",
                          "breakdown": {
                            "item_total": {
                              "currency_code": "USD",
                              "value": "80.00"
                            },
                            "shipping": {
                              "currency_code": "USD",
                              "value": "20.00"
                            }
                          }
                        },
                        "items": [
                          {
                            "name": "Product 1",
                            "description": "Description for Product 1",
                            "SKU": "SKU_001",
                            "unit_amount": {
                              "currency_code": "USD",
                              "value": "40.00"
                            },
                            "quantity": 2
                          }
                        ]
                      }
                    ]
                  }
                  ];
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
                  return {
                    client_id: 'mockClientId',
                    client_secret: 'mockClientSecret',
                    refresh_token: 'mockRefreshToken',
                    from: 'mock@gmail.com',
                  };
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
            return {};
          }),
        })
      }
      jest.spyOn(axios, 'post').mockResolvedValue(null);

      const orderID = "1";

      // Act and Assert
      await expect(capturePayment(orderID, strapi2)).rejects.toEqual(new Error("Order could not be captured"));
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
                  Quantity: 2,
                },
              ],
            },
          ],
          "items": [
            {
              "name": "Product 1",
              "description": "Description for Product 1",
              "SKU": "SKU_001",
              "unit_amount": {
                "currency_code": "USD",
                "value": "40.00"
              },
              "quantity": 2
            }
          ]
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
      const result = await createOrder({ cart: [{ id: "1", quantity: 2 }] , country_code:"USD"}, strapi);

      // Expect that console.error was called with the expected error message
      // expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', expect.any(Error));
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Error'), expect.any(Error));


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
    it('should throw an error when there are no valid PayPal credentials on create', async () => {

      // Arrange
      // Mock PayPal credentials to be invalid (return null data)
      const strapi2 = {
        plugin: jest.fn().mockReturnValue({
          service: jest.fn().mockImplementation((serviceName: string) => {
            if (serviceName === 'paypalsetup') {
              return {
                find: jest.fn().mockResolvedValue(null), // Ensure it resolves to null
              };
            }
            // Add more conditions for other services as needed
            return {};
          }),
        })
      }
      // Act and Assert
      await expect(createOrder({ cart: [{ id: "1", quantity: 2 }] , country_code:"USD"}, strapi2)).rejects.toEqual(new Error("No valid paypal credentials"));
    });
    it('should throw an error when cart data is not valid', async () => {
      await expect(createOrder({ cart: null , country_code:"USD"}, strapi)).rejects.toEqual(new Error("Invalid data"));
    });
    it('should throw an error when there are no valid products data', async () => {

      // Arrange
      // Mock PayPal credentials to be invalid (return null data)
      const strapi2 = {
        plugin: jest.fn().mockReturnValue({
          service: jest.fn().mockImplementation((serviceName: string) => {
            if (serviceName === 'product') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'product' service
                  return null;
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
            return {};
          }),
        })
      }
      // Act and Assert
      await expect(createOrder({ cart: [{ id: "1", quantity: 2 }] , country_code:"USD"}, strapi2)).rejects.toEqual(new Error("Invalid products data"));
    });
    it('should throw an error when there are no valid products data matched', async () => {

      // Arrange
      // Mock PayPal credentials to be invalid (return null data)
      const strapi2 = {
        plugin: jest.fn().mockReturnValue({
          service: jest.fn().mockImplementation((serviceName: string) => {
            if (serviceName === 'product') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'product' service
                  return [{id: 1, title: 'Product 1',
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
                    omcommerce_tax: 1, // Assuming the ID of the associated tax record
                    omcommerce_shippingzones: [1, 2], // Assuming the IDs of the associated shipping zones
                    categories: [3, 4], // Assuming the IDs of the associated categories
                    subcategory: 5, // Assuming the ID of the associated subcategory
                    amount_value_converted: 25.0,
                    amount_value_converted_currency_code: 'EUR',},
                    {id: 2, amount_value: 5,
                      title: "some other product", weight : 5, Quantity: 5, slug: "prod2",
                      chargeTax: false, showQuantity: false}];
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
            return {};
          }),
        })
      }
      // Act and Assert
      await expect(createOrder({ cart: [{ id: "1111", quantity: 2 }] , country_code:"USD"}, strapi2)).rejects.toEqual(new Error("No matching products found"));
    });
    it('should throw an error when there are not enough product in stock', async () => {

      // Arrange
      // Mock PayPal credentials to be invalid (return null data)
      const strapi2 = {
        plugin: jest.fn().mockReturnValue({
          service: jest.fn().mockImplementation((serviceName: string) => {
            if (serviceName === 'product') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'product' service
                  return [{id: 1, title: 'Product1',
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
                    omcommerce_tax: 1, // Assuming the ID of the associated tax record
                    omcommerce_shippingzones: [1, 2], // Assuming the IDs of the associated shipping zones
                    categories: [3, 4], // Assuming the IDs of the associated categories
                    subcategory: 5, // Assuming the ID of the associated subcategory
                    amount_value_converted: 25.0,
                    amount_value_converted_currency_code: 'EUR',},
                    {id: 2, amount_value: 5,
                      title: "some other product", weight : 5, Quantity: 5, slug: "prod2",
                      chargeTax: false, showQuantity: false}];
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
            else if (serviceName === 'shippingcalculator') {
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
            // Add more conditions for other services as needed
            return {};
          }),
        })
      }
      // Act and Assert
      await expect(createOrder({ cart: [{ id: "1", quantity: 101 }] , country_code:"USD"}, strapi2)).rejects.toEqual(new Error("Not enough Product1 in stock"));
    });
    // it('should throw an error when there are no valid shipping amount data', async () => {
    //
    //   // Arrange
    //   // Mock PayPal credentials to be invalid (return null data)
    //   const strapi2 = {
    //     plugin: jest.fn().mockReturnValue({
    //       service: jest.fn().mockImplementation((serviceName: string) => {
    //         if (serviceName === 'product') {
    //           return {
    //             find: jest.fn().mockImplementation((data: any) => {
    //               // Mock implementation for the 'product' service
    //               return [{id: 1, title: 'Product1',
    //                 slug: 'test-product',
    //                 description: 'This is a test product',
    //                 SKU: 'ABC123',
    //                 amount_currency_code: 'USD',
    //                 amount_value: 19.99,
    //                 tax_currency_code: 'USD',
    //                 tax_value: 2.0,
    //                 media: ['image1.jpg', 'image2.jpg'],
    //                 compare_at_price: '29.99',
    //                 cost_per_item: '15.00',
    //                 chargeTax: true,
    //                 Quantity: 100,
    //                 Barcode: '123456789',
    //                 showQuantity: true,
    //                 weight: 1.5,
    //                 measurement_unit: 'kg',
    //                 omcommerce_tax: 1, // Assuming the ID of the associated tax record
    //                 omcommerce_shippingzones: [1, 2], // Assuming the IDs of the associated shipping zones
    //                 categories: [3, 4], // Assuming the IDs of the associated categories
    //                 subcategory: 5, // Assuming the ID of the associated subcategory
    //                 amount_value_converted: 25.0,
    //                 amount_value_converted_currency_code: 'EUR',},
    //                 {id: 2, amount_value: 5,
    //                   title: "some other product", weight : 5, Quantity: 5, slug: "prod2",
    //                   chargeTax: false, showQuantity: false}];
    //             }),
    //           };
    //         }
    //         else if (serviceName === 'paypalsetup') {
    //           return {
    //             find: jest.fn().mockImplementation((data: any) => {
    //               // Mock implementation for the 'paypalsetup' service
    //               return {
    //                 live: true,
    //                 live_paypal_client_id: 'your_live_client_id',
    //                 live_paypal_client_secret: 'your_live_client_secret',
    //                 sandbox_paypal_client_id: 'your_sandbox_client_id',
    //                 sandbox_paypal_client_secret: 'your_sandbox_client_secret',
    //               };
    //             }),
    //           };
    //         }
    //         else if (serviceName === 'currency') {
    //           return {
    //             find: jest.fn().mockImplementation((data: any) => {
    //               // Mock implementation for the 'shippingzone' service
    //               return {
    //                 currency: "USD"
    //               };
    //             }),
    //           };
    //         }
    //         else if (serviceName === 'shippingcalculator') {
    //           return {
    //             calculate: jest.fn().mockImplementation((data: any) => {
    //               // Mock implementation for the 'shippingzone' service
    //               return null;
    //             }),
    //           };
    //         }
    //         // Add more conditions for other services as needed
    //         return {};
    //       }),
    //     })
    //   }
    //   // Act and Assert
    //   await expect(createOrder({ cart: [{ id: "1", quantity: 1 }] , country_code:"USD"}, strapi2)).rejects.toEqual(new Error("No valid shipping amount data"));
    // });
    it('should throw an error when there are no valid currency data', async () => {

      // Arrange
      // Mock PayPal credentials to be invalid (return null data)
      const strapi2 = {
        plugin: jest.fn().mockReturnValue({
          service: jest.fn().mockImplementation((serviceName: string) => {
            if (serviceName === 'product') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'product' service
                  return [{id: 1, title: 'Product1',
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
                    omcommerce_tax: 1, // Assuming the ID of the associated tax record
                    omcommerce_shippingzones: [1, 2], // Assuming the IDs of the associated shipping zones
                    categories: [3, 4], // Assuming the IDs of the associated categories
                    subcategory: 5, // Assuming the ID of the associated subcategory
                    amount_value_converted: 25.0,
                    amount_value_converted_currency_code: 'EUR',},
                    {id: 2, amount_value: 5,
                      title: "some other product", weight : 5, Quantity: 5, slug: "prod2",
                      chargeTax: false, showQuantity: false}];
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
            else if (serviceName === 'currency') {
              return {
                find: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'shippingzone' service
                  return {
                    currency: null
                  };
                }),
              };
            }
            else if (serviceName === 'shippingcalculator') {
              return {
                calculate: jest.fn().mockImplementation((data: any) => {
                  // Mock implementation for the 'shippingzone' service
                  return 200;
                }),
              };
            }
            // Add more conditions for other services as needed
            return {};
          }),
        })
      }
      // Act and Assert
      await expect(createOrder({ cart: [{ id: "1", quantity: 1 }] , country_code:"USD"}, strapi2)).rejects.toEqual(new Error("No valid currency data"));
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
