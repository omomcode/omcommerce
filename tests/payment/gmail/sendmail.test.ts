const nodemailer = require('nodemailer');
import { google } from 'googleapis';
import { sendMail } from '../../../server/services/sendmail';

jest.mock('nodemailer');
jest.mock('googleapis');

describe('sendMail function', () => {
  let strapi: any;
  let gmailConfig: any;

  beforeEach(() => {
    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          find: jest.fn().mockResolvedValue({ rate: 1, spread: 0.025 }), // Mock the conversionrate service
        }),
      }),
    };

    gmailConfig = {
      client_id: 'mockClientId',
      client_secret: 'mockClientSecret',
      refresh_token: 'mockRefreshToken',
      from: 'mock@gmail.com',
    };

    // Mock the OAuth2 client
    // @ts-ignore
    google.auth.OAuth2 = jest.fn().mockImplementation(() => ({
      setCredentials: jest.fn(),
      getAccessToken: jest.fn().mockResolvedValue('mockAccessToken'),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send mail successfully', async () => {
    // Arrange
    const mockOrder = {
      customer_name: 'John',
      customer_surname: 'Doe',
      address_line_1: '123 Main St',
      postal_code: '12345',
      admin_area_2: 'City',
      email: 'john.doe@example.com',
      amount: 100.00,
      discount: 10.00,
      shipping_fee: 5.00,
      items: [
        { name: 'Product 1', quantity: 2, unit_amount: { value: '20.00', currency_code: 'RSD' } },
        { name: 'Product 2', quantity: 1, unit_amount: { value: '30.00', currency_code: 'RSD' } },
        // Add more items as needed
      ],
    };

    const mockMessage = 'Thank you for your purchase!';
    const mockTransportSendMail = jest.fn().mockResolvedValue('Mail sent successfully');

    // Mock nodemailer.createTransport
    nodemailer.createTransport.mockReturnValue({
      sendMail: mockTransportSendMail,
    });

    // Act
    const result = await sendMail(mockOrder, mockMessage, strapi, gmailConfig);

    // Assert
    expect(result).toEqual('Mail sent successfully');
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: gmailConfig.from,
        clientId: gmailConfig.client_id,
        clientSecret: gmailConfig.client_secret,
        refreshToken: gmailConfig.refresh_token,
        accessToken: 'mockAccessToken',
      },
    });
    expect(mockTransportSendMail).toHaveBeenCalled();
  });

  it('should send mail successfully with null as discount', async () => {
    // Arrange
    const mockOrder = {
      customer_name: 'John',
      customer_surname: 'Doe',
      address_line_1: '123 Main St',
      postal_code: '12345',
      admin_area_2: 'City',
      email: 'john.doe@example.com',
      amount: 100.00,
      discount: 10.00,
      shipping_fee: 5.00,
      items: [
        { name: 'Product 1', quantity: 2, unit_amount: { value: '20.00', currency_code: 'RSD' } },
        { name: 'Product 2', quantity: 1, unit_amount: { value: '30.00', currency_code: 'RSD' } },
        // Add more items as needed
      ],
    };

    const mockMessage = 'Thank you for your purchase!';
    const mockTransportSendMail = jest.fn().mockResolvedValue('Mail sent successfully');

    // Mock nodemailer.createTransport
    nodemailer.createTransport.mockReturnValue({
      sendMail: mockTransportSendMail,
    });

    // Act
    const result = await sendMail(mockOrder, mockMessage, strapi, gmailConfig);

    // Assert
    expect(result).toEqual('Mail sent successfully');
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: gmailConfig.from,
        clientId: gmailConfig.client_id,
        clientSecret: gmailConfig.client_secret,
        refreshToken: gmailConfig.refresh_token,
        accessToken: 'mockAccessToken',
      },
    });
    expect(mockTransportSendMail).toHaveBeenCalled();
  });

  it('should handle error during mail sending', async () => {
    // Arrange
    const mockOrder = {
      customer_name: 'John',
      customer_surname: 'Doe',
      address_line_1: '123 Main St',
      postal_code: '12345',
      admin_area_2: 'City',
      email: 'john.doe@example.com',
      amount: 100.00,
      discount: null,
      shipping_fee: 5.00,
      items: [
        { name: 'Product 1', quantity: 2, unit_amount: { value: '20.00', currency_code: 'RSD' } },
        { name: 'Product 2', quantity: 1, unit_amount: { value: '30.00', currency_code: 'RSD' } },
        // Add more items as needed
      ],
    };

    const mockMessage = 'Thank you for your purchase!';
    const mockTransportSendMail = jest.fn().mockRejectedValue(new Error('Mail sending failed'));

    // Mock nodemailer.createTransport
    nodemailer.createTransport.mockReturnValue({
      sendMail: mockTransportSendMail,
    });

    // Act
    const result = await sendMail(mockOrder, mockMessage, strapi, gmailConfig);

    // Assert
    expect(result).toEqual(new Error('Mail sending failed'));
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: gmailConfig.from,
        clientId: gmailConfig.client_id,
        clientSecret: gmailConfig.client_secret,
        refreshToken: gmailConfig.refresh_token,
        accessToken: 'mockAccessToken',
      },
    });
    expect(mockTransportSendMail).toHaveBeenCalled();
  });
});
