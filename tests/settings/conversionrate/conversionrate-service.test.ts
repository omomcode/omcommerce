import conversionRateService from "../../../server/services/conversionrate";

describe('Conversion Rate Service', () => {
  let strapi: { entityService: any; };

  beforeEach(async function () {
    strapi = {
      entityService: {
        findOne: jest.fn().mockImplementation((model: string, query: any) => {
          // Mock the behavior of findOne method
          // Return data based on your test scenario
          return {
            id: 1,
            rate: 0.0082327,
            spread: 0.025 / 100,
            conversion_currency: "RSD",
          };
        }),
        create: jest.fn().mockImplementation((model: string, data: any) => {
          // Mock the behavior of create method
          // Return data based on your test scenario
          return {
            id: 1,
            rate: data.rate,
            spread: data.spread,
            conversion_currency: data.conversion_currency,
          };
        }),
        update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
          // Mock the behavior of update method
          // Return data based on your test scenario
          return {
            id: 1,
            rate: 0.0085000, // Updated rate for testing
            spread: 0.030 / 100, // Updated spread for testing
            conversion_currency: "USD", // Updated conversion currency for testing
          };
        }),
      },
    };
  });

  it('should create a conversion rate record', async function () {
    const conversionRateData = {
      rate: 0.0082327,
      spread: 0.025 / 100,
      conversion_currency: "RSD",
    };

    // @ts-ignore
    const createdConversionRate = await conversionRateService({ strapi }).create(conversionRateData);
    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(createdConversionRate.id).toBe(1);
    expect(createdConversionRate.rate).toBe(0.0082327);
    // Add similar expectations for other properties
  });

  it('should find a conversion rate record', async function () {
    const query = { /* your query parameters */ };

    // @ts-ignore
    const foundConversionRate = await conversionRateService({ strapi }).find(query);

    expect(strapi.entityService.findOne).toBeCalledTimes(1);

    // Check if foundConversionRate is not null before accessing properties
    if (foundConversionRate) {
      // Add more specific expectations based on your test scenario
      expect(foundConversionRate.id).toBe(1);
      expect(foundConversionRate.rate).toBe(0.0082327);
      // Add similar expectations for other properties
    } else {
      // Handle the case where foundConversionRate is null if needed
      fail('Conversion rate record not found'); // This will cause the test to fail
    }
  });

  it('should update a conversion rate record', async function () {
    const conversionRateId = 1;
    const updateData = { /* your update data */ };

    // @ts-ignore
    const updatedConversionRate = await conversionRateService({ strapi }).update(conversionRateId, updateData);

    expect(strapi.entityService.update).toBeCalledTimes(1);

    // Check if updatedConversionRate is not null before accessing properties
    if (updatedConversionRate) {
      // Add more specific expectations based on your test scenario
      expect(updatedConversionRate.id).toBe(1);
      expect(updatedConversionRate.rate).toBe(0.0085000);
      // Add similar expectations for other properties
    } else {
      // Handle the case where updatedConversionRate is null if needed
      fail('Conversion rate record not updated'); // This will cause the test to fail
    }
  });
});
