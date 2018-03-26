
//  DB

var config = require('./../../config')
var mongoose = require('mongoose');
var userModel = require('./User')

mongoose.connect(config.mongo.uri, function (err) {
  if (err) return console.log(err);
  console.log('Connected to OAuth DB :\')');
});

var db = {};
db.OAuthAccessToken = require('./OAuthAccessToken')
db.OAuthAuthorizationCode = require('./OAuthAuthorizationCode')
db.OAuthClient = require('./OAuthClient')
db.User = require('./User')

module.exports = db;