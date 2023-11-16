import paypalService from '../../../server/services/paypal';
import { IPaypal } from '../../../types/paypal';

describe('PayPal Service', () => {
  let strapi: { entityService: any };

  beforeEach(async () => {
    strapi = {
      entityService: {
        findOne: jest.fn().mockImplementation((model: string, query: any) => {
          return {
            id: 1,
            live_paypal_client_id: 'UPDATED_CLIENT_ID',
            live: true,
          };
        }),
      },
    };
  });

  it('should find PayPal information', async () => {

    const query = {};
    // @ts-ignore
    const result: IPaypal = await paypalService({ strapi }).settings(query);
    expect(strapi.entityService.findOne).toBeCalledTimes(1);
    expect(result).toEqual(
      {
        live_paypal_client_id: 'UPDATED_CLIENT_ID',
        live: true,
      },
    );
  });

  it('should throw an error when strapi.entityService is not defined (find)', async () => {
    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // @ts-ignore
    await expect(paypalService({ strapi }).settings()).rejects.toThrow('strapi.entityService is not defined');
  });
});
