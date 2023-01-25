'use strict';

const routeOpts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    info: { type: 'string' },
                    subscriptions: { type: 'string' }
                }
            }
        }
    }
};

module.exports = async function(fastify, opts) {
    fastify.get('/', routeOpts, async function (request, reply) {
        return {
            info: '/info',
            subscriptions: '/subscriptions'
        }
    });
};