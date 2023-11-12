import {Strapi} from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  async create({ name } : {name : string} ) {

    let todo: any;
    try {
      todo = await strapi.query('plugin::todo.todo').create({
          data: {
            name,
            status: false,
          }
        }
      )
    } catch (e) {
      strapi.log.error(e)
    }
    return todo
  },
});
