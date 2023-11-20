import paymentService from '../../../server/services/payment';
import { capturePayment, createOrder } from '../../../server/utils/payment/paypalPaymentHelper';

jest.mock('../../../server/utils/payment/paypalPaymentHelper');
jest.mock('axios');

describe('Payment Service', () => {
  let strapi: { plugin: any };

  beforeEach(() => {
    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          // You can add more mock implementations if needed
        }),
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should capture payment successfully', async () => {
    // Arrange
    const mockData = { orderID: 'mockOrderID' };
    const expectedResponse = { success: true };

    // Mock the capturePayment function
    (capturePayment as jest.Mock).mockResolvedValueOnce(expectedResponse);

    // Act
    // @ts-ignore
    const result = await paymentService({ strapi }).capture(mockData);

    // Assert
    expect(result).toEqual(JSON.stringify(expectedResponse));
    expect(capturePayment).toHaveBeenCalledWith(mockData.orderID, strapi);
  });

  it('should handle error during payment capture', async () => {
    // Arrange
    const mockData = { orderID: 'mockOrderID' };
    const expectedError = new Error('Simulated capture error');

    // Mock the capturePayment function to throw an error
    (capturePayment as jest.Mock).mockRejectedValueOnce(expectedError);

    // Act
    // @ts-ignore
    const result = await paymentService({ strapi }).capture(mockData);

    // Assert
    expect(result).toEqual(JSON.stringify({ error: 'Failed to capture order.' }));
    expect(capturePayment).toHaveBeenCalledWith(mockData.orderID, strapi);
  });

  it('should create order successfully', async () => {
    // Arrange
    const mockData = { /* Replace with your expected request data */ };
    const expectedResponse = { success: true };

    // Mock the createOrder function
    (createOrder as jest.Mock).mockResolvedValueOnce(expectedResponse);

    // Act
    // @ts-ignore
    const result = await paymentService({ strapi }).orders(mockData);

    // Assert
    expect(result).toEqual(JSON.stringify(expectedResponse));
    expect(createOrder).toHaveBeenCalledWith(mockData, strapi);
  });

  it('should handle error during order creation', async () => {
    // Arrange
    const mockData = { /* Replace with your expected request data */ };
    const expectedError = new Error('Simulated create order error');

    // Mock the createOrder function to throw an error
    (createOrder as jest.Mock).mockRejectedValueOnce(expectedError);

    // Act
    // @ts-ignore
    const result = await paymentService({ strapi }).orders(mockData);

    // Assert
    expect(result).toEqual(JSON.stringify({ error: 'Failed to create order.' }));
    expect(createOrder).toHaveBeenCalledWith(mockData, strapi);
  });
});
