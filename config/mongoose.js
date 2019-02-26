const mongoose = require('mongoose');
const moment = require('moment-timezone');
const config = require('./index');
const User = require('../api/models/user.model');

Promise = require('bluebird'); // eslint-disable-line no-global-assign

mongoose.Promise = Promise;

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

if (config.env === 'development') {
  mongoose.set('debug', true);
}

exports.connect = async () => {
  const options = {
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 10,
    bufferMaxEntries: 0,
  };
  await mongoose.connect(config.mongo.uri, options);

  let adminUser = await User.findOne({ role: 'admin' }).exec();
  if (!adminUser) {
    const admin = await (new User({
      email: 'admin@example.com',
      password: 'password',
      username: 'admin',
      role: 'admin',
    })).save();
    adminUser = admin;
  }
};
