/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
var mongodb = require('./models');

// var Thing = mongodb.Thing;
var OAuthAuthorizationCode = mongodb.OAuthAuthorizationCode
var OAuthAccessToken = mongodb.OAuthAccessToken
var OAuthClient = mongodb.OAuthClient
var User = mongodb.User

// Some of this code was inspired from the following sources (official doc for oauth2orize)
// https://github.com/gerges-beshay/oauth2orize-examples/blob/master/utils/index.js

OAuthAccessToken.remove({})
  .then(function () {
    console.log('-- removed OAuthAccessToken');
  });

OAuthAuthorizationCode.remove({})
  .then(function () {
    console.log('-- removed OAuthAuthorizationCode');
  });

User.find({}).remove()
  .then(function () {
    User.create({
      email: 'admin@admin.admin',
      password: '123456',
      firstname: 'Admin',
      lastname: 'Strator',
      address: '123 Admin street app 100',
      city: 'Admin city',
      postalCode: 'Z1Z 1Z1',
      province: 'QC',
      role: 'admin',
      picture: 'https://google.ca/ico.png'
    }, {
        email: 'user@user.user',
        password: '123456',
        firstname: 'Hans',
        lastname: 'Herbjornsrud',
        address: '123 Jhonson street app 10',
        city: 'Jhonson city',
        postalCode: 'Z2Z 1Z1',
        province: 'QC',
        role: 'user',
        picture: 'https://google.ca/lol.png'
      })
      .then(function (user) {
        console.log('++ finished populating users', user);
        return OAuthClient.find({}).remove()
          .then(function () {
            OAuthClient.create({
              client_id: 'vente1',
              client_secret: 'vente1',
              redirect_uri: 'http://localhost:3000/',
              User: user._id
            }, {
                client_id: 'vente2',
                client_secret: 'vente2',
                redirect_uri: 'http://localhost:3000/',
                User: user._id
              }, {
                client_id: 'vente2',
                client_secret: 'vente2',
                redirect_uri: 'http://localhost:8080/',
                User: user._id
              }, {
                client_id: 'vente2',
                client_secret: 'vente2',
                redirect_uri: 'https://h18-vente2-front.herokuapp.com/uniq',
                User: user._id
              }, {
                client_id: 'vente1',
                client_secret: 'vente1',
                redirect_uri: 'http://localhost:8080/',
                User: user._id
              }, {
                client_id: 'vente1',
                client_secret: 'vente1',
                redirect_uri: 'http://localhost:8000/',
                User: user._id
              }
            )
              .then(function (client) {
                console.log('++ finished populating OAuthClient', client);
              }).catch(console.log);
          });

      });
  });