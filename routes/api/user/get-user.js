'use strict';

const { default: mongoose } = require("mongoose");
const User = require("../../../models/user");

const routeOpts = {
    schema: {
        params: {

        },
        response: {
            200: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number' },
                    user: { type: 'object' }
                }
            }
        }
    }
};

module.exports = async function(fastify, opts) {
    fastify.get('/:user_id', routeOpts, async function (request, reply) {
        const user_id = request.params.user_id;

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            reply.badRequest(`${user_id} is not a valid id`);
        }

        const user = await User.find({
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