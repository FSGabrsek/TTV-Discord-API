const fp = require("fastify-plugin");
const { verify } = require("jsonwebtoken");

module.exports = fp(async function (fastify, opts) {
    fastify.decorate('authenticate', (token, key) => {
        const decoded = verify(token, key);
        if (decoded.sub && decoded.name && decoded.email && decoded.perms) {
            return decoded;
        } else {
            throw { name: 'InvalidPayloadError', message: 'token payload is missing required properties' };
        }
    });
})