/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
var config = require('./../../config')
var mongodb = require('./mongodb');

// var Thing = mongodb.Thing;
var OAuthAccessToken = mongodb.OAuthAccessToken
var OAuthAuthorizationCode = mongodb.OAuthAuthorizationCode
var OAuthClient = mongodb.OAuthClient
var OAuthRefreshToken = mongodb.OAuthRefreshToken
var OAuthScope = mongodb.OAuthScope
var User = mongodb.User

// Some of this code was inspired from the following sources (official doc for oauth2orize)
// https://github.com/gerges-beshay/oauth2orize-examples/blob/master/utils/index.js

OAuthAccessToken.remove({})
  .then(function () {
    console.log('-- removed OAuthAccessToken');
  });

OAuthRefreshToken.remove({})
  .then(function () {
    console.log('-- removed OAuthRefreshToken');
  });

OAuthAuthorizationCode.remove({})
  .then(function () {
    console.log('-- removed OAuthAuthorizationCode');
  });

OAuthScope.find({}).remove()
  .then(function () {
    OAuthScope.create({
      scope: 'profile',
      is_default: true
    })
      .then(function (oauthscope) {
        console.log('++ finished populating OAuthScope', oauthscope);
      });
  });

User.find({}).remove()
  .then(function () {
    User.create({
      username: 'admin',
      password: 'admin',
      address: '123 Admin street, nowhere city, Z1Z 1Z1, NW'
    }, {
        username: 'issam',
        password: '123456',
        address: '777 Issam street, somewhere city, Z1Z 1Z1, NW'
      })
      .then(function (user) {
        console.log('++ finished populating users', user);
        return OAuthClient.find({}).remove()
          .then(function () {
            OAuthClient.create({
              client_id: 'vente1',
              client_secret: 'vente1NeVendRien',
              redirect_uri: 'http://localhost:3000/',
              User: user._id
            })
              .then(function (client) {
                console.log('++ finished populating OAuthClient', client);
              }).catch(console.log);
          });

      });
  });