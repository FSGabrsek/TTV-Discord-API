'use strict';

const { compare } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const User = require("../../../models/user");

const saltRounds = 10;

const routeOpts = {
    schema: {
        body: {
            type: 'object',
            properties: {
                email: { type: 'string' },
                password: { type: 'string' }
            },
            required: [
                'email',
                'password'
            ],
            additionalProperties: false
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    statusCode: { type: 'number' },
                    token: { type: 'string' },
                    expires: { type: 'string' }
                }
            }
        }
    }
};

module.exports = async function(fastify, opts) {
    fastify.post('/', routeOpts, async function (request, reply) {
        const { email, password } = request.body;
    
        const user = await User.findOne({
            email: email
        });
        
        if (user && await compare(password, user.key)) {
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
                token: bearer,
                expires: expDate.toISOString()
            }
        } else {
            reply.unauthorized('email or password is incorrect')
        }
    });
};