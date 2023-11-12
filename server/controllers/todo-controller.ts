import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  async index(ctx: { request: { body: { name: any; }; }; body: string; }) {
    const { name } = ctx.request.body
    await strapi.plugin('todo').service('create').create({ name })
    return ctx.body = 'created'
  },
  async complete(ctx: { request: { body: { id: any; }; }; body: string; }) {
    const { id } = ctx.request.body
    await strapi.plugin('todo').service('complete').complete({ id })
    return ctx.body = 'todo completed'
  },
})
