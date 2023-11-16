import legalController from '../../../server/controllers/legal';
import { ILegal } from '../../../types/legal';

describe('Legal Controller', () => {
  let strapi: { plugin: any };
  let legalData: ILegal;

  beforeEach(() => {
    legalData = {
      id: 1,
      checked: true,
      returnRules: 'Some return rules',
      returnShippingCost: 'Free',
      returnWindow: '30 days',
      restockingFee: 5,
      returnPolicy: 'Flexible return policy',
      privacyPolicy: 'Our privacy policy',
      termsOfService: 'Terms of service',
      shippingPolicy: 'Shipping policy',
      online: 'Online terms',
    };

    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            data: [legalData],
          }),
          create: jest.fn().mockReturnValue({
            data: legalData,
          }),
          update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
            return { data: { ...legalData, ...data } };
          }),
        }),
      }),
    };
  });

  it('should find legal information', async () => {
    const ctx = {
      query: {},
      body: null,
    };

    // @ts-ignore
    const result = await legalController({ strapi }).find(ctx);

    // Expect the body to contain the mock data
    expect(result.data).toEqual([legalData]);

    // Expect find to be called once
    expect(strapi.plugin('omcommerce').service('legal').find).toBeCalledTimes(1);
  });

  it('should throw an error when finding legal information', async () => {
    const ctx = {
      query: {},
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the find method
    strapi.plugin('omcommerce').service('legal').find.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await legalController({ strapi }).find(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });

  it('should create legal information', async () => {
    const newLegalData = {
      checked: true,
      returnRules: 'Some return rules',
      returnShippingCost: 'Free',
      returnWindow: '30 days',
      restockingFee: 5,
      returnPolicy: 'Flexible return policy',
      privacyPolicy: 'Our privacy policy',
      termsOfService: 'Terms of service',
      shippingPolicy: 'Shipping policy',
      online: 'Online terms',
    };

    const ctx: any = {
      request: { body: newLegalData },
      body: null,
    };

    // @ts-ignore
    await legalController({ strapi }).create(ctx);

    // Use type assertion to inform TypeScript that ctx.body is not null
    expect(ctx.body!.data).toEqual({
      id: 1,
      ...newLegalData,
    });

    // Expect create to be called once
    expect(strapi.plugin('omcommerce').service('legal').create).toBeCalledTimes(1);
  });

  it('should throw an error when creating legal information', async () => {
    const newLegalData = {
      checked: true,
      returnRules: 'Some return rules',
      returnShippingCost: 'Free',
      returnWindow: '30 days',
      restockingFee: 5,
      returnPolicy: 'Flexible return policy',
      privacyPolicy: 'Our privacy policy',
      termsOfService: 'Terms of service',
      shippingPolicy: 'Shipping policy',
      online: 'Online terms',
    };

    const ctx: any = {
      request: { body: newLegalData },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the create method
    strapi.plugin('omcommerce').service('legal').create.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await legalController({ strapi }).create(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });

  it('should update legal information', async () => {
    const updateData = {
      id: 1,
      checked: true,
      returnRules: 'Some return rules',
      returnShippingCost: 'Free',
      returnWindow: '30 days',
      restockingFee: 5,
      returnPolicy: 'Flexible return policy',
      privacyPolicy: 'Our privacy policy',
      termsOfService: 'Terms of service',
      shippingPolicy: 'Shipping policy',
      online: 'Online terms',
    };

    const ctx: any = {
      params: { id: 1 },
      request: { body: updateData },
      body: null,
    };

    // @ts-ignore
    await legalController({ strapi }).update(ctx);

    // Corrected expectation without duplicating the 'id' property
    expect(ctx.body!.data).toEqual({ ...legalData, ...updateData });

    // Expect update to be called once
    expect(strapi.plugin('omcommerce').service('legal').update).toBeCalledTimes(1);
  });

  it('should throw an error when updating legal information', async () => {
    const updateData = {
      checked: false,
      returnRules: 'Updated return rules',
      returnShippingCost: 'Paid',
      returnWindow: '60 days',
      restockingFee: 10,
      returnPolicy: 'Updated return policy',
      privacyPolicy: 'Updated privacy policy',
      termsOfService: 'Updated terms of service',
      shippingPolicy: 'Updated shipping policy',
      online: 'Updated online terms',
    };

    const ctx: any = {
      params: { id: 1 },
      request: { body: updateData },
      body: null,
      throw: jest.fn(), // Mocking the throw function
    };

    // Simulate an error in the update method
    strapi.plugin('omcommerce').service('legal').update.mockRejectedValueOnce('Simulated error');

    // @ts-ignore
    await legalController({ strapi }).update(ctx);

    // Expect throw to be called with the correct parameters
    expect(ctx.throw).toHaveBeenCalledWith(500, 'Simulated error');
  });
});
