import myControllerTest from '../server/controllers/my-controller';

describe('Welcome Controller', () => {

  let strapi: { plugin: any; };
  beforeEach(function () {
    // Mock the strapi object to simulate the behavior
    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          getWelcomeMessage: jest.fn().mockReturnValue('Welcome to the app'),
        }),
        query: jest.fn(),
        log: {
          error: jest.fn(),
        },
      })
    };
  });

  it('should return a welcome message', async function () {
    const ctx = {
      body: null,
    };

    // Call the controller function with the mocked strapi object
    // @ts-ignore
    await myControllerTest({strapi}).index(ctx);

    // Expectations
    expect(ctx.body).toBe('Welcome to the app');
    expect(strapi.plugin('omcommerce').service('myService').getWelcomeMessage).toBeCalledTimes(1);
  });

});
