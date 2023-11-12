"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async create({ name }) {
        let todo;
        try {
            todo = await strapi.query('plugin::todo.todo').create({
                data: {
                    name,
                    status: false,
                }
            });
        }
        catch (e) {
            strapi.log.error(e);
        }
        return todo;
    },
});
