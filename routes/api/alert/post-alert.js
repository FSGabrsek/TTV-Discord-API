'use strict';

const { default: mongoose } = require("mongoose");
const Alert = require("../../../models/alert");

const routeOpts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number' },
                    subscriptions : { 
                        type: 'array', 
                        items: {
                            type: 'object',
                            properties: {
                                
                            }
                        }
                    }
                }
            }
        }
    }
};

module.exports = async function(fastify, opts) {
    fastify.post('/', routeOpts, async function (request, reply) {
        const { authorization } = request.headers;
        const { broadcaster_user_id } = request.body;

        if (!authorization) {
            reply.unauthorized('missing authorisation header');
        } else {
            const bearer = authorization.substring(7);
            try {
                const decoded = fastify.authenticate(bearer, process.env.JWT_KEY);

                if (decoded.perms < 1) {
                    reply.forbidden('user does not have permissions to access this resource');
                } else {
                    const session = await mongoose.startSession();

                    try {
                        session.startTransaction();

                        const props = {
                            eventsub_id: 'subscription_id pending...',
                            discord_webhooks: []
                        }
                        let alert = await Alert.create(props).session(session);

                        let eventSub;
                        try {
                            eventSub = await fastify.createEventSub(broadcaster_user_id);
                        } catch (error) {
                            const clientCredentials = await fastify.clientCredentials(process.env.TTV_CLIENT_ID, process.env.TTV_CLIENT_SECRET);

                            const aat = clientCredentials.access_token;
                            process.env.TTV_ACCESS_TOKEN = aat; 

                            eventSub = await fastify.createEventSub(broadcaster_user_id);
                        }
                        
                        alert.eventsub_id = eventSub.id;
                        alert = await alert.save();
                        await session.commitTransaction();

                        return {
                            statusCode: 201,
                            alert: alert
                        };
                        
                    } catch (error) {
                        await session.abortTransaction();
                        await session.endSession();

                        fastify.httpErrors.createError(error.statusCode?? 500);
                    }
                }
            } catch (error) {
                console.log(error);
                reply.unauthorized('bearer token is invalid');
            }
        }
    });
};