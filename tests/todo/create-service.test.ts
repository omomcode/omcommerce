import create from "../../server/services/todo-test"
describe('Create Service', () => {

  let strapi: { query: any; };

  beforeEach(async function () {
    strapi = {
      query: jest.fn().mockReturnValue({
        create: jest.fn().mockReturnValue({
          data: {
            name: 'test',
            status: false,
          }
        })
      })
    }
  })
  it('should create a todo', async function () {
    const name = 'test'
    // @ts-ignore
    const todo = await create({ strapi }).create({ name });
    expect(strapi.query('plugin::todo.todo').create).toBeCalledTimes(1)
    expect(todo.data.name).toBe('test')
  })
})
