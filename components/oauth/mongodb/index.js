
//  DB

var config = require('./../../../config')
var mongoose = require('mongoose');
console.log(config.mongo.uri)

mongoose.connect(config.mongo.uri, function (err) {
  if (err) return console.log(err);
  console.log('Mongoose Goose Connected :\')');
});

var db = {};
db.OAuthAccessToken = require('./OAuthAccessToken')
db.OAuthAuthorizationCode = require('./OAuthAuthorizationCode')
db.OAuthClient = require('./OAuthClient')
db.OAuthRefreshToken = require('./OAuthRefreshToken')
db.OAuthScope = require('./OAuthScope')
db.User = require('./User')

module.exports = db;