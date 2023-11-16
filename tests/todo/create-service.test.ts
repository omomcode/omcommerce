import create from "../../server/services/todo-test";

describe('Create Service', () => {
  let strapi: { query: any; log: any };

  beforeEach(() => {
    strapi = {
      query: jest.fn().mockReturnValue({
        create: jest.fn().mockImplementation(() => {
          throw new Error('Simulated error');
        })
      }),
      log: {
        error: jest.fn(),
      },
    };
  });

  it('should create a todo', async () => {
    const name = 'test';

    try {
      // @ts-ignore
      await create({ strapi }).create({ name });
    } catch (error) {
      // Expect strapi.query to be called with the correct parameters
      expect(strapi.query).toHaveBeenCalledWith('plugin::todo.todo');

      // Expect strapi.query('plugin::todo.todo').create to be called with the correct parameters
      expect(strapi.query('plugin::todo.todo').create).toHaveBeenCalledWith({
        data: {
          name: 'test',
          status: false,
        },
      });

      // Expect strapi.log.error to be called with the error message
      expect(strapi.log.error).toHaveBeenCalledWith(new Error('Simulated error'));

      // Explicitly define the type of error using 'as'
      expect((error as Error).message).toBe('Simulated error');
    }
  });
});
