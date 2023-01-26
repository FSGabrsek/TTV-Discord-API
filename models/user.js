const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: String,
        required: [ true, 'User property "username" is required' ]
    },
    key: {
        type: String,
        required: [ true, 'User property "password" is required' ]
    },
    email: {
        type: String,
        required: [ true, 'User property "email" is required' ],
        unique: [ true, 'User property "email" must be unique' ]
    },
    permissions: {
        type: Number,
        required: [ true, 'User property "permissions" is required' ]
    }
});

const User = mongoose.model('user', schema);
module.exports = User;