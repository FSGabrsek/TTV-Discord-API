'use strict';

const base = process.env.BASE_URL

const routeOpts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    info: { type: 'string' },
                    sessions: { type: 'string' },
                    users: { type: 'string' },
                    subscriptions: { type: 'string' }
                }
            }
        }
    }
};

module.exports = async function(fastify, opts) {
    fastify.get('/', routeOpts, async function (request, reply) {
        return {
            info: `${base}/info`,
            sessions: `${base}/session`,
            users: `${base}/user`,
            subscriptions: `${base}/subscription`
        }
    });
};