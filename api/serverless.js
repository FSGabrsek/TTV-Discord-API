'use strict';

import * as dotenv from 'dotenv';
dotenv.config();
import Fastify from 'fastify';
import mongoose from 'mongoose';

const app = Fastify({
  logger: true,
});

mongoose.Promise = global.Promise;
if (process.env.NODE_ENV === 'production') {
    mongoose.connect(process.env.ATLAS_CONN_PROD).then(
        (mongoose) => {
            console.log(`connected to ${mongoose.connection.db.databaseName} via ${mongoose.connection.host}`);
        },
        (err) => {
            console.error(err);
        }
    );
} else {
    mongoose.connect(process.env.ATLAS_CONN_TEST).then(
        (mongoose) => {
            console.log(`connected to ${mongoose.connection.db.databaseName} via ${mongoose.connection.host}`);
        },
        (err) => {
            console.error(err);
        }
    );
}

app.register(require('../app'));

export default async (req, res) => {
    await app.ready();
    app.server.emit('request', req, res);
}