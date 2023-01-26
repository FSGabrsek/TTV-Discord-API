'use strict';

const { genSalt, hash } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const User = require("../../../models/user");

const saltRounds = 10;
const emailRegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const routeOpts = {
    schema: {
        body: {
            type: 'object',
            properties: {
                email: { type: 'string' },
                username: { type: 'string' },
                password: { type: 'string' }
            },
            required: [
                'email',
                'username',
                'password'
            ],
            additionalProperties: false
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number' },
                    user: {
                        type: 'object',
                        properties: {
                            _id: { type: 'string' },
                            username: { type: 'string' },
                            email: { type: 'string' },
                            permissions: { type: 'string' }
                        }
                    },
                    token: { type: 'string' },
                    expires: { type: 'string' }
                }
            }
        }
    }
};

module.exports = async function(fastify, opts) {
    fastify.post('/', routeOpts, async function (request, reply) {
        const { email, username, password } = request.body;

        if (!email.match(emailRegExp)) {
            reply.badRequest('email format is invalid');
        } else {
            const salt = await genSalt(saltRounds);
            const key = await hash(password, salt);

            const props = {
                username: username,
                key: key,
                email: email,
                permissions: 0
            };

            try {
                const user = await User.create(props);

                const expDate = new Date();
                expDate.setHours(expDate.getHours() + 1);
                const bearer = sign(
                    {
                        sub: user._id.toString(),
                        name: user.username,
                        email: user.email,
                        perms: user.permissions
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: '1h'
                    }
                );

                return {
                    statusCode: 201,
                    user: user,
                    token: bearer,
                    expires: expDate.toISOString()
                }

            } catch (error) {
                console.log(error);
                reply.internalServerError('server failed to create user')
            }
        }
    });
};