'use strict';

const { default: mongoose } = require("mongoose");
const User = require("../../../models/user");

const routeOpts = {
    schema: {
        params: {
            user_id: { type: 'string' }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number' },
                    user: { 
                        type: 'object', 
                        properties: {
                            username: { type: 'string' },
                            email: { type: 'string' },
                            permissions: { type: 'number' }
                        }
                    }
                }
            }
        }
    }
};

module.exports = async function(fastify, opts) {
    fastify.get('/:user_id', routeOpts, async function (request, reply) {
        const { user_id } = request.params;

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            reply.badRequest(`${user_id} is not a valid id`);
        }

        const user = await User.findOne({
            _id: user_id
        });

        if (user._id == user_id) {
            return {
                statusCode: 200,
                user: user
            };
        } else {
            reply.notFound(`user ${user_id} could not be found`);
        }
    });
};