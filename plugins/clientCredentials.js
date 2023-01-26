const fp = require("fastify-plugin");

module.exports = fp(async function (fastify, opts) {
    fastify.decorate('clientCredentials', async (clientId, clientSecret) => {
        const response = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
        });

        if (response.ok) {
            return response.json();
        } else {
            throw { name: 'AccessTokenError', message: 'failed to retrieve app access token' }
        }
        
    });
})