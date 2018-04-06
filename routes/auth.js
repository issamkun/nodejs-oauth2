'use strict';

const passport = require('passport');
const mongodb = require('../oauth/models');
const validate = require('../utils/validate');

var User = mongodb.User;
var Token = mongodb.OAuthAccessToken;
var Client = mongodb.OAuthClient;


const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: BearerStrategy } = require('passport-http-bearer');
const { BasicStrategy } = require('passport-http');

// Some of this code was inspired from the following sources (official doc for oauth2orize)
// https://github.com/gerges-beshay/oauth2orize-examples/blob/master/utils/index.js

/**
 * LocalStrategy
 *
 * Authenticate users based on a user email and password.
 */
passport.use(new LocalStrategy((email, password, done) => {
  User.findOne({ email })
    .then(user => validate.user(user, password))
    .then(user => done(null, user))
    .catch(() => done(null, false));
}));

/**
 * BasicStrategy
 *
 * Authenticate registered OAuth clients.
 */
passport.use(new BasicStrategy((clientId, clientSecret, done) => {
  Client.findOne({ client_id: clientId })
    .then(client => validate.client(client, clientSecret))
    .then(client => done(null, client))
    .catch(() => done(null, false));
}));

/**
 * Bearer Strategy
 *
 * Authenticate users based on a bearer token (access token).
 */
passport.use(new BearerStrategy(
  function (accessToken, callback) {
    Token.findOne({ access_token: accessToken }, function (err, token) {
      // TODO verify this part
      if (err) { return callback(err); }

      // No token found
      if (!token) { return callback(null, false); }
      console.log(">>>> found a token : ", token);

      User.findOne({ _id: token.User }, function (err, user) {
        if (err) { return callback(err); }

        // No user found
        if (!user) { return callback(null, false); }
        
        // Simple example with no scope
        callback(null, user, { scope: '*' });

      });
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(err => done(err));
});