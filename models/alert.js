const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    eventsub_id: {
        type: String,
        required: [ true, 'Subscription property "eventsub_id" is required' ]
    },
    content: {
        type: String,
        required: [ true, 'Subscription property "message" is required' ]
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [ true, 'Subscription property "owner" is required']
    }
});

const Alert = mongoose.model('alert', schema);
module.exports = Alert;