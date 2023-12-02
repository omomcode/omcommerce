import legalService from '../../../server/services/legal';
import { ILegal } from '../../../types/legal';

describe('Legal Service', () => {
  let strapi: { entityService: any; };
  let legalData: ILegal;

  beforeEach(async function () {
    legalData = {
      id: 1,
      checked: true,
      returnShippingCost: 'Free',
      returnWindow: '30 days',
      restockingFee: 5,
      returnPolicy: 'Original return policy',
      privacyPolicy: 'Original privacy policy',
      termsOfService: 'Original terms of service',
      shippingPolicy: 'Original shipping policy',
      online: 'Original online terms',
    };

    strapi = {
      entityService: {
        create: jest.fn().mockImplementation((model: string, data: any) => {
          return {
            id: 2,
            ...data,
          };
        }),
        findOne: jest.fn().mockImplementation((model: string, query: any) => {
          return [legalData];
        }),
        update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
          return { id, ...data };
        }),
      },
    };
  });

  it('should create legal information', async function () {
    const newLegalData = {
      checked: true,
      returnRules: 'New return rules',
      returnShippingCost: 'Paid',
      returnWindow: '45 days',
      restockingFee: 8,
      returnPolicy: 'New return policy',
      privacyPolicy: 'New privacy policy',
      termsOfService: 'New terms of service',
      shippingPolicy: 'New shipping policy',
      online: 'New online terms',
    };

    // @ts-ignore
    const createdLegal: ILegal = await legalService({ strapi }).create(newLegalData);

    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(createdLegal).not.toBeNull();
    expect(createdLegal.id).toBe(2);
    // Add similar expectations for other properties of the created legal information
  });

  it('should throw an error when strapi.entityService is not defined (create)', async function () {
    // Arrange
    const newLegalData = {
      checked: true,
      returnRules: 'New return rules',
      returnShippingCost: 'Paid',
      returnWindow: '45 days',
      restockingFee: 8,
      returnPolicy: 'New return policy',
      privacyPolicy: 'New privacy policy',
      termsOfService: 'New terms of service',
      shippingPolicy: 'New shipping policy',
      online: 'New online terms',
    };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await legalService({ strapi }).create(newLegalData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should find all legal information', async function () {
    // @ts-ignore
    const foundLegal: ILegal[] = await legalService({ strapi }).find();

    expect(strapi.entityService.findOne).toBeCalledTimes(1);
    expect(foundLegal).not.toBeNull();
    expect(foundLegal.length).toBe(1);
    expect(foundLegal[0].id).toBe(1);
    // Add similar expectations for other properties
  });

  it('should throw an error when strapi.entityService is not defined (find)', async function () {
    // Arrange
    const query = { /* your query here */ };

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await legalService({ strapi }).find(query);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });

  it('should update legal information', async function () {
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

    // @ts-ignore
    const updatedLegal: ILegal = await legalService({ strapi }).update(1, updateData);

    expect(strapi.entityService.update).toBeCalledTimes(1);
    expect(updatedLegal).not.toBeNull();
    expect(updatedLegal.id).toBe(1);
    // Add similar expectations for other properties of the updated legal information
  });

  it('should throw an error when strapi.entityService is not defined (update)', async function () {
    // Arrange
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

    // Temporarily set strapi.entityService to undefined
    strapi.entityService = undefined;

    // Act & Assert
    try {
      // @ts-ignore
      await legalService({ strapi }).update(1, updateData);
      // If the above line does not throw an error, fail the test
      fail('Expected an error but did not receive one.');
    } catch (error: any) {
      // Assert that the error message matches the expected message
      expect(error.message).toBe('strapi.entityService is not defined');
    }
  });
});
