'use strict';

// Register oauth2orize grant types.

const login = require('connect-ensure-login');
const oauth2orize = require('oauth2orize');
const passport = require('passport');
const jwt = require('jsonwebtoken')
const config = require('../config')
const tgen = require('../utils/tokenGenerator');
const validate = require('../utils/validate');
const db = require('./models/index');

// Server creation
const server = oauth2orize.createServer();

// Some of this code was inspired from the following sources (official doc for oauth2orize)
// https://github.com/gerges-beshay/oauth2orize-examples/blob/master/utils/index.js

// Code grant type registration
server.grant(oauth2orize.grant.code(function (client, redirectUri, user, ares, callback) {
    
    var code = new db.OAuthAuthorizationCode({
        authorization_code: tgen(16),
        OAuthClient: client._id,
        redirect_uri: redirectUri,
        User: user._id
    });
    console.log('>>>>> this is the saved code', code);
    code.save(function (err) {
        if (err) { return callback(err); }
        callback(null, code.authorization_code);
    });
}));


// Exchange authorization code for an access token
server.exchange(oauth2orize.exchange.code(function (client, code, redirectUri, callback) {
    db.OAuthAuthorizationCode.findOne({ authorization_code: code }, function (err, authCode) {
        console.log('>>>>> this is the client '+ '\n' + client);
        console.log('>>>>> this is the code ', code);
        console.log('>>>>> this is the redirectUri ', redirectUri);
        console.log('>>>>> this is the auth_code ' + '\n' + authCode);
        if (err) { return callback(err); }
        if (authCode === undefined) { return callback(null, false); }
        const clientString = client.toString();
        const authCodeString = authCode.toString();

        var jwt_token = jwt.sign({id: authCode.User}, config.sessionSecret)
        // var jwt_token = jwt.sign({id: authCode.User}, config.sessionSecret, {noTimestamp: true} )
        
        // TODO add token here and insert it in DB Issam was here un moment donné et il a perdu beaucoup de temps :)
        console.log(" <>----jwt----<> Creating a token for the logged in User" + '\n' +
         "User id: " + authCode.User  + '\n' +
         "Generated jwt: " + jwt_token )

        var decrypted_userID = jwt.verify(jwt_token, config.sessionSecret)

        console.log(" <>----jwt----<> The decoded user ID is: " + JSON.stringify(decrypted_userID) )


        if (clientString._id !== authCodeString.OAuthClient) { return callback(null, false); }
        if (redirectUri !== authCode.redirect_uri) { return callback(null, false); }

        authCode.remove(function (err) {
            if (err) { return callback(err); }
            var token = new db.OAuthAccessToken({
                // access_token: tgen(256),
                access_token: jwt_token,
                User: authCode.User,
                OAuthClient: authCode.OAuthClient,
            });
            console.log('>>>>> this is the saved access token' + '\n' + token);
            token.save(function (err) {
                if (err) { return callback(err); }
                callback(null, token);
            });
        });
    });
}));



// Rendering decision dialog in authorization endpoint
exports.authorization = [
    login.ensureLoggedIn(),
    server.authorization(function (client_id, redirect_uri, callback) {

        db.OAuthClient.findOne({ client_id: client_id }, function (err, client) {
            if (err) { return callback(err); }
            return callback(null, client, redirect_uri);
        })
            .catch(err => callback(err));
    }),
    function (req, res) {
        res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
    }
];

// Decision endpoint
exports.decision = [
    server.decision()
];

// Token endpoint
exports.token = [
    passport.authenticate(['basic'], { session: false }),
    server.token(),
    server.errorHandler(),
];

// Register serialialization and deserialization functions.
server.serializeClient(function (client, callback) {
    return callback(null, client._id);
});

server.deserializeClient(function (id, callback) {
    db.OAuthClient.findOne({ _id: id }, function (err, client) {
        if (err) { return callback(err); }
        return callback(null, client);
    });
});