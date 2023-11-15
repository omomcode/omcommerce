import gmailService from "../../../server/services/gmail";

describe('Gmail Service', () => {
  let strapi: { entityService: any; };

  beforeEach(async function () {
    strapi = {
      entityService: {
        findOne: jest.fn().mockImplementation((model: string, query: any) => {
          // Mock the behavior of findOne method
          // Return data based on your test scenario
          return {
            id: 1,
            client_id: "CLIENTID",
            client_secret: "CLIENTSECRET",
            refresh_token: "SECRETREFRESHCODE",
            from: "info@example.com",
          };
        }),
        create: jest.fn().mockImplementation((model: string, data: any) => {
          // Mock the behavior of create method
          // Return data based on your test scenario
          return {
            id: 1,
            client_id: data.client_id,
            client_secret: data.client_secret,
            refresh_token: data.refresh_token,
            from: data.from,
          };
        }),
        update: jest.fn().mockImplementation((model: string, id: any, data: any) => {
          // Mock the behavior of update method
          // Return data based on your test scenario
          return {
            id: 1,
            client_id: "UPDATEDCLIENTID", // Updated client_id for testing
            client_secret: "UPDATEDCLIENTSECRET", // Updated client_secret for testing
            refresh_token: "UPDATEDSECRETREFRESHCODE", // Updated refresh_token for testing
            from: "updated_info@example.com", // Updated from for testing
          };
        }),
      },
    };
  });

  it('should create a Gmail record', async function () {
    const initialData = {
      client_id: "CLIENTID",
      client_secret: "CLIENTSECRET",
      refresh_token: "SECRETREFRESHCODE",
      from: "info@example.com",
    };

    // @ts-ignore
    const createdGmail = await gmailService({ strapi }).create(initialData);
    expect(strapi.entityService.create).toBeCalledTimes(1);
    expect(createdGmail.id).toBe(1);
    expect(createdGmail.client_id).toBe("CLIENTID");
    // Add similar expectations for other properties
  });

  it('should find a Gmail record', async function () {
    const query = { /* your query parameters */ };

    // @ts-ignore
    const foundGmail = await gmailService({ strapi }).find(query);

    expect(strapi.entityService.findOne).toBeCalledTimes(1);

    // Check if foundGmail is not null before accessing properties
    if (foundGmail) {
      // Add more specific expectations based on your test scenario
      expect(foundGmail.id).toBe(1);
      expect(foundGmail.client_id).toBe("CLIENTID");
      // Add similar expectations for other properties
    } else {
      // Handle the case where foundGmail is null if needed
      fail('Gmail record not found'); // This will cause the test to fail
    }
    // Add similar expectations for other properties
  });

  it('should update a Gmail record', async function () {
    const gmailId = 1;
    const updateData = { /* your update data */ };

    // @ts-ignore
    const updatedGmail = await gmailService({ strapi }).update(gmailId, updateData);

    expect(strapi.entityService.update).toBeCalledTimes(1);

    // Check if updatedGmail is not null before accessing properties
    if (updatedGmail) {
      // Add more specific expectations based on your test scenario
      expect(updatedGmail.id).toBe(1);
      expect(updatedGmail.client_id).toBe("UPDATEDCLIENTID");
      // Add similar expectations for other properties
    } else {
      // Handle the case where updatedGmail is null if needed
      fail('Gmail record not updated'); // This will cause the test to fail
    }
  });
});
