'use strict';

const routeOpts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number' },
                    challenge: { type: 'string' }
                }
            }
        }
    }
};

module.exports = async function(fastify, opts) {
    fastify.post('/', routeOpts, async function (request, reply) {
        const { challenge } = request.body;

        return {
            statusCode: 200,
            challenge: challenge
        };
    });
};