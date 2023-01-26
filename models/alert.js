const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discordWebHook = new Schema({
    content: {
        type: String,
        required: [ true, 'discordWebHook property "content" is required' ]
    },
    url: {
        type: String,
        required: [ true, 'discordWebHook property "url" is required']
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [ true, 'discordWebHook property "owner" is required']
    }
})

const schema = new Schema({
    eventsub_id: {
        type: String,
        required: [ true, 'Subscription property "eventsub_id" is required' ]
    },
    discord_webhooks: [discordWebHook]
});

const Alert = mongoose.model('alert', schema);
module.exports = Alert;