const fp = require("fastify-plugin");

module.exports = fp(async function (fastify, opts) {
    fastify.decorate('createEventSub', async (broadcaster_user_id) => {
        const response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.TTV_ACCESS_TOKEN}`,
                'Client-Id': process.env.TTV_CLIENT_ID,
                'Content-Type': 'application/json'
            },
            body: {
                'type': 'stream.online',
                'version': '1',
                'condition': { 'user_id': broadcaster_user_id },
                'transport': {
                    'method': 'webhook',
                    'callback': `https://${process.env.VERCEL_URL}/api/webhook/callback`,
                    'secret': process.env.TTV_HMAC_SECRET
                }
            }
        });

        if (response.ok) {
            return response.json();
        } else {
            throw { name: 'EventSubError', message: 'failed to create eventsub subscription', statusCode: response.status }
        }
    });
})