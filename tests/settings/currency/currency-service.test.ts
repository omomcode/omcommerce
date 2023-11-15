import currencyService from "../../../server/services/currency";

describe('Currency Service', () => {
  let strapi: { entityService: any; };

  beforeEach(async function () {
    strapi = {
      entityService: {
        findOne: jest.fn().mockImplementation((model: string, query: any) => {
          // Mock the behavior of findOne method
          // Return data based on your test scenario
          return {
            id: 1,
            currency: "EUR",
          };
        }),
        create: jest.fn().mockImplementation((model: string, data: any) => {
          // Mock the behavior of create method
          // Return data based on your test scenario
          return {
            id: 1,
            currency: data.currency,
          };
        }),
        update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
          // Mock the behavior of update method
          // Return data based on your test scenario
          return {
            id: 1,
            currency: "USD", // Updated currency for testing
          };
        }),
      },
    };
  });

  it('should create a currency record', async function () {
    const initialData = {
      currency: "EUR",
    };

    // @ts-ignore
    const createdCurrency = await currencyService({ strapi }).create(initialData);
    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(createdCurrency.id).toBe(1);
    expect(createdCurrency.currency).toBe("EUR");
    // Add similar expectations for other properties
  });

  it('should find a currency record', async function () {
    const query = { /* your query parameters */ };

    // @ts-ignore
    const foundCurrency = await currencyService({ strapi }).find(query);

    expect(strapi.entityService.findOne).toBeCalledTimes(1);

    // Check if foundCurrency is not null before accessing properties
    if (foundCurrency) {
      // Add more specific expectations based on your test scenario
      expect(foundCurrency.id).toBe(1);
      expect(foundCurrency.currency).toBe("EUR");
      // Add similar expectations for other properties
    } else {
      // Handle the case where foundCurrency is null if needed
      fail('Currency record not found'); // This will cause the test to fail
    }
  });

  it('should update a currency record', async function () {
    const currencyId = 1;
    const updateData = { /* your update data */ };

    // @ts-ignore
    const updatedCurrency = await currencyService({ strapi }).update(currencyId, updateData);

    expect(strapi.entityService.update).toBeCalledTimes(1);

    // Check if updatedCurrency is not null before accessing properties
    if (updatedCurrency) {
      // Add more specific expectations based on your test scenario
      expect(updatedCurrency.id).toBe(1);
      expect(updatedCurrency.currency).toBe("USD");
      // Add similar expectations for other properties
    } else {
      // Handle the case where updatedCurrency is null if needed
      fail('Currency record not updated'); // This will cause the test to fail
    }
  });
});
