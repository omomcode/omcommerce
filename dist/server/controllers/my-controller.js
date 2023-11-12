"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async index(ctx) {
        ctx.body = strapi
            .plugin('omcommerce')
            .service('myService')
            .getWelcomeMessage();
    },
});
