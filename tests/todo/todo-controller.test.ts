import todoController from "../../server/controllers/todo-controller";

describe('Todo Controller', () => {
  let strapi: { plugin: any; };
  beforeEach(async function () {
    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          create: jest.fn().mockReturnValue({
            data: {
              name: 'test',
              status: false,
            }
          }),
          complete: jest.fn().mockReturnValue({
            data: {
              id: 1,
              status: true,
            }
          })

        })
      })
    }
  })
  it('should create a todo', async function () {
    const ctx = {
      request: {
        body: {
          name: 'test'
        }
      },
      body: null
    }

    // @ts-ignore
    await todoController({strapi}).index(ctx);
    // await todoController({strapi}).index(ctx)
    // expect the body to be 'created'
    expect(ctx.body).toBe('created')
    // expect create to be called once
    expect(strapi.plugin('todo').service('create').create).toBeCalledTimes(1)
  })
  it('should complete a todo', async function(){
    const ctx = {
      request: {
        body: {
          id: 1
        }
      },
      body: null
    }
    // @ts-ignore
    await todoController({strapi}).complete(ctx)
    // expect the body to be 'todo completed'
    expect(ctx.body).toBe('todo completed')
    // expect complete to be called once
    expect(strapi.plugin('todo').service('complete').complete).toBeCalledTimes(1)
  })
})
